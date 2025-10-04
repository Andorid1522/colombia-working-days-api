# Colombia Working Days API

API REST para calcular días y horas hábiles en Colombia, considerando festivos nacionales, horarios laborales y zona horaria local.

## ✨ Características

Cálculo de días y horas hábiles
|Festivos colombianos** integrados (2025-2035)
- ⏰ **Horario laboral**: L-V 8:00-17:00 con almuerzo 12:00-13:00
- 🌍 **Zona horaria**: Conversión automática Colombia ↔ UTC
- ✅ **Validación estricta** de parámetros de entrada
- 🔷 **TypeScript** con tipado explícito completo
- 🧪 **Cobertura de pruebas** del 91.97% (48/48 tests)

## 🚀 Instalación y Ejecución Local

### 📋 Prerrequisitos
- Node.js ≥ 18.0
- npm o yarn

### 🔧 Configuración

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/colombia-working-days-api.git
cd colombia-working-days-api

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo (recomendado)
npm run dev
```

**El servidor estará disponible en:** `http://localhost:3001`

Para detener el servidor, presiona `Ctrl+C` en la terminal

### 🧪 Probar la API localmente

**Con curl:**
```bash
# Health check
curl http://localhost:3001/health

# Ejemplo básico
curl "http://localhost:3001/api/working-days?days=1"

# Ejemplo con horas
curl "http://localhost:3001/api/working-days?hours=4"
```

**Con Postman:**
1. **Método**: `GET`
2. **URL**: `http://localhost:3001/api/working-days`
3. **Params** (Query Parameters):
   - `days`: `1` (opcional)
   - `hours`: `4` (opcional)
   - `date`: `2025-01-15T13:00:00.000Z` (opcional)
4. **Headers**: No se requieren headers especiales
5. **Click**: `Send`

### 🏭 Producción

```bash
# Construir para producción
npm run build

# Ejecutar versión de producción
npm start
```

### 🔧 Troubleshooting

**Puerto ocupado:**
```bash
# Si el puerto 3001 está ocupado, cambiar el puerto:
PORT=3002 npm run dev
```

**Problemas de dependencias:**
```bash
# Limpiar cache e instalar de nuevo
npm cache clean --force
# En Windows:
rmdir /s node_modules
del package-lock.json
# En Linux/Mac:
# rm -rf node_modules package-lock.json
npm install
```

**Verificar que funciona:**
```bash
# Debe retornar: {"status": "OK"}
curl http://localhost:3001/health
```

## 📚 Uso de la API

### 🎯 Endpoint Principal

```http
GET /api/working-days
```

### 📝 Parámetros Query

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `days` | `number` | Condicional* | Días hábiles a sumar (entero 0-365) |
| `hours` | `number` | Condicional* | Horas hábiles a sumar (entero 0-2000) |
| `date` | `string` | Opcional | Fecha inicial en formato ISO 8601 UTC con sufijo Z |

> **\*** Al menos uno de `days` o `hours` debe ser proporcionado.

### 💫 Ejemplos de Uso

**Local (desarrollo):**
```bash
# 📅 Sumar 1 día hábil desde ahora
curl "http://localhost:3001/api/working-days?days=1"

# ⏰ Sumar 4 horas hábiles desde ahora
curl "http://localhost:3001/api/working-days?hours=4"

# 🔄 Sumar 2 días y 3 horas desde fecha específica
curl "http://localhost:3001/api/working-days?days=2&hours=3&date=2025-01-15T13:00:00.000Z"
```

**Producción:**
```bash
# 🎉 Calcular desde un viernes (salta al lunes)
curl "https://your-api.vercel.app/api/working-days?hours=1&date=2025-01-10T22:00:00.000Z"
```

### 📨 Pruebas con Postman

#### 🔍 Configuración Básica:
- **Método**: `GET`
- **URL Base**: `http://localhost:3001` (local) o `https://your-api.vercel.app` (producción)
- **Content-Type**: No requerido (solo GET requests)

#### 📝 Ejemplos de Requests:

**1. Health Check:**
- **URL**: `http://localhost:3001/health`
- **Params**: Ninguno
- **Respuesta**: `{"status": "OK"}`

**2. Sumar 1 día hábil:**
- **URL**: `http://localhost:3001/api/working-days`
- **Query Params**:
  - `days`: `1`
- **Respuesta**: `{"date": "2025-01-XX..."}`

**3. Sumar 4 horas hábiles:**
- **URL**: `http://localhost:3001/api/working-days`
- **Query Params**:
  - `hours`: `4`

**4. Fecha específica + días y horas:**
- **URL**: `http://localhost:3001/api/working-days`
- **Query Params**:
  - `days`: `2`
  - `hours`: `3`
  - `date`: `2025-01-15T13:00:00.000Z`

**5. Probar error (sin parámetros):**
- **URL**: `http://localhost:3001/api/working-days`
- **Query Params**: Ninguno
- **Respuesta**: `400 Bad Request`

#### 📦 Colección de Postman

Puedes importar la colección completa:
1. **Descargar**: [`postman_collection.json`](./postman_collection.json)
2. **Importar** en Postman: `File > Import > Upload Files`
3. **Configurar variable**: `baseUrl = http://localhost:3001`
4. **Ejecutar** cualquier request de la colección

> 💡 **Tip**: La colección incluye todos los casos de prueba y manejo de errores

#### 🔧 Configuraciones Adicionales

**TypeScript:**
- Configuración principal: `tsconfig.json`
- Configuración para tests: `tsconfig.test.json`
- Strict mode habilitado con validaciones adicionales

**Jest:**
- Configuración moderna con ts-jest
- Cobertura de código configurada (branches 85%)
- Mocks automáticos y cleanup

### 💬 Respuestas

#### ✅ Éxito (200 OK)
```json
{
  "date": "2025-01-16T15:00:00.000Z"
}
```

#### ❌ Error de Parámetros (400 Bad Request)
```json
{
  "error": "InvalidParameters",
  "message": "At least one parameter (days or hours) is required"
}
```

**Otros errores de validación:**
```json
{
  "error": "InvalidParameters",
  "message": "Days must be a positive integer between 0 and 365"
}
```

```json
{
  "error": "InvalidParameters",
  "message": "Date must be in ISO 8601 format with Z suffix"
}
```

#### 🚫 Endpoint No Encontrado (404 Not Found)
```json
{
  "error": "NotFound",
  "message": "Endpoint not found"
}
```

## 📋 Reglas de Negocio

| Regla | Descripción |
|-------|-------------|
| 📅 **Días hábiles** | Lunes a viernes, excluyendo festivos colombianos |
| ⏰ **Horario laboral** | 8:00 AM - 5:00 PM (almuerzo: 12:00 PM - 1:00 PM) |
| 🌍 **Zona horaria** | Cálculos en hora de Colombia, respuesta en UTC |
| 🔄 **Normalización** | Fechas fuera de horario van al momento laboral anterior |
| ➡️ **Orden de suma** | Primero días hábiles, luego horas hábiles |
| 🎯 **Festivos integrados** | Array estático con 178 festivos (2025-2035) |
| ⚡ **Graceful shutdown** | Manejo de SIGTERM para deployments |


### 🧪 Ejecutar Pruebas

```bash
# 🚀 Todas las pruebas (48/48 passing)
npm test

# 👀 Pruebas en modo watch
npm run test:watch

# 📊 Cobertura de código (91.97%)
npm run test:coverage
```

### 📁 Estructura del Proyecto

```
src/
├── constants/       # 📊 Constantes y configuración
├── handlers/        # 🎯 Controladores API
├── services/        # 🧠 Lógica de negocio
├── types/           # 🔷 Interfaces TypeScript
├── utils/           # 🔧 Utilidades
└── index.ts         # 🚀 Servidor Express

tests/
└── unit/            # 🧪 Pruebas unitarias
    ├── handlers/    # Tests de controladores
    ├── services/    # Tests de servicios
    ├── utils/       # Tests de utilidades
    └── integration.test.ts # Pruebas de integración
```

## 🛠️ Stack Tecnológico

| Tecnología | Propósito | Versión |
|------------|----------|--------|
| 🟫 **Node.js** | Runtime de JavaScript | ≥ 18.0 |
| 🔷 **TypeScript** | Tipado estático | ^5.2.2 |
| ⚡ **Express.js** | Framework web minimalista | ^4.18.2 |
| 📅 **date-fns-tz** | Manejo de fechas y zonas horarias | ^2.0.0 |
| 🧪 **Jest** | Framework de pruebas | ^29.7.0 |
| 🚀 **Supertest** | Pruebas de API | ^6.3.3 |

### 🧠 Decisiones Técnicas Clave

- **date-fns-tz vs moment.js**: Tree-shaking, inmutabilidad, mejor performance
- **Set vs Array para festivos**: O(1) vs O(n) lookup performance  
- **Singleton pattern**: Cache en memoria para festivos
- **Layered architecture**: Separación clara de responsabilidades
- **Static methods**: Funciones puras sin estado compartido
- **Validación con límites**: Prevención de ataques DoS
- **TypeScript strict**: Type safety completo

## 🌐 Despliegue

### 🚀 Plataformas Soportadas

- ✅ **Vercel** (recomendado) - Configuración incluida (`vercel.json`)
- ✅ **Railway** - Deploy automático
- ✅ **Render** - Compatible
- ✅ **Heroku** - Compatible con Procfile
- ✅ **AWS Lambda** - Con adaptación serverless
- ✅ **Docker** - Containerización disponible

### ⚙️ Variables de Entorno

```bash
PORT=3001           # Puerto del servidor (default: 3001)
NODE_ENV=production # Entorno de ejecución
```

### 📱 Health Check

```bash
# Local
curl http://localhost:3001/health

# Producción
curl https://your-api.vercel.app/health

# Response: {"status": "OK"}
```

## 🏗️ Arquitectura

### 🎯 Principios de Diseño

- **🔧 SOLID**: Principios de diseño orientado a objetos
- **🧩 Separación de responsabilidades**: Cada módulo tiene una función específica
- **📦 Modularidad**: Código organizado en módulos reutilizables
- **🛡️ Tipado fuerte**: TypeScript con strict mode y validaciones robustas
- **🧪 Test-driven**: Cobertura completa de pruebas unitarias (48/48)
- **⚡ Performance**: Festivos estáticos y cache en memoria
- **🔒 Seguridad**: Validación estricta con límites anti-DoS

### 🔄 Flujo de Procesamiento

1. **📥 Entrada**: Validación de parámetros query
2. **🌍 Conversión**: UTC → Hora de Colombia
3. **📅 Cálculo**: Suma de días hábiles (saltando festivos/fines de semana)
4. **⏰ Cálculo**: Suma de horas hábiles (respetando horario laboral)
5. **🌍 Conversión**: Hora de Colombia → UTC
6. **📤 Salida**: Respuesta JSON con fecha resultante

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">
  <strong>🇨🇴 Hecho con ❤️ para Colombia</strong>
</div>