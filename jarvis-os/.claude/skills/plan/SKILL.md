---
name: plan
description: Escribe tu plan del día (top 3 prioridades) al vault por voz. Usar cuando el usuario pida "plan de hoy", "mis prioridades" o pida el chequeo de las 9am.
---

# Plan

Objetivo: bajar el "top 3 de hoy" a texto en el vault, dicho en voz, sin abrir ninguna app de tareas.

## Qué hace

1. Le pregunta al usuario (o escucha lo que ya dictó): "¿Cuáles son tus 3 prioridades de hoy?"
2. Si `vault/medio/plan/YYYY-MM-DD.md` ya existe, lo lee primero y pregunta si continúa o arranca de cero.
3. Escribe (o actualiza) el archivo:

```markdown
# Plan — YYYY-MM-DD

1. [ ] (prioridad 1)
2. [ ] (prioridad 2)
3. [ ] (prioridad 3)

Contexto: (una línea opcional de por qué, si el usuario la dio)
```

4. Si el usuario menciona que terminó algo durante el día ("ya hice la 1"), marcá el checkbox `[x]` en ese mismo archivo.
5. Confirma en voz lo que quedó anotado, corto: "Anotado: 1) X, 2) Y, 3) Z."

## Notas

- Este es el que corre a las 9am en el "día real", y se puede volver a invocar durante el día para tildar ítems.
- No agregues una 4ta prioridad aunque el usuario la mencione de pasada — si insiste en más de 3, preguntale cuál baja.
