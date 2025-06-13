# Sistema de Empeños

Sistema de gestión de empeños desarrollado en Node.js con integración a MongoDB y despliegue en AWS ECS.

## Descripción

Este sistema permite gestionar operaciones de empeños, incluyendo:
- Registro y gestión de productos
- Cálculo de préstamos basado en el valor de los productos
- Validación de tokens para operaciones seguras
- Integración con servicios externos para validación de tokens

## Requisitos Previos

- Node.js 18.x
- MongoDB
- Docker (para despliegue)
- AWS CLI (para despliegue en AWS)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/yourusername/pocEmpenios.git
cd pocEmpenios
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
MONGO_URL=mongodb+srv://your-mongodb-url
COLLECTION_NAME=products
PORCENTAJE_PRESTAMO=0.8
URL_TOKENS=http://your-token-validation-url
```

## Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

### Tests
```bash
npm test
```

## Estructura del Proyecto

```
├── src/
│   ├── controllers/     # Controladores de la aplicación
│   ├── models/         # Modelos de datos
│   ├── routes/         # Definición de rutas
│   ├── services/       # Servicios de negocio
│   ├── validator/      # Validadores de entrada
│   ├── middleware/     # Middleware de la aplicación
│   └── commons/        # Utilidades comunes
├── test/              # Tests unitarios y de integración
└── .github/           # Configuración de GitHub Actions
```

## API Endpoints

### Productos
- `POST /products` - Crear un nuevo producto
- `GET /products` - Obtener todos los productos
- `GET /products/:id` - Obtener un producto por ID
- `PUT /products/:id` - Actualizar un producto
- `DELETE /products/:id` - Eliminar un producto

### Empeños
- `POST /prestamo` - Calcular el valor del préstamo (requiere autenticación)

## Despliegue

El proyecto está configurado para desplegarse automáticamente en AWS ECS mediante GitHub Actions. El pipeline incluye:

1. Ejecución de tests
2. Análisis de código con SonarQube
3. Construcción de la imagen Docker
4. Despliegue en ECS
5. Configuración de ALB y Target Groups

## Cobertura de Tests

El proyecto mantiene una cobertura de tests mínima del 80%. Para verificar la cobertura:

```bash
npm run test
```

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
