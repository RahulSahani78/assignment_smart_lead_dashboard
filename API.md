# Smart Leads — API Documentation

**Base URL:** `/api/v1`
**Auth:** JWT Bearer tokens — `Authorization: Bearer <token>`
**Response envelope:**

```json
{ "success": true,  "message": "OK", "data": { ... }, "meta": { ... } }
{ "success": false, "message": "Validation failed", "errors": [ ... ] }
```

---

## Authentication

### `POST /auth/register`
Create a new user account. Defaults to role `sales`.

**Body**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "secret123",
  "role": "sales"            // optional: "sales" | "admin"
}
```

**201**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "token": "eyJhbGc...",
    "user": { "id": "65...", "name": "Rahul Sharma", "email": "rahul@example.com", "role": "sales" }
  }
}
```

**Errors**
- `400` validation failed
- `409` email already in use

---

### `POST /auth/login`

**Body**
```json
{ "email": "rahul@example.com", "password": "secret123" }
```

**200**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "token": "eyJhbGc...",
    "user": { "id": "...", "name": "...", "email": "...", "role": "sales" }
  }
}
```

**Errors**
- `400` validation failed
- `401` invalid credentials

---

### `GET /auth/me`

Returns the currently authenticated user. Requires Bearer token.

**200**
```json
{
  "success": true,
  "message": "Profile fetched",
  "data": {
    "_id": "65...",
    "name": "Rahul",
    "email": "rahul@example.com",
    "role": "sales",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## Leads

All `/leads/*` endpoints require authentication.

### `GET /leads`

List leads with filters / search / sort / pagination.

**Query params**

| Param    | Type                                  | Default    | Notes                                            |
|----------|---------------------------------------|------------|--------------------------------------------------|
| `status` | `New` `Contacted` `Qualified` `Lost`  | —          | Optional                                         |
| `source` | `Website` `Instagram` `Referral`      | —          | Optional                                         |
| `search` | string                                | —          | Searches `name` and `email`, case-insensitive    |
| `sort`   | `latest` \| `oldest`                  | `latest`   | By `createdAt`                                   |
| `page`   | integer ≥ 1                           | `1`        |                                                  |
| `limit`  | integer 1–100                         | `10`       |                                                  |

> **RBAC:** Admins receive every lead. Sales users only receive their own.

**Example**
`GET /leads?status=Qualified&source=Instagram&search=rahul&sort=latest&page=1&limit=10`

**200**
```json
{
  "success": true,
  "message": "Leads fetched",
  "data": [
    {
      "_id": "65...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "phone": "9876543210",
      "company": "Acme",
      "notes": "...",
      "status": "Qualified",
      "source": "Instagram",
      "owner": { "_id": "65...", "name": "...", "email": "...", "role": "sales" },
      "createdAt": "2026-05-15T10:00:00.000Z",
      "updatedAt": "2026-05-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1, "limit": 10, "totalItems": 25, "totalPages": 3,
      "hasPrev": false, "hasNext": true
    },
    "filters": { "status": "Qualified", "source": "Instagram", "search": "rahul", "sort": "latest" }
  }
}
```

---

### `POST /leads`

**Body**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+91 9876543210",
  "company": "Acme",
  "notes": "Follow up next week",
  "status": "New",
  "source": "Website"
}
```

**201** Returns the created lead.

---

### `GET /leads/:id`

**200** Returns one lead (with populated `owner`).
**Errors:** `400` invalid id, `403` not your lead, `404` not found.

---

### `PUT /leads/:id`  (also accepts `PATCH`)

Partial or full update. Same shape as `POST` body, all fields optional.
**Errors:** `400` validation, `403` not your lead, `404` not found.

---

### `DELETE /leads/:id`

**200**
```json
{ "success": true, "message": "Lead deleted", "data": { "id": "65..." } }
```

---

### `GET /leads/stats`

Aggregate counts scoped by the current user (admin → all, sales → own).

**200**
```json
{
  "success": true,
  "message": "Stats fetched",
  "data": {
    "total": 25,
    "byStatus": { "New": 8, "Contacted": 6, "Qualified": 7, "Lost": 4 },
    "bySource": { "Website": 10, "Instagram": 9, "Referral": 6 }
  }
}
```

---

### `GET /leads/export`

Same query params as `GET /leads`. Streams a `text/csv` file with UTF-8 BOM (Excel-friendly).

**Columns:** `Name, Email, Phone, Company, Status, Source, Notes, CreatedAt, UpdatedAt`

---

## Health

### `GET /health`
```json
{ "success": true, "message": "OK", "uptime": 1234.56 }
```

---

## Error Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "path": "email", "message": "Invalid email address" }
  ]
}
```

**Status codes used**

| Code | Meaning                                       |
|------|-----------------------------------------------|
| 200  | OK                                            |
| 201  | Created                                       |
| 400  | Bad Request / Validation failed               |
| 401  | Unauthorized (missing/invalid token)          |
| 403  | Forbidden (wrong role / not lead owner)       |
| 404  | Not Found                                     |
| 409  | Conflict (e.g. duplicate email on register)   |
| 429  | Too Many Requests (rate limited)              |
| 500  | Internal Server Error                         |
