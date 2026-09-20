# ⚽ Sistema de Organización de Club de Fútbol

## 📋 Descripción General

Una plataforma profesional y moderna para organizar y gestionar un club de fútbol. Permite crear equipos, registrar jugadores, trackear goles, gestionar partidos y generar estadísticas. Accesible mediante código QR para los miembros del club sin costo adicional.

---

## 🎯 Características Principales

### 1. **Gestión de Modalidades**
- ⚽ **Fútbol Sala**: Equipos más pequeños, partidos en espacios cerrados
- 🌾 **Fútbol Campo**: Equipos más grandes, partidos al aire libre
- Cada modalidad tiene su configuración independiente

### 2. **Panel de Equipos**
- Vista de todos los equipos registrados
- Información por equipo:
  - Grupo (A, B, C, etc.)
  - Nombre del equipo
  - Record: Victorias, Empates, Derrotas
  - Goles a favor y en contra
  - Diferencia de goles
  - Jugadores y dorsal
  - Goles anotados por cada jugador
  - Puntos en la clasificación

### 3. **Match Center (Centro de Partidos)**
- ⏱️ **Contador de Tiempo**:
  - Primer tiempo: 20 minutos (configurable)
  - Descanso: 10 minutos (configurable)
  - Segundo tiempo: 20 minutos
  - Pausa y reanudación en cualquier momento

- 🎯 **Gestión de Goles**:
  - Botón +1 gol para cada equipo
  - Deshacer último gol (↩️)
  - Contador en tiempo real

- 📊 **Resultado Final**:
  - Al terminar el partido, registra automáticamente
  - Define el ganador y contrincantes siguientes

### 4. **Estadísticas Globales**
- 🏆 **Tabla de Posiciones**: Ranking de equipos por puntos
- 🎯 **Máximos Goleadores**: Top 10 jugadores con más goles
- Actualización automática después de cada partido

### 5. **Panel Administrador**
Acceso restringido con contraseña (Admin123)

#### a) **Gestión de Equipos** 👥
- Crear nuevos equipos (letra + nombre)
- Agregar jugadores a equipos
- Asignar números de dorsal
- Ver jugadores por equipo
- Eliminar equipos si es necesario

#### b) **Configuración** ⚙️
- Ajustar duración del primer tiempo (10-90 min)
- Ajustar duración del descanso (5-30 min)
- Definir máximo de jugadores por equipo (3-15)
- Permitir/Denegar acceso de invitados por QR
- Subir fotos del club/eventos

#### c) **Generador de Código QR** 🎯
- Genera automáticamente código QR
- Vista previa en tiempo real
- Descargar como imagen PNG
- Imprimir en gran formato (A3 recomendado)
- Acceso directo sin requiere autenticación
- Acceso completamente gratuito

---

## 🚀 Cómo Usar

### **Para Usuarios Finales (Acceso por QR)**

1. **Escanea el código QR** con tu teléfono
2. **Accede automáticamente** sin necesidad de login
3. **Visualiza los equipos** en tu modalidad (Sala o Campo)
4. **Consulta estadísticas** en tiempo real
5. **Ve detalles completos** de cada equipo

**URL de Acceso Público**: `/football-public`

### **Para Administrador**

1. **Accede a la plataforma** en `/football`
2. **Haz clic en "🔐 Login Admin"** en el panel lateral
3. **Ingresa contraseña**: `admin123`
4. **Panel Administrador** con 3 secciones:

#### **Sección: Equipos** 👥
- Crear equipos con letra y nombre
- Agregar jugadores
- Asignar dorsales
- Gestionar alineaciones

#### **Sección: Configuración** ⚙️
- Ajustar tiempos de partidos
- Definir máximo de jugadores
- Controlar acceso por QR
- Subir fotos

#### **Sección: Código QR** 🎯
- Ver código QR
- Descargar como imagen
- Imprimir para el club

---

## 🎨 Paleta de Colores

- **Azul Primario**: #1e40af, #1e3a8a, #0f172a
- **Blanco**: #ffffff, #f8fafc
- **Negro**: #000000, #0b0b0c
- **Acentos**: Azul claro para textos, Ámbar para acciones

---

## 📱 Responsive Design

- ✅ Funciona en móviles (donde se escanea QR)
- ✅ Funciona en tablets
- ✅ Funciona en desktop (para admin)
- ✅ Interfaz adaptativa automática

---

## 🔐 Seguridad

- **Acceso Público**: Sin contraseña (por QR)
- **Acceso Admin**: Requiere contraseña
- **Sin datos sensibles**: No almacena información privada
- **localStorage**: Datos guardados localmente en el navegador

---

## 📊 Flujo de un Partido

1. **Admin entra a Match Center**
2. **Selecciona equipos que van a jugar**
3. **Inicia el cronómetro** (Start)
4. **Registra goles** mientras el partido está en vivo
5. **Pausa si es necesario**
6. **Descanso automático** en medio tiempo
7. **Finaliza el partido**
8. **Registra resultado** automáticamente
9. **Sistema genera siguiente encuentro** automáticamente

---

## 🎯 Funcionalidad de Rotación Automática

Cuando se termina un partido:
- El ganador se queda para el siguiente encuentro
- Se selecciona un nuevo equipo como contrincante (de los equipos que no jugaron)
- Sistema round-robin para garantizar que todos jueguen

---

## 📥 Descargar QR

1. Ve a **Panel Administrador** → **Código QR**
2. Haz clic en **"📥 Descargar QR"**
3. Se descarga como archivo PNG
4. Puedes imprimir en tamaño grande (A3 recomendado)
5. Coloca en lugar visible del club

---

## 🖨️ Imprimir QR

1. Ve a **Panel Administrador** → **Código QR**
2. Haz clic en **"🖨️ Imprimir QR"**
3. Abre diálogo de impresión
4. Selecciona tamaño **A3** para mejor visibilidad
5. Márgenes al mínimo
6. Imprime y lamina si es posible

---

## 💾 Almacenamiento de Datos

Todos los datos se guardan en **localStorage del navegador**:
- Equipos y jugadores
- Estadísticas de partidos
- Configuración del club
- Historial de goles

**Nota**: Los datos se mantienen hasta que se borren manualmente del navegador.

---

## 🔧 Configuración Técnica

- **Framework**: Next.js 14+
- **Styling**: Tailwind CSS
- **Estado**: React Hooks (useState, useEffect)
- **Almacenamiento**: Browser localStorage
- **QR Code**: API externa qr-server
- **Responsive**: Diseño mobile-first

---

## 📞 Soporte

Para reportar problemas o sugerencias, contacta al administrador del club.

---

**Versión**: 1.0  
**Última actualización**: 2024  
**Licencia**: Uso interno del club
