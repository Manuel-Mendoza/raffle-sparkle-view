# API Documentation - Sistema de Rifas

## Base URL

```
http://localhost:3000/api
```

## Autenticación

Para endpoints protegidos, incluir el header:

```
Authorization: Bearer <token>
```

---

## 🔐 Admin Endpoints

### Registrar Admin

```http
POST /admin/register
```

**Body:**

```json
{
  "username": "admin",
  "password": "123456",
  "email": "admin@example.com"
}
```

**Response:**

```json
{
  "message": "Admin registrado exitosamente",
  "admin": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

### Login Admin

```http
POST /admin/login
```

**Body:**

```json
{
  "username": "admin",
  "password": "123456"
}
```

**Response:**

```json
{
  "token": "paseto-token-here",
  "admin": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

---

## 🎲 Raffle Endpoints

### Crear Rifa (Protegido)

```http
POST /raffle/create
Authorization: Bearer <token>
```

**Body:**

```json
{
  "title": "Rifa iPhone 15",
  "description": "Gana un iPhone 15 Pro Max",
  "prize": "iPhone 15 Pro Max 256GB",
  "ticketPrice": 50,
  "totalTickets": 100,
  "endDate": "2024-12-31"
}
```

**Response:**

```json
{
  "message": "Rifa creada exitosamente",
  "raffle": {
    "id": "uuid",
    "title": "Rifa iPhone 15",
    "description": "Gana un iPhone 15 Pro Max",
    "prize": "iPhone 15 Pro Max 256GB",
    "ticketPrice": 50,
    "totalTickets": 100,
    "soldTickets": 0,
    "endDate": "2024-12-31",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Obtener Rifa Actual

```http
GET /raffle/current
```

**Response:**

```json
{
  "id": "uuid",
  "title": "Rifa iPhone 15",
  "description": "Gana un iPhone 15 Pro Max",
  "prize": "iPhone 15 Pro Max 256GB",
  "ticketPrice": 50,
  "totalTickets": 100,
  "soldTickets": 25,
  "availableTickets": 75,
  "endDate": "2024-12-31",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Obtener Todas las Rifas

```http
GET /raffle/all
```

**Response:**

```json
{
  "raffles": [
    {
      "id": "uuid",
      "title": "Rifa iPhone 15",
      "description": "Gana un iPhone 15 Pro Max",
      "prize": "iPhone 15 Pro Max 256GB",
      "ticketPrice": 50,
      "totalTickets": 100,
      "soldTickets": 25,
      "availableTickets": 75,
      "endDate": "2024-12-31",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 👥 Customer Endpoints

### Subir Comprobante de Pago

```http
POST /customers/upload-proof
Content-Type: multipart/form-data
```

**Body (FormData):**

```
image: <archivo-imagen>
```

**Response:**

```json
{
  "message": "Imagen subida exitosamente",
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v123456789/payment_proofs/abc123.jpg"
}
```

### Comprar Tickets

```http
POST /customers/buy-ticket
```

**Body:**

```json
{
  "name": "Juan Pérez",
  "phone": "1234567890",
  "paymentMethod": "Transferencia Bancaria",
  "paymentProof": "https://res.cloudinary.com/your-cloud/image/upload/v123456789/payment_proofs/abc123.jpg",
  "raffleId": "uuid-de-la-rifa",
  "quantity": 3
}
```

**Response:**

```json
{
  "message": "3 ticket(s) comprado(s) exitosamente",
  "tickets": [
    {
      "id": "uuid-1",
      "ticketNumber": "0157",
      "status": "pending"
    },
    {
      "id": "uuid-2",
      "ticketNumber": "3842",
      "status": "pending"
    },
    {
      "id": "uuid-3",
      "ticketNumber": "7291",
      "status": "pending"
    }
  ],
  "raffle": "Rifa iPhone 15",
  "customer": "Juan Pérez",
  "total": 150
}
```

### Test Endpoint

```http
GET /customers/test
```

**Response:**

```json
{
  "message": "Customer routes working!"
}
```

---

## 📋 Validaciones

### Crear Rifa

- `title`: Mínimo 3 caracteres
- `description`: Requerido
- `prize`: Mínimo 3 caracteres
- `ticketPrice`: Número positivo
- `totalTickets`: Número positivo
- `endDate`: Formato YYYY-MM-DD

### Registro Admin

- `username`: Mínimo 3 caracteres
- `password`: Mínimo 6 caracteres
- `email`: Email válido

### Login Admin

- `username`: Mínimo 3 caracteres
- `password`: Mínimo 6 caracteres

### Comprar Tickets

- `name`: Mínimo 2 caracteres
- `phone`: Mínimo 10 caracteres
- `paymentMethod`: Mínimo 3 caracteres
- `paymentProof`: URL válida
- `raffleId`: UUID válido
- `quantity`: Entre 1 y 100 tickets

---

## 🎯 Características del Sistema

### Números de Tickets

- **Formato**: 4 dígitos (0000-9999)
- **Generación**: Aleatoria
- **Unicidad**: Garantizada por rifa
- **Máximo**: 10,000 números únicos por rifa

### Estados de Tickets

- `pending`: Esperando aprobación
- `confirmed`: Confirmado por admin
- `rejected`: Rechazado por admin

### Almacenamiento de Imágenes

- **Servicio**: Cloudinary
- **Formato**: JPG
- **Carpeta**: payment_proofs/
- **Límite**: Plan gratuito de Cloudinary

---

## ⚠️ Códigos de Error

### 400 Bad Request

- Datos de entrada inválidos
- No hay tickets disponibles
- Cantidad excede disponibles

### 401 Unauthorized

- Token requerido
- Token inválido
- Credenciales incorrectas

### 404 Not Found

- Rifa no encontrada
- Rifa inactiva
- Endpoint no existe

### 500 Internal Server Error

- Error del servidor
- Error de base de datos
- Error de Cloudinary

---

## 🔧 Configuración Requerida

### Variables de Entorno (.env)

```env
DATABASE_URL=postgresql://user:pass@host:port/db
PASETO_SECRET=-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Dependencias Principales

- Hono (Framework web)
- Drizzle ORM (Base de datos)
- PASETO (Autenticación)
- Cloudinary (Almacenamiento de imágenes)
- Zod (Validaciones)

---

## 🚀 Flujo de Uso

1. **Admin registra cuenta** → `POST /admin/register`
2. **Admin hace login** → `POST /admin/login` (obtiene token)
3. **Admin crea rifa** → `POST /raffle/create` (con token)
4. **Cliente ve rifa disponible** → `GET /raffle/current`
5. **Cliente sube comprobante** → `POST /customers/upload-proof`
6. **Cliente compra tickets** → `POST /customers/buy-ticket`
7. **Admin revisa y aprueba tickets** (funcionalidad futura)
