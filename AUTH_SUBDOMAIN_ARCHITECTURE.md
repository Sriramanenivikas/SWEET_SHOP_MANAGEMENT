# Advanced Auth Subdomain Architecture

## How Claude/Big Companies Do It

```
CLAUDE EXAMPLE:
  Main App:    claude.ai
  Auth Server: auth.anthropic.com (separate subdomain/domain)

When you visit claude.ai:
  - DevTools shows cookies for claude.ai only
  - Auth cookies are on auth.anthropic.com
  - You cannot see auth.anthropic.com cookies from claude.ai
  - Even DevTools on claude.ai cannot show them
```

---

## Architecture Diagram

```
YOUR CURRENT SETUP (Single Domain):
==================================

  localhost:3000 (Frontend)
       |
       v
  localhost:8080 (Backend + Auth)
       |
       v
  [Cookies visible in DevTools for localhost:8080]


ENTERPRISE SETUP (Separate Auth Domain):
========================================

  app.sweetshop.com (Frontend)
       |
       |--- API calls ---> api.sweetshop.com (Backend API)
       |
       |--- Auth calls --> auth.sweetshop.com (Auth Server)
                                |
                                v
                          [Cookies set for auth.sweetshop.com]
                          [NOT visible from app.sweetshop.com DevTools]
```

---

## How It Works

### Step 1: Separate Services

```
Service 1: Frontend (app.sweetshop.com)
  - React/Vue/Angular app
  - No auth logic
  - Redirects to auth server for login

Service 2: Auth Server (auth.sweetshop.com)
  - Handles login/register/logout
  - Sets HttpOnly cookies for auth.sweetshop.com domain
  - Issues JWT tokens

Service 3: API Server (api.sweetshop.com)
  - Business logic (sweets CRUD)
  - Validates tokens by calling auth server
  - Or uses shared JWT secret
```

### Step 2: Login Flow

```
1. User visits app.sweetshop.com
2. User clicks "Login"
3. Redirect to auth.sweetshop.com/login
4. User enters credentials on AUTH domain
5. Auth server validates and sets cookie:
   Set-Cookie: access_token=xyz; Domain=auth.sweetshop.com; HttpOnly; Secure
6. Auth server redirects back to app.sweetshop.com with a one-time code
7. Frontend exchanges code for session (or just trusts the cookie)
8. User is logged in

Cookie is on auth.sweetshop.com - NOT visible from app.sweetshop.com
```

### Step 3: API Calls with Token

```
Option A: Cookie forwarding (complex)
  - API server shares domain (.sweetshop.com)
  - Cookie set with Domain=.sweetshop.com
  - All subdomains can read it

Option B: Token in header (common)
  - Auth server returns access token in response body (not cookie)
  - Frontend stores in memory (not localStorage)
  - Frontend sends token in Authorization header
  - Token refreshed via auth.sweetshop.com cookie

Option C: BFF Pattern (most secure)
  - Backend-for-Frontend
  - Frontend never sees token
  - BFF handles all auth
```

---

## Implementation for Sweet Shop

### Option 1: Simple (Subdomain Cookie Sharing)

```
Domains:
  app.sweetshop.com     - Frontend
  api.sweetshop.com     - Backend

Cookie Config:
  Domain=.sweetshop.com  (note the dot - shares across subdomains)
  HttpOnly=true
  Secure=true
  SameSite=Strict
```

**Backend application.properties:**
```properties
app.cookie.domain=.sweetshop.com
app.cookie.secure=true
app.cookie.same-site=Strict
```

**AuthController.java change:**
```java
ResponseCookie accessCookie = ResponseCookie.from("access_token", accessToken)
    .httpOnly(true)
    .secure(true)
    .sameSite("Strict")
    .domain(".sweetshop.com")  // Shared across subdomains
    .path("/")
    .maxAge(Duration.ofMillis(accessTokenExpiration))
    .build();
```

### Option 2: Separate Auth Domain (Like Claude)

```
Domains:
  sweetshop.com         - Frontend
  auth.sweetshop.com    - Auth Server
  api.sweetshop.com     - API Server
```

**Flow:**
```
1. Frontend redirects to auth.sweetshop.com/login
2. User logs in on auth subdomain
3. Auth sets cookie for auth.sweetshop.com only
4. Auth redirects to sweetshop.com?code=xyz
5. Frontend calls auth.sweetshop.com/token?code=xyz
6. Auth returns { accessToken, user } in response body
7. Frontend stores token in MEMORY (not localStorage)
8. Frontend sends Authorization header to api.sweetshop.com
9. For refresh: Frontend calls auth.sweetshop.com/refresh (cookie sent automatically)
```

---

## Local Development Setup

You cannot use subdomains with localhost. Options:

### Option A: Edit /etc/hosts

```bash
# Add to /etc/hosts
127.0.0.1  app.sweetshop.local
127.0.0.1  api.sweetshop.local
127.0.0.1  auth.sweetshop.local
```

Then run:
- Frontend on app.sweetshop.local:3000
- Backend on api.sweetshop.local:8080
- Auth on auth.sweetshop.local:8081

### Option B: Use nip.io (free wildcard DNS)

```
Frontend: app.127.0.0.1.nip.io:3000
Backend:  api.127.0.0.1.nip.io:8080
```

### Option C: Use ngrok (tunneling)

```bash
ngrok http 3000 --subdomain=sweetshop-app
ngrok http 8080 --subdomain=sweetshop-api
```

---

## Production Deployment

### DNS Setup

```
A Records:
  app.sweetshop.com  -> Frontend Server IP
  api.sweetshop.com  -> Backend Server IP
  auth.sweetshop.com -> Auth Server IP (can be same as backend)
```

### SSL Certificates

```bash
# Using Let's Encrypt with wildcard
certbot certonly --manual --preferred-challenges=dns \
  -d sweetshop.com -d *.sweetshop.com
```

### Nginx Config

```nginx
# Frontend
server {
    listen 443 ssl;
    server_name app.sweetshop.com;
    ssl_certificate /etc/letsencrypt/live/sweetshop.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sweetshop.com/privkey.pem;
    
    location / {
        root /var/www/frontend;
        try_files $uri $uri/ /index.html;
    }
}

# API
server {
    listen 443 ssl;
    server_name api.sweetshop.com;
    ssl_certificate /etc/letsencrypt/live/sweetshop.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sweetshop.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Auth (separate or same as API)
server {
    listen 443 ssl;
    server_name auth.sweetshop.com;
    ssl_certificate /etc/letsencrypt/live/sweetshop.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sweetshop.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8081;  # Or 8080 if same server
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Security Comparison

| Setup | Cookie Visibility | XSS Protection | CSRF Protection | Complexity |
|-------|------------------|----------------|-----------------|------------|
| Single Domain (current) | Visible in DevTools | YES | YES | Low |
| Subdomain Sharing | Visible in DevTools | YES | YES | Medium |
| Separate Auth Domain | NOT visible | YES | YES | High |

---

## Recommendation for Sweet Shop

### For Learning/Demo: Current Setup is FINE
- HttpOnly cookies protect from XSS
- DevTools visibility is not a security risk
- Attackers cannot access DevTools on user's browser

### For Production with Clients: Subdomain Sharing
- Use app.sweetshop.com and api.sweetshop.com
- Set cookie domain to .sweetshop.com
- Simple and secure

### For Enterprise/Banking: Separate Auth Domain
- Maximum security
- Requires more infrastructure
- Use OAuth2/OIDC protocols

---

## Quick Implementation Checklist

### Current Setup (Already Done)
- [x] HttpOnly cookies
- [x] Secure flag ready (enable in production)
- [x] SameSite=Lax
- [x] Token refresh flow
- [x] Token blacklisting

### Subdomain Setup (Medium Effort)
- [ ] Buy domain (e.g., sweetshop.com)
- [ ] Configure DNS (A records for subdomains)
- [ ] Get SSL certificate (Let's Encrypt wildcard)
- [ ] Deploy frontend to app.sweetshop.com
- [ ] Deploy backend to api.sweetshop.com
- [ ] Update CORS config
- [ ] Set cookie domain to .sweetshop.com

### Separate Auth Domain (High Effort)
- [ ] All of above, plus:
- [ ] Create separate auth service
- [ ] Implement OAuth2/OIDC flow
- [ ] Handle token exchange
- [ ] Implement session management

---

## Summary

**Your current implementation is SECURE for production.**

The only thing DevTools visibility means is that YOU (the developer) can see cookies while debugging. An attacker:
1. Cannot run DevTools on your users' browsers
2. Cannot access HttpOnly cookies via JavaScript
3. Cannot steal tokens via XSS

Separate auth domain is for:
- Large enterprises with compliance requirements
- Apps handling sensitive financial/medical data
- Companies with dedicated security teams

For Sweet Shop with clients: **Current setup + HTTPS is production-ready.**
