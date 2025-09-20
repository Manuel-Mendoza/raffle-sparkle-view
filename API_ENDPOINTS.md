# API Endpoints Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

Algunas rutas requieren autenticación mediante JWT token en el header:

```
Authorization: Bearer <token>
```

---

## 🎟️ Raffles Endpoints

### GET `/api/raffle/current`

Obtiene la rifa actual activa.

**Response:**

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "prize": "string",
  "image": "string",
  "ticketPrice": "number",
  "totalTickets": "number",
  "endDate": "YYYY-MM-DD",
  "status": "active|finished"
}
```

### GET `/api/raffle/all`

Obtiene todas las rifas.

**Response:**

```json
[
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "prize": "string",
    "image": "string",
    "ticketPrice": "number",
    "totalTickets": "number",
    "endDate": "YYYY-MM-DD",
    "status": "active|finished"
  }
]
```

### POST `/api/raffle/create` 🔒

Crea una nueva rifa. **Requiere autenticación.**

**Request Body:**

```json
{
  "title": "string (min 3 chars)",
  "description": "string",
  "prize": "string (min 3 chars)",
  "image": "string (valid URL)",
  "ticketPrice": "number (positive)",
  "totalTickets": "number (positive)",
  "endDate": "string (YYYY-MM-DD format)"
}
```

### PUT `/api/raffle/finish` 🔒

Finaliza la rifa actual. **Requiere autenticación.**

### POST `/api/raffle/verify`

Verifica si un número de ticket existe.

**Request Body:**

```json
{
  "ticketNumber": "string (4 digits)"
}
```

---

## 👥 Customers Endpoints

### GET `/api/customers/test`

Endpoint de prueba para verificar que las rutas funcionan.

**Response:**

```json
{
  "message": "Customer routes working!"
}
```

### POST `/api/customers/test-email`

Envía un email de prueba.

**Request Body:**

```json
{
  "email": "string (valid email)"
}
```

### GET `/api/customers/top-customer`

Obtiene el cliente con más tickets comprados.

**Response:**

```json
{
  "name": "string",
  "totalTickets": "number"
}
```

### POST `/api/customers/upload-proof`

Sube comprobante de pago.

**Request Body:**

```json
{
  "paymentProof": "string (URL)"
}
```

### POST `/api/customers/buy-ticket`

Compra tickets para una rifa.

**Request Body:**

```json
{
  "name": "string (min 2 chars)",
  "phone": "string (min 10 chars)",
  "email": "string (valid email)",
  "paymentMethod": "string (min 3 chars)",
  "paymentProof": "string (valid URL)",
  "raffleId": "string (valid UUID)",
  "quantity": "number (1-100)"
}
```

---

## 🔐 Admin Endpoints

### POST `/api/admin/login`

Inicia sesión como administrador.

**Request Body:**

```json
{
  "username": "string (min 3 chars)",
  "password": "string (min 6 chars)"
}
```

**Response:**

```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "username": "string"
  }
}
```

### POST `/api/admin/register`

Registra un nuevo administrador.

**Request Body:**

```json
{
  "username": "string (min 3 chars)",
  "password": "string (min 6 chars)",
  "email": "string (valid email)"
}
```

### GET `/api/admin/tickets/pending` 🔒

Obtiene tickets pendientes de aprobación. **Requiere autenticación.**

### GET `/api/admin/tickets/approved` 🔒

Obtiene tickets aprobados. **Requiere autenticación.**

### PUT `/api/admin/customers/:customerId/approve` 🔒

Aprueba todos los tickets de un cliente. **Requiere autenticación.**

### PUT `/api/admin/customers/:customerId/reject` 🔒

Rechaza todos los tickets de un cliente. **Requiere autenticación.**

### PUT `/api/admin/tickets/:id/approve` 🔒

Aprueba un ticket individual. **Requiere autenticación.**

### PUT `/api/admin/tickets/:id/reject` 🔒

Rechaza un ticket individual. **Requiere autenticación.**

### POST `/api/admin/draw-winner` 🔒

Sortea un ganador automáticamente. **Requiere autenticación.**

### POST `/api/admin/set-winner` 🔒

Establece manualmente el primer lugar. **Requiere autenticación.**

**Request Body:**

```json
{
  "raffleId": "string (valid UUID)",
  "ticketNumber": "string"
}
```

### POST `/api/admin/set-second-winner` 🔒

Establece manualmente el segundo lugar. **Requiere autenticación.**

**Request Body:**

```json
{
  "raffleId": "string (valid UUID)",
  "ticketNumber": "string"
}
```

### POST `/api/admin/set-third-winner` 🔒

Establece manualmente el tercer lugar. **Requiere autenticación.**

**Request Body:**

```json
{
  "raffleId": "string (valid UUID)",
  "ticketNumber": "string"
}
```

### GET `/api/admin/winners/history`

Obtiene el historial de ganadores.

**Response:**

```json
[
  {
    "raffleId": "uuid",
    "raffleTitle": "string",
    "firstPlace": "string",
    "secondPlace": "string",
    "thirdPlace": "string",
    "drawDate": "datetime"
  }
]
```

---

## 🧪 Test Endpoints

### POST `/api/test/email`

Envía un email de prueba.

**Request Body:**

```json
{
  "to": "string (email)",
  "subject": "string",
  "message": "string"
}
```

---

## Error Responses

Todos los endpoints pueden devolver estos errores comunes:

### 400 Bad Request

```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "error": "Token inválido o expirado"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error message"
}
```

---

## Notas Importantes

1. **Rutas con 🔒**: Requieren token JWT en el header Authorization
2. **UUIDs**: Todos los IDs son UUIDs v4
3. **Fechas**: Formato YYYY-MM-DD para endDate
4. **URLs**: Deben ser URLs válidas para imágenes y comprobantes
5. **Tickets**: Los números de ticket son strings de 4 dígitos
6. **Emails**: Se envían automáticamente al comprar tickets y aprobar/rechazar
