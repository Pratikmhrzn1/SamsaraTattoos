# Samsara Tattoos — Auth Flow

## Overview

This document describes how authentication works in the Samsara Tattoos backend, covering user registration and login.

---

## How It Works

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

## Error Responses

All errors follow this shape:

```json
{
  "success": false,
  "message": "Error message here"
}
```

| Status | Meaning                        |
|--------|--------------------------------|
| `400`  | Bad request (missing fields, user already exists) |
| `401`  | Unauthorized (invalid credentials or token) |
| `500`  | Internal server error          |

---

## Security Notes

- Passwords are **never stored in plain text** — hashed via bcrypt pre-save hook
- JWT tokens expire as configured in `JWT_EXPIRE_IN` env variable
- Token must be sent on every protected request via `Authorization` header