---
name: metricas
description: Junta tus números del día (suscriptores, vistas, seguidores) y los deja guardados en el vault. Usar cuando el usuario pida "métricas", "mis números", "cómo vengo hoy" o pida el chequeo de las 2pm.
---

# Métricas

Objetivo: registrar tus números de hoy sin que tengas que abrir ninguna plataforma a mano.

## Qué hace

1. Lee `vault/crudo/metricas-fuentes.md` — ahí están definidas tus fuentes (qué cuentas/canales seguís y cómo se consultan: link, comando, o el dato que vos le vas a dictar).
2. Si una fuente tiene un comando o URL configurado, lo corre / lo consulta.
3. Si una fuente todavía no está conectada (no tiene comando), te pregunta el número en voz y lo anota como "dictado por vos".
4. Escribe el resultado en `vault/medio/metricas/YYYY-MM-DD.md` con este formato:

```markdown
# Métricas — YYYY-MM-DD

| Fuente       | Valor  | Delta vs. ayer | Origen    |
|--------------|--------|----------------|-----------|
| Suscriptores | 1234   | +12            | dictado   |
| Vistas       | 45000  | +800           | dictado   |
| Seguidores   | 3200   | +5             | dictado   |

Notas:
- (cualquier observación que quieras dejar)
```

5. Calcula el delta comparando contra el archivo del día anterior en la misma carpeta (si existe).
6. Al terminar, resume en una frase hablada: "Hoy: 1234 suscriptores (+12), 45000 vistas (+800), 3200 seguidores (+5)."

## Primera vez

Si `vault/crudo/metricas-fuentes.md` no existe, crealo con esta plantilla y avisale al usuario que la complete:

```markdown
# Fuentes de métricas

<!-- Una fila por fuente. Si no tenés forma de automatizarla todavía, dejá "comando" vacío y te la voy a preguntar en voz. -->

- nombre: Suscriptores
  comando: ""
- nombre: Vistas
  comando: ""
- nombre: Seguidores
  comando: ""
```

## Notas

- Nunca inventes un número: si no hay comando ni dictado, dejá el valor como `s/d` (sin dato) y decilo explícitamente.
- No necesita conexión a internet para la parte de dictado — solo para fuentes con comando/URL configurado.
