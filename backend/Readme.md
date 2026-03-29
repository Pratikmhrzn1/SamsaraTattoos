# Samsara Tattoos — Backend Documentation

## Overview

This document describes how authentication, bookings, and gallery management work in the Samsara Tattoos backend.

---

## Auth Flow

### Register

```
User sends firstName, lastName, email, password, phoneNumber
        ↓
Check if email already exists in MongoDB
        ↓
Create user (password is hashed automatically via Mongoose pre-save hook)
        ↓
Generate JWT token
        ↓
Return token + user
```

**Endpoint:** `POST /api/users/register`

**Request Body:**
```json
{
  "firstName": "Pratik",
  "lastName": "Maharjan",
  "email": "pratik@gmail.com",
  "password": "Pratik1234",
  "phoneNumber": "9812345678"
}
```

**Success Response** `201`:
```json
{
  "success": true,
  "token": "jwt.token.here",
  "user": { ... }
}
```

---

### Login

```
User sends email + password
        ↓
Find user by email in MongoDB
        ↓
Compare plain password with hashed password using bcrypt
        ↓
Generate JWT token
        ↓
Return token + user
```

**Endpoint:** `POST /api/users/login`

**Request Body:**
```json
{
  "email": "pratik@gmail.com",
  "password": "Pratik1234"
}
```

**Success Response** `200`:
```json
{
  "success": true,
  "token": "jwt.token.here",
  "user": { ... }
}
```

---

## Protected Routes

For routes that require authentication, include the JWT token in the request header:

```
Authorization: Bearer <your_token>
```

The `protect` middleware will:

```
Request comes in with token in header
        ↓
Verify token is valid (using JWT_SECRET)
        ↓
Find user from token's id
        ↓
Attach user to req.user
        ↓
Controller runs
```

---

## Role & Authorization

Three roles exist with different levels of access:

| Role | Access |
|---|---|
| `user` | Public routes only (submit booking, view gallery) |
| `admin` | Gallery upload/delete, view and manage bookings |
| `superadmin` | Everything including user management and role assignment |

The `authorize` middleware protects role-restricted routes:
```
Request passes protect middleware (token verified)
        ↓
authorize checks req.user.role against allowed roles
        ↓
Match → controller runs
No match → 403 Forbidden
```

---

## Booking Flow

### Submit a Booking (Public)

```
User fills booking form (name, email, phone, date, tattoo idea, optional image)
        ↓
POST /api/bookings
        ↓
Data saved to MongoDB with status: "pending"
        ↓
Return booking confirmation
```

**Endpoint:** `POST /api/bookings`

**Request:** `multipart/form-data` (supports image upload)

```json
{
  "firstName": "Pratik",
  "lastName": "Maharjan",
  "email": "pratik@gmail.com",
  "phoneNumber": "9812345678",
  "date": "2025-05-10",
  "tattooIdea": "A dragon on my forearm",
  "referenceImage": "(optional image file)"
}
```

**Success Response** `201`:
```json
{
  "success": true,
  "message": "Booking request submitted successfully",
  "booking": {
    "_id": "...",
    "firstName": "Pratik",
    "status": "pending",
    ...
  }
}
```

---

### Manage Bookings (Admin / Superadmin)

```
Admin logs in and gets JWT token
        ↓
Sends request with token in Authorization header
        ↓
protect + authorize("admin", "superadmin") middleware runs
        ↓
Controller executes
```

**Get all bookings:**
`GET /api/bookings` — returns all bookings, newest first

Optional filter by status:
`GET /api/bookings?status=pending`

**Get single booking:**
`GET /api/bookings/:id`

**Update booking status:**
`PATCH /api/bookings/:id/status`

```json
{
  "status": "confirmed",
  "notes": "Call before visit"
}
```

**Delete booking:**
`DELETE /api/bookings/:id`

**Booking statuses:**

| Status | Meaning |
|---|---|
| `pending` | Newly submitted, awaiting review |
| `confirmed` | Admin has approved the appointment |
| `rejected` | Admin has declined the request |

---

## Gallery Flow

### View Gallery (Public)

```
GET /api/gallery
        ↓
Returns all images sorted by newest first
```

Optional filter by style:
`GET /api/gallery?style=realism`

**Available styles:** `realism`, `tribal`, `traditional`, `watercolor`, `geometric`, `blackwork`, `japanese`, `other`

**Success Response** `200`:
```json
{
  "success": true,
  "count": 12,
  "images": [
    {
      "_id": "...",
      "title": "Dragon sleeve",
      "imageUrl": "/uploads/gallery/image-1234567890.jpg",
      "style": "realism",
      "artistName": "Pratik",
      "createdAt": "2025-03-24T10:00:00.000Z"
    }
  ]
}
```

---

### Upload Gallery Image (Admin / Superadmin)

```
Admin selects image + fills details (title, style, artist)
        ↓
POST /api/gallery (multipart/form-data)
        ↓
Multer saves image to /uploads/gallery/
        ↓
Image path + metadata saved to MongoDB
        ↓
Image accessible via /uploads/gallery/filename.jpg
```

**Endpoint:** `POST /api/gallery`

**Request:** `multipart/form-data`

| Field | Required | Description |
|---|---|---|
| `image` | ✅ | Image file (jpeg, jpg, png, webp, gif — max 10MB) |
| `title` | ❌ | Title of the tattoo |
| `style` | ❌ | Tattoo style (defaults to `other`) |
| `artistName` | ❌ | Name of the artist |

**Success Response** `201`:
```json
{
  "success": true,
  "image": {
    "_id": "...",
    "title": "Dragon sleeve",
    "imageUrl": "/uploads/gallery/image-1234567890.jpg",
    "style": "realism",
    "artistName": "Pratik"
  }
}
```

---

### Delete Gallery Image (Admin / Superadmin)

```
Admin sends DELETE request with image id
        ↓
Image found in MongoDB
        ↓
File deleted from /uploads/gallery/
        ↓
Document deleted from MongoDB
```

**Endpoint:** `DELETE /api/gallery/:id`

**Success Response** `200`:
```json
{
  "success": true,
  "message": "Image deleted"
}
```

---

## Error Responses

All errors follow this shape:

```json
{
  "success": false,
  "message": "Error message here"
}
```

| Status | Meaning |
|---|---|
| `400` | Bad request (missing fields, invalid data) |
| `401` | Unauthorized (missing or invalid token) |
| `403` | Forbidden (insufficient role) |
| `404` | Resource not found |
| `500` | Internal server error |

---

## Security Notes

- Passwords are **never stored in plain text** — hashed via bcrypt pre-save hook
- JWT tokens expire as configured in `JWT_EXPIRE_IN` env variable
- Token must be sent on every protected request via `Authorization` header
- Swagger docs should be **disabled in production** to avoid exposing API structure
- Uploaded images are served as static files via `/uploads` — consider moving to Cloudinary/S3 in production