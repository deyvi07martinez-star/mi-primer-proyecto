# JARVIS OS

Un asistente propio, corriendo en tu compu, armado con cuatro piezas. Ninguna te ata a un mismo modelo.

- **Claude Code** — el motor. Enruta cada pedido a la skill correcta.
- **Obsidian** — la memoria. Todo lo que corre queda enlazado, en markdown, sin base de datos.
- **Voz local** — oídos y boca. Escucha y responde, 100% privado, nunca sale de tu máquina.
- **HUD** — la cara. Una pantalla con vitales, plan y comandos, sin scroll.

Hablás. JARVIS enruta el trabajo. Corre con cualquier modelo local en la parte de voz. Totalmente modular — cambiá cualquier pieza sin tocar las demás.

## Empezar

Ver [`INSTALL.md`](./INSTALL.md) para la instalación completa paso a paso (incluye instalar Claude Code si todavía no lo tenés).

Resumen rápido si ya tenés Claude Code:
```bash
cd jarvis-os
./setup.sh
```

## Las 4 piezas

```
jarvis-os/
  .claude/skills/   -> el cerebro: metricas, inbox, plan, vault
  vault/             -> la memoria: crudo, medio, pedidos, salidas
  voice/              -> la voz: whisper.cpp (escucha) + piper (habla)
  hud/                -> la cara: pantalla única, terminal oscura
```

Cada pieza se cambia sin tocar las demás. Regla de las skills: **una skill, un propósito.**

## Un día real

| Hora  | Pedido                | Qué pasa |
|-------|------------------------|----------|
| 7:00  | "Resumen"              | Correo, agenda y novedades de IA, leídos en voz alta |
| 9:00  | "Plan de hoy"          | Tus 3 prioridades quedan escritas en el vault |
| 14:00 | "Métricas"             | Suscriptores, vistas y seguidores, registrados |
| 19:00 | "Cerrá el día"         | Reflexión guardada, mañana ya queda armado |

Tu voz es la interfaz. La constancia se acumula.
