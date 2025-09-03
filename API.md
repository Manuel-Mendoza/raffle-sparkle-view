# API Documentation - RiffaQueMantequilla

## Base URL

```
http://localhost:3000
```

## Authentication

Los endpoints protegidos requieren un Bearer token en el header:

```
Authorization: Bearer <token>
```

---

## Admin Endpoints

### Register Admin

**POST** `/api/admin/register`

Crea un nuevo administrador.

**Body:**

```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "message": "Registro exitoso",
  "admin": {
    "id": "uuid",
    "username": "admin"
  }
}
```

### Login Admin

**POST** `/api/admin/login`

Autentica un administrador y devuelve un token.

**Body:**

```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "message": "Login exitoso",
  "token": "paseto_token_here",
  "admin": {
    "id": "uuid",
    "username": "admin"
  }
}
```

---

## Raffle Endpoints

### Get Current Raffle (Public)

**GET** `/api/raffle/current`

Obtiene la rifa activa actual.

**Response (200):**

```json
{
  "id": "uuid",
  "title": "iPhone 15 Pro Max",
  "description": "Sorteo de iPhone 15 Pro Max 256GB",
  "prize": "iPhone 15 Pro Max 256GB",
  "ticketPrice": 50,
  "totalTickets": 100,
  "soldTickets": 23,
  "endDate": "2024-12-31T23:59:59.000Z",
  "isActive": true
}
```

### Get All Raffles (Protected)

**GET** `/api/raffle/`

**Headers:** `Authorization: Bearer <token>`

Obtiene todas las rifas.

**Response (200):**

```json
[
  {
    "id": "uuid",
    "title": "iPhone 15 Pro Max",
    "description": "Sorteo de iPhone 15 Pro Max 256GB",
    "prize": "iPhone 15 Pro Max 256GB",
    "ticketPrice": 50,
    "totalTickets": 100,
    "soldTickets": 23,
    "endDate": "2024-12-31T23:59:59.000Z",
    "isActive": true
  }
]
```

### Get Raffle by ID (Protected)

**GET** `/api/raffle/:id`

**Headers:** `Authorization: Bearer <token>`

Obtiene una rifa específica por ID.

**Response (200):**

```json
{
  "id": "uuid",
  "title": "iPhone 15 Pro Max",
  "description": "Sorteo de iPhone 15 Pro Max 256GB",
  "prize": "iPhone 15 Pro Max 256GB",
  "ticketPrice": 50,
  "totalTickets": 100,
  "soldTickets": 23,
  "endDate": "2024-12-31T23:59:59.000Z",
  "isActive": true
}
```

### Create Raffle (Protected)

**POST** `/api/raffle/`

**Headers:** `Authorization: Bearer <token>`

Crea una nueva rifa.

**Body:**

```json
{
  "title": "iPhone 15 Pro Max",
  "description": "Sorteo de iPhone 15 Pro Max 256GB",
  "prize": "iPhone 15 Pro Max 256GB",
  "ticketPrice": 50,
  "totalTickets": 100,
  "endDate": "2024-12-31T23:59:59.000Z"
}
```

**Response (201):**

```json
{
  "message": "Rifa creada exitosamente",
  "raffle": {
    "id": "uuid",
    "title": "iPhone 15 Pro Max",
    "description": "Sorteo de iPhone 15 Pro Max 256GB",
    "prize": "iPhone 15 Pro Max 256GB",
    "ticketPrice": 50,
    "totalTickets": 100,
    "soldTickets": 0,
    "endDate": "2024-12-31T23:59:59.000Z",
    "isActive": true
  }
}
```

### Update Raffle (Protected)

**PUT** `/api/raffle/:id`

**Headers:** `Authorization: Bearer <token>`

Actualiza una rifa existente.

**Body (todos los campos son opcionales):**

```json
{
  "title": "iPhone 15 Pro Max Updated",
  "description": "Nueva descripción",
  "prize": "iPhone 15 Pro Max 512GB",
  "ticketPrice": 75,
  "totalTickets": 150,
  "endDate": "2024-12-31T23:59:59.000Z",
  "isActive": false
}
```

**Response (200):**

```json
{
  "message": "Rifa actualizada exitosamente",
  "raffle": {
    "id": "uuid",
    "title": "iPhone 15 Pro Max Updated",
    "description": "Nueva descripción",
    "prize": "iPhone 15 Pro Max 512GB",
    "ticketPrice": 75,
    "totalTickets": 150,
    "soldTickets": 23,
    "endDate": "2024-12-31T23:59:59.000Z",
    "isActive": false
  }
}
```

### Delete Raffle (Protected)

**DELETE** `/api/raffle/:id`

**Headers:** `Authorization: Bearer <token>`

Elimina una rifa.

**Response (200):**

```json
{
  "message": "Rifa eliminada exitosamente"
}
```

---

## Error Responses

### 400 - Bad Request

```json
{
  "error": "Username debe tener al menos 3 caracteres"
}
```

### 401 - Unauthorized

```json
{
  "error": "Token requerido"
}
```

```json
{
  "error": "Token inválido"
}
```

```json
{
  "error": "Credenciales inválidas"
}
```

### 404 - Not Found

```json
{
  "error": "No hay sorteo activo"
}
```

```json
{
  "error": "Rifa no encontrada"
}
```

### 409 - Conflict

```json
{
  "error": "El usuario ya existe"
}
```

---

## Validation Rules

### Admin

- **username**: mínimo 3 caracteres
- **password**: mínimo 6 caracteres

### Raffle

- **title**: requerido, no vacío
- **description**: requerido, no vacío
- **prize**: requerido, no vacío
- **ticketPrice**: número mayor a 0
- **totalTickets**: número mayor a 0
- **endDate**: fecha válida en formato ISO 8601

---

## Database Schema

### Admins Table

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Raffles Table

```sql
CREATE TABLE raffles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prize TEXT NOT NULL,
  ticket_price INTEGER NOT NULL,
  total_tickets INTEGER NOT NULL,
  sold_tickets INTEGER DEFAULT 0 NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```
