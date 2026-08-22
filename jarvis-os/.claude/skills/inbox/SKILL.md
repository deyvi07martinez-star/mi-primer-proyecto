---
name: inbox
description: Arma el resumen matutino de correo, agenda y novedades de IA para leer en voz alta. Usar cuando el usuario pida "resumen", "inbox", "qué tengo hoy" o pida el chequeo de las 7am.
---

# Inbox

Objetivo: al despertar, un resumen hablado de 3 cosas — correo, agenda, novedades — sin abrir ninguna app.

## Qué hace

1. **Correo**: si hay un conector de mail disponible en esta sesión (por ejemplo Gmail), consulta los mensajes no leídos de las últimas 12–16 horas. Si no hay conector disponible, decilo y seguí con el resto — nunca inventes correos.
2. **Agenda**: si hay conector de calendario disponible, lee los eventos del día. Si no, revisá `vault/pedidos/agenda.md` si el usuario la mantiene manualmente ahí.
3. **Novedades de IA**: buscá 2-3 titulares relevantes de las últimas 24hs (herramienta de búsqueda web) relacionados a IA/Claude/lo que el usuario siga. Mantenelo corto, sin abrir 10 pestañas.
4. Escribe el resumen en `vault/medio/inbox/YYYY-MM-DD.md`:

```markdown
# Inbox — YYYY-MM-DD

## Correo
- (remitente): (asunto, una línea)

## Agenda
- HH:MM — (evento)

## Novedades
- (titular corto + fuente)
```

5. Lo lee en voz alta de forma conversacional, no como lista: "Tenés 3 correos, el más importante es de X sobre Y. Hoy en la agenda: reunión a las 10. Y en IA: salió tal cosa."

## Notas

- Esto es el que corre a las 7am en el "día real" del operativo — pensalo para que se pueda disparar solo (ver `voice/` y el cron del setup).
- Si algún conector no está autorizado en la sesión, avisá una sola vez qué falta conectar y seguí sin trabarte.
