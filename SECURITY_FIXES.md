# Security Fixes - HttpOnly Cookie Implementation

## BEFORE vs AFTER

### BEFORE (Insecure)
```
LOCAL STORAGE:
  token: eyJhbGciOiJIUzUxMiJ9...        <- VULNERABLE TO XSS
  refreshToken: 6dc3ef52-e430-4778...   <- VULNERABLE TO XSS
  user: {"id":"...","email":"..."}

COOKIES:
  (none)

SECURITY RISK:
  - Any JavaScript can read localStorage
  - XSS attack can steal tokens
  - Attacker can impersonate user
```

### AFTER (Secure - Like Claude)
```
LOCAL STORAGE:
  user: {"id":"...","email":"..."}      <- Only user info (not sensitive)

COOKIES (HttpOnly - JavaScript CANNOT access):
  access_token: eyJhbGciOiJIUzUxMiJ9... <- SECURE
  refresh_token: 6dc3ef52-e430-4778...  <- SECURE

SECURITY:
  - JavaScript cannot read tokens
  - XSS attack cannot steal tokens
  - Tokens sent automatically by browser
```

---

## How HttpOnly Cookies Work

```
1. User logs in
   Browser --> POST /auth/login --> Server
   Server  --> Set-Cookie: access_token=xyz; HttpOnly; Secure --> Browser

2. Browser stores cookie (JavaScript CANNOT access it)

3. User makes API call
   Browser automatically attaches cookie to request
   Browser --> GET /sweets + Cookie: access_token=xyz --> Server

4. XSS Attack tries to steal token
   attacker.js --> document.cookie --> EMPTY (HttpOnly cookies not visible)
   attacker.js --> localStorage.getItem('token') --> null (no token stored)
   ATTACK FAILED
```

---

## Files Changed

### Frontend

#### src/services/api.js
```javascript
// BEFORE: Stored tokens in localStorage
localStorage.setItem('token', accessToken);
config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;

// AFTER: No token storage - cookies sent automatically
// withCredentials: true ensures cookies are sent
const api = axios.create({
  withCredentials: true  // This is the key!
});
// No Authorization header needed - cookie is sent automatically
```

#### src/context/AuthContext.js
```javascript
// BEFORE: Stored tokens
localStorage.setItem('token', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// AFTER: Only store user info (not sensitive)
localStorage.setItem('user', JSON.stringify(userData));
// Tokens are in HttpOnly cookies - we cannot and should not access them
```

### Backend

#### AuthController.java
```java
// Sets HttpOnly cookies on login/register/refresh
ResponseCookie accessCookie = ResponseCookie.from("access_token", accessToken)
    .httpOnly(true)      // JavaScript cannot access
    .secure(true)        // HTTPS only (in production)
    .sameSite("Lax")     // CSRF protection
    .path("/")
    .maxAge(Duration.ofMillis(accessTokenExpiration))
    .build();
```

#### JwtAuthenticationFilter.java
```java
// Reads token from cookie first, then header as fallback
private String extractJwtFromRequest(HttpServletRequest request) {
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
        return Arrays.stream(cookies)
            .filter(cookie -> "access_token".equals(cookie.getName()))
            .map(Cookie::getValue)
            .findFirst()
            .orElse(extractFromHeader(request));
    }
    return extractFromHeader(request);
}
```

---

## Configuration

### application.properties
```properties
# Cookie settings
app.cookie.secure=false          # Set to true in production (HTTPS)
app.cookie.same-site=Lax         # CSRF protection

# Token expiry
jwt.expiration=60000             # 1 minute (for testing)
jwt.refresh-expiration=120000    # 2 minutes (for testing)

# Production recommended:
# jwt.expiration=900000          # 15 minutes
# jwt.refresh-expiration=604800000  # 7 days
```

---

## Security Comparison

| Feature | Before | After |
|---------|--------|-------|
| Token Storage | localStorage | HttpOnly Cookie |
| XSS Vulnerable | YES | NO |
| JavaScript Access | YES | NO |
| CSRF Protected | NO | YES (SameSite) |
| Automatic Send | NO (manual header) | YES (browser sends) |
| Token Visible in DevTools | YES (localStorage) | NO (HttpOnly) |

---

## How to Verify Security

Open browser DevTools and run:
```javascript
// This should return NOTHING for tokens
console.log(localStorage.getItem('token'));        // null
console.log(localStorage.getItem('refreshToken')); // null

// This should NOT show access_token or refresh_token
console.log(document.cookie);  // HttpOnly cookies not visible

// Only user info should be in localStorage
console.log(localStorage.getItem('user'));  // {"id":"...","email":"..."}
```

---

## Token Flow

```
LOGIN:
  1. POST /auth/login with email/password
  2. Server validates credentials
  3. Server generates access_token (1 min) + refresh_token (2 min)
  4. Server sends Set-Cookie headers (HttpOnly)
  5. Browser stores cookies (invisible to JS)
  6. Frontend stores only user info in localStorage

API CALL:
  1. Frontend makes request with withCredentials: true
  2. Browser automatically attaches cookies
  3. Server reads token from cookie
  4. Server validates token
  5. Returns data

TOKEN EXPIRED:
  1. API call returns 401
  2. Frontend calls /auth/refresh (cookies sent automatically)
  3. Server validates refresh_token from cookie
  4. Server sends new tokens in Set-Cookie headers
  5. Frontend retries original request
  6. Success!

LOGOUT:
  1. POST /auth/logout (cookies sent automatically)
  2. Server blacklists access_token JTI
  3. Server deletes refresh_token from database
  4. Server sends Set-Cookie with maxAge=0 (deletes cookies)
  5. Frontend removes user from localStorage
```

---

## Production Checklist

- [ ] Set `app.cookie.secure=true`
- [ ] Set `app.cookie.same-site=Strict`
- [ ] Use HTTPS
- [ ] Set `jwt.expiration=900000` (15 min)
- [ ] Set `jwt.refresh-expiration=604800000` (7 days)
- [ ] Set strong JWT_SECRET environment variable
