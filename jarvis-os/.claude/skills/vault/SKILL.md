---
name: vault
description: Lee y escribe memoria de largo plazo en el vault (notas enlazadas en markdown, sin base de datos). Usar cuando el usuario pida "recordá esto", "qué anoté sobre X", "cerrá el día" o cualquier consulta/escritura de memoria que no encaje en métricas, inbox o plan.
---

# Vault

Objetivo: ser la memoria de JARVIS — todo lo que pasa queda en archivos markdown, enlazados, sin base de datos ni servicio externo.

## Estructura

```
vault/
  crudo/     -> fuentes de verdad que el usuario configura a mano (ej: metricas-fuentes.md)
  medio/     -> lo que generan las otras skills, un archivo por día/tema (metricas/, inbox/, plan/)
  pedidos/   -> pedidos recurrentes o agenda manual del usuario
  salidas/   -> reflexiones de cierre de día, resúmenes semanales, cualquier salida final
```

Regla del operativo: **si no está en el vault, no pasó.** Cualquier cosa que JARVIS "sepa" tiene que poder señalarse a un archivo concreto.

## Qué hace

- **Leer**: cuando el usuario pregunta algo que puede estar en memoria ("¿qué anoté ayer sobre tal cosa?"), busca en `vault/` (grep por palabra clave, o recorre las notas enlazadas por `[[wikilinks]]` si las hay) y contesta citando el archivo.
- **Escribir — nota suelta**: cuando el usuario dice "recordá esto", crea o agrega a `vault/medio/notas/YYYY-MM-DD.md` con el contenido, enlazando con `[[ ]]` a notas relacionadas si existen.
- **Cerrar el día** (pedido tipo "cerrá el día" / 7pm del operativo): junta lo que pasó hoy — `metricas/`, `inbox/`, `plan/` del día — y escribe una reflexión corta en `vault/salidas/YYYY-MM-DD-cierre.md`:

```markdown
# Cierre — YYYY-MM-DD

## Qué pasó
- (2-3 líneas resumen del día en base a metricas/inbox/plan de hoy)

## Pendiente para mañana
- (lo que quedó sin tildar del plan)

## Reflexión
- (una línea, tono personal, dictada por el usuario si la da)
```

## Notas

- Nunca borres una nota existente al escribir — siempre agregá o creá un archivo nuevo. La memoria es acumulativa.
- Todo en markdown plano, compatible con Obsidian (usá `[[wikilinks]]` para enlazar entre notas).
- Si el usuario pregunta algo y no está en ningún archivo del vault, decilo claramente: "no lo tengo anotado" — no inventes.
