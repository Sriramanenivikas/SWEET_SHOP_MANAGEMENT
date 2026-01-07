# JWT Authentication - Complete Guide

## What is JWT?

JWT (JSON Web Token) is a secure way to transmit information between parties as a JSON object.
It is digitally signed, so it can be verified and trusted.

A JWT looks like this:
```
eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGVtYWlsLmNvbSJ9.abc123signature
```

It has 3 parts separated by dots:
1. HEADER - Algorithm used (HS512)
2. PAYLOAD - User data (email, role, expiry time)
3. SIGNATURE - Verification that token is not tampered

---

## Why Do We Need TWO Tokens?

### The Problem with Single Token

If you only have ONE token with long expiry (24 hours):
- If someone steals it, they have access for 24 hours
- You cannot force logout the user
- Security risk is HIGH

If you only have ONE token with short expiry (2 minutes):
- User gets logged out every 2 minutes
- Terrible user experience
- User has to enter password again and again

### The Solution: Two Token System

| Token | Expiry | Purpose | Storage |
|-------|--------|---------|---------|
| Access Token | 2 minutes | Used for API calls | Memory/localStorage |
| Refresh Token | 7 days | Used to get new access token | HttpOnly Cookie |

---

## How It Works - Step by Step

### Step 1: User Logs In
```
User sends: email + password
Server returns: accessToken (2 min) + refreshToken (7 days)
```

### Step 2: User Makes API Calls
```
User sends: accessToken in header
Server checks: Is token valid? Is it expired? Is it blacklisted?
If valid: Return data
If expired: Return 401 error
```

### Step 3: Access Token Expires (after 2 minutes)
```
User's accessToken expires
API call fails with 401 error
Frontend automatically calls /auth/refresh with refreshToken
Server returns: NEW accessToken + NEW refreshToken
User continues without noticing anything
```

### Step 4: User Logs Out
```
User clicks logout
Server blacklists the current accessToken (by JTI)
Server deletes the refreshToken from database
User must login again to get new tokens
```

---

## Visual Flow

```
LOGIN:
+--------+                      +--------+
|  User  | --email/password-->  | Server |
|        | <--accessToken----   |        |
|        | <--refreshToken---   |        |
+--------+                      +--------+

API CALL:
+--------+                      +--------+
|  User  | --accessToken------> | Server |
|        | <--data-----------   |        |
+--------+                      +--------+

TOKEN EXPIRED (automatic, user does not notice):
+--------+                      +--------+
|  User  | --API call---------> | Server |
|        | <--401 error------   |        |
|        | --refreshToken-----> |        |
|        | <--NEW accessToken-  |        |
|        | --API call again---> |        |
|        | <--data-----------   |        |
+--------+                      +--------+

LOGOUT:
+--------+                      +--------+
|  User  | --logout request-->  | Server |
|        |                      | blacklists accessToken JTI |
|        |                      | deletes refreshToken |
|        | <--success--------   |        |
+--------+                      +--------+
```

---

## What is JTI?

JTI = JWT ID = Unique identifier for each token

Every accessToken has a unique JTI (like a serial number).
When user logs out, we add that JTI to a blacklist.
When any API call comes, we check if the JTI is blacklisted.

This allows us to invalidate tokens BEFORE they expire.

---

## Why 2 Minutes for Testing?

For TESTING purposes, accessToken expires in 2 minutes so you can:
1. Login
2. Wait 2 minutes
3. See the automatic refresh happen
4. Verify the system works

For PRODUCTION, you should change to 15-30 minutes:
```properties
jwt.expiration=900000      # 15 minutes
jwt.expiration=1800000     # 30 minutes
```

---

## Security Features Implemented

| Feature | Status | Description |
|---------|--------|-------------|
| Short Access Token | YES | 2 min expiry limits damage if stolen |
| Refresh Token Rotation | YES | New refresh token on each refresh |
| Token Blacklist | YES | Logout invalidates tokens immediately |
| JTI Tracking | YES | Each token has unique ID |
| HttpOnly Cookies | YES | JavaScript cannot access tokens |
| Secure Cookies | YES | HTTPS only in production |
| SameSite Cookies | YES | Prevents CSRF attacks |
| BCrypt Password | YES | Cost factor 12 for secure hashing |
| CORS Configured | YES | Only allowed origins can call API |
| Security Headers | YES | XSS, CSP, Frame protection |
| Max Sessions | YES | 5 active sessions per user |

---

## RBAC (Role-Based Access Control)

### Roles in This System

| Role | Can Do |
|------|--------|
| USER | View sweets, Purchase sweets |
| ADMIN | Everything USER can do + Create/Edit/Delete sweets, Restock inventory |

### How RBAC Works

In SecurityConfig.java:
```java
.requestMatchers(HttpMethod.GET, "/sweets/**").permitAll()           // Anyone
.requestMatchers(HttpMethod.POST, "/sweets").hasRole("ADMIN")        // Admin only
.requestMatchers(HttpMethod.PUT, "/sweets/*").hasRole("ADMIN")       // Admin only
.requestMatchers(HttpMethod.DELETE, "/sweets/*").hasRole("ADMIN")    // Admin only
.requestMatchers(HttpMethod.POST, "/sweets/*/purchase").authenticated() // Any logged in user
```

In Controllers (method level):
```java
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> createSweet(...) { }
```

### Testing RBAC

1. Login as USER (customer@sweetshop.com)
   - Can view sweets: YES
   - Can purchase: YES
   - Can create sweet: NO (403 Forbidden)

2. Login as ADMIN (newadmin@sweetshop.com)
   - Can view sweets: YES
   - Can purchase: YES
   - Can create sweet: YES
   - Can delete sweet: YES

---

## API Endpoints

### Public (No Auth Required)
```
POST /api/auth/register     - Create new account
POST /api/auth/login        - Login and get tokens
POST /api/auth/refresh      - Get new access token
POST /api/auth/logout       - Logout and invalidate tokens
GET  /api/sweets            - View all sweets
GET  /api/sweets/{id}       - View single sweet
```

### Authenticated (Any Logged In User)
```
POST /api/sweets/{id}/purchase  - Purchase a sweet
POST /api/auth/logout-all       - Logout from all devices
```

### Admin Only
```
POST   /api/sweets              - Create new sweet
PUT    /api/sweets/{id}         - Update sweet
DELETE /api/sweets/{id}         - Delete sweet
POST   /api/sweets/{id}/restock - Restock inventory
```

---

## Production Checklist

### Before Going Live

1. Change token expiry:
```properties
jwt.expiration=900000           # 15 minutes (not 2 minutes)
jwt.refresh-expiration=604800000 # 7 days
```

2. Set secure JWT secret (minimum 256 bits):
```bash
export JWT_SECRET="your-very-long-random-secret-key-at-least-256-bits"
```

3. Enable secure cookies:
```properties
app.cookie.secure=true
app.cookie.same-site=Strict
```

4. Set allowed CORS origins:
```bash
export CORS_ALLOWED_ORIGINS="https://yourdomain.com"
```

5. Use HTTPS only

6. Set strong database password

### Environment Variables for Production
```bash
JWT_SECRET=<256-bit-random-string>
CORS_ALLOWED_ORIGINS=https://yourdomain.com
PGHOST=your-db-host
PGPORT=5432
PGDATABASE=sweetshop
PGUSER=your-db-user
PGPASSWORD=your-db-password
COOKIE_SECURE=true
COOKIE_SAME_SITE=Strict
```

---

## Database Tables

### users
```sql
id          UUID PRIMARY KEY
email       VARCHAR UNIQUE
password    VARCHAR (BCrypt hashed)
first_name  VARCHAR
last_name   VARCHAR
role        VARCHAR (USER or ADMIN)
created_at  TIMESTAMP
```

### refresh_tokens
```sql
id          UUID PRIMARY KEY
token       VARCHAR UNIQUE
user_id     UUID REFERENCES users(id)
expiry_date TIMESTAMP
revoked     BOOLEAN
created_at  TIMESTAMP
user_agent  VARCHAR
ip_address  VARCHAR
```

### token_blacklist
```sql
id              UUID PRIMARY KEY
jti             VARCHAR UNIQUE (the token's unique ID)
expiry_date     TIMESTAMP
blacklisted_at  TIMESTAMP
reason          VARCHAR
```

---

## Files Structure

```
backend/
  src/main/java/com/sweetshop/
    config/
      SecurityConfig.java       # CORS, security headers, RBAC rules
    controller/
      AuthController.java       # Login, register, refresh, logout
    dto/
      request/
        LoginRequest.java
        RegisterRequest.java
        RefreshTokenRequest.java
        LogoutRequest.java
      response/
        AuthResponse.java       # Returns both tokens
    entity/
      User.java                 # User with role
      RefreshToken.java         # Stored refresh tokens
      TokenBlacklist.java       # Blacklisted token JTIs
    repository/
      UserRepository.java
      RefreshTokenRepository.java
      TokenBlacklistRepository.java
    security/
      JwtTokenProvider.java     # Generate and validate tokens
      JwtAuthenticationFilter.java  # Check token on every request
    service/
      AuthService.java          # Login, register logic
      RefreshTokenService.java  # Manage refresh tokens
      TokenBlacklistService.java # Manage blacklist

frontend/
  src/
    services/
      api.js                    # Axios with auto-refresh interceptor
    context/
      AuthContext.js            # Login, logout, user state
```

---

## Common Questions

### Q: What happens if refresh token is stolen?
A: Attacker can get new access tokens. Mitigation:
- Refresh tokens are rotated (old one becomes invalid)
- Max 5 sessions per user
- User can "logout all" to invalidate all tokens
- Refresh token is stored in HttpOnly cookie (harder to steal)

### Q: What happens if access token is stolen?
A: Attacker has access for max 2 minutes (or 15 min in production).
After that, they need refresh token to continue.

### Q: Can user be logged in on multiple devices?
A: Yes, up to 5 devices. Each device gets its own refresh token.

### Q: What happens on logout?
A: Access token JTI is blacklisted, refresh token is deleted from DB.
Even if attacker has the tokens, they won't work.

### Q: Is this production ready?
A: YES, with these changes:
1. Increase access token expiry to 15-30 minutes
2. Set secure environment variables
3. Use HTTPS
4. Set strong JWT secret

---

## Quick Test Commands

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123"}'

# Use access token
curl -X GET http://localhost:8080/api/sweets \
  -H "Authorization: Bearer <accessToken>"

# Refresh token
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'

# Logout
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

---

## Summary

This implementation provides:
- Secure authentication with JWT
- Automatic token refresh (user never notices expiry)
- Proper logout with token invalidation
- Role-based access control (USER vs ADMIN)
- Protection against common attacks (XSS, CSRF, token theft)
- Production-ready configuration options

The 2-minute expiry is for TESTING. Change to 15-30 minutes for production.
