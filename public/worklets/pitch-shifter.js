/**
 * Desplazador de tono (pitch shifter) por linea de retardo con salto y
 * fundido corto.
 *
 * Cambia el tono de la voz SIN cambiar la velocidad: una frase grabada dura
 * lo mismo aunque suene mas aguda o mas grave.
 *
 * Como funciona: la entrada se escribe en un buffer circular a velocidad 1 y
 * se lee a velocidad `pitch`. Al leer mas rapido (o mas lento) que se
 * escribe, el puntero de lectura acaba alcanzando o quedandose atras del de
 * escritura, asi que cada cierto tiempo salta un grano entero hacia atras (o
 * hacia delante) y se hace un fundido corto entre la posicion vieja y la
 * nueva.
 *
 * Ademas, el punto exacto del salto no es fijo: se busca en un entorno la
 * posicion cuya forma de onda encaja mejor con la que se venia leyendo
 * (misma idea que SOLA). Sin esa busqueda, cada empalme mete un salto de
 * fase constante que se traduce en una desafinacion proporcional a lo que se
 * desplaza el tono (medido: hasta un 3% a 0.4x).
 *
 * Se probaron antes dos granos solapados de forma permanente (ventana de
 * Hann), pero al sumar dos copias con un desfase fijo aparece un filtro de
 * peine cuyo primer valle cae justo sobre la fundamental de la voz en
 * desplazamientos pequenos: el tono apenas bajaba y el sonido quedaba hueco.
 * Con un unico grano activo salvo durante el fundido, la salida es una copia
 * limpia desplazada y los artefactos se limitan a esos milisegundos.
 */
class PitchShifterProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: "pitch",
        defaultValue: 1,
        minValue: 0.25,
        maxValue: 4,
        automationRate: "k-rate",
      },
    ];
  }

  constructor() {
    super();
    this.size = 32768;
    this.buffer = new Float32Array(this.size);
    this.write = 0;
    // Grano largo (~80 ms) = pocos saltos; fundido corto (~5 ms) = el salto
    // no se oye como un chasquido.
    this.grain = Math.max(1024, Math.round(sampleRate * 0.06));
    this.fade = Math.max(64, Math.round(sampleRate * 0.005));
    // Rango de busqueda del empalme: al menos un periodo de una voz grave
    // (~50 Hz) para poder alinear la onda.
    this.search = Math.round(sampleRate * 0.015);
    // Margen suficiente para que el puntero viejo no alcance al de escritura
    // durante el fundido, ni siquiera al maximo de 4x.
    this.minLag = this.fade * 4 + this.search + 8;
    // La ventana valida incluye el rango de busqueda: si no, un salto
    // alineado hacia atras puede pasarse del limite superior y disparar otro
    // salto en la muestra siguiente, dejando la lectura oscilando.
    this.maxLag = this.minLag + this.grain + this.search;
    this.read = 0;
    this.fadeRead = 0;
    this.fadeLeft = 0;
    this.primed = false;
    // Rampa de arranque: al empezar, el buffer esta vacio y la lectura pasa
    // de silencio a senal de golpe, lo que se oye como un chasquido.
    this.openRamp = 0;
    this.opened = false;
  }

  sampleAt(pos) {
    const i = Math.floor(pos);
    const frac = pos - i;
    const a = this.buffer[i % this.size];
    const b = this.buffer[(i + 1) % this.size];
    return a + (b - a) * frac;
  }

  /**
   * Busca, alrededor de `target`, la posicion cuyo trozo de onda se parece
   * mas al que se esta leyendo en `from`, para que el empalme no rompa la
   * fase. Devuelve la posicion elegida.
   */
  alignJump(target, from, ratio) {
    const size = this.size;
    const taps = 32;
    const stride = Math.max(1, Math.floor(this.fade / taps)) * ratio;

    const reference = new Float32Array(taps);
    let referenceEnergy = 0;
    for (let k = 0; k < taps; k++) {
      const value = this.sampleAt((from + k * stride) % size);
      reference[k] = value;
      referenceEnergy += value * value;
    }
    if (referenceEnergy < 1e-9) return target;

    // Correlacion normalizada: premia el parecido de forma, no el volumen.
    const scoreAt = (pos) => {
      let dot = 0;
      let energy = 0;
      for (let k = 0; k < taps; k++) {
        const value = this.sampleAt((pos + k * stride) % size);
        dot += reference[k] * value;
        energy += value * value;
      }
      return dot / Math.sqrt(energy + 1e-9);
    };

    // El objetivo se evalua primero para que gane los empates: si no hay nada
    // parecido cerca (silencio, por ejemplo) se salta donde tocaba.
    let bestPos = target;
    let bestScore = scoreAt(target);
    for (let offset = -this.search; offset <= this.search; offset += 2) {
      const pos = (target + offset + size) % size;
      const score = scoreAt(pos);
      if (score > bestScore) {
        bestScore = score;
        bestPos = pos;
      }
    }
    return bestPos;
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    if (!output || output.length === 0) return true;

    const out = output[0];
    const input = inputs[0];
    const inp = input && input.length > 0 ? input[0] : null;

    const size = this.size;
    const grain = this.grain;
    const fade = this.fade;
    const ratio = Math.min(4, Math.max(0.25, parameters.pitch[0]));
    const bypass = Math.abs(ratio - 1) < 1e-4;

    for (let i = 0; i < out.length; i++) {
      const incoming = inp ? inp[i] : 0;
      this.buffer[this.write] = incoming;
      this.write = (this.write + 1) % size;

      if (bypass) {
        out[i] = incoming;
        this.primed = false;
        this.fadeLeft = 0;
        continue;
      }

      if (!this.primed) {
        this.read = (this.write - (this.minLag + grain * 0.5) + size) % size;
        this.fadeLeft = 0;
        this.opened = false;
        this.openRamp = 0;
        this.primed = true;
      }

      let sample = this.sampleAt(this.read);

      if (this.fadeLeft > 0) {
        // Fundido de potencia constante entre la posicion vieja y la nueva.
        const t = (this.fadeLeft / fade) * (Math.PI / 2);
        sample = sample * Math.cos(t) + this.sampleAt(this.fadeRead) * Math.sin(t);
        this.fadeRead = (this.fadeRead + ratio) % size;
        this.fadeLeft--;
      }

      if (!this.opened) {
        if (Math.abs(sample) > 1e-6) this.opened = true;
      }
      if (this.opened && this.openRamp < fade) {
        sample *= this.openRamp / fade;
        this.openRamp++;
      }

      out[i] = sample;
      this.read = (this.read + ratio) % size;

      const lag = (this.write - this.read + size) % size;
      if (lag < this.minLag || lag > this.maxLag) {
        // Tono agudo: la lectura alcanza a la escritura y retrocede un grano.
        // Tono grave: se queda atras y avanza un grano.
        const target = (this.read + (lag < this.minLag ? -grain : grain) + size) % size;
        this.fadeRead = this.read;
        this.fadeLeft = fade;
        this.read = this.alignJump(target, this.read, ratio);
      }
    }

    for (let c = 1; c < output.length; c++) output[c].set(out);

    return true;
  }
}

registerProcessor("pitch-shifter", PitchShifterProcessor);
