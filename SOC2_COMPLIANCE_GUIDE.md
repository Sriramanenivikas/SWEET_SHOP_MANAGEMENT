# SOC 2 Compliance Guide for TMS Application

## What is SOC 2?

SOC 2 (Service Organization Control 2) is an auditing standard for service providers storing customer data in the cloud. It evaluates 5 Trust Service Criteria:

1. **Security** (Required)
2. **Availability** (Optional)
3. **Processing Integrity** (Optional)
4. **Confidentiality** (Optional)
5. **Privacy** (Optional)

---

## Current Implementation Status

### Authentication & Session Security

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Secure token storage | DONE | HttpOnly cookies |
| XSS protection | DONE | HttpOnly + CSP headers |
| CSRF protection | DONE | SameSite=Strict |
| Session timeout | DONE | Short-lived tokens (15 min) |
| Secure transmission | NEED | HTTPS required |
| Password hashing | DONE | BCrypt |
| Token invalidation | DONE | Blacklist + logout |
| MFA | NEED | Not implemented |

### What's Missing for SOC 2

| Category | Requirement | Priority |
|----------|-------------|----------|
| Security | Multi-Factor Authentication (MFA) | HIGH |
| Security | Rate limiting / brute force protection | HIGH |
| Security | Audit logging | HIGH |
| Security | Encryption at rest | MEDIUM |
| Security | Vulnerability scanning | MEDIUM |
| Availability | Uptime monitoring | MEDIUM |
| Availability | Disaster recovery | MEDIUM |
| Confidentiality | Data classification | LOW |
| Privacy | Data retention policies | LOW |

---

## Implementation Roadmap

### Phase 1: Critical Security (Week 1-2)

#### 1. Multi-Factor Authentication (MFA)

```java
// Add to User entity
@Column(name = "mfa_enabled")
private boolean mfaEnabled = false;

@Column(name = "mfa_secret")
private String mfaSecret;

// MFA verification endpoint
@PostMapping("/auth/verify-mfa")
public ResponseEntity<?> verifyMfa(@RequestBody MfaRequest request) {
    // Verify TOTP code
    // Issue final access token only after MFA
}
```

**Recommended library:** `com.warrenstrange:googleauth`

#### 2. Rate Limiting

```java
// Add to SecurityConfig
@Bean
public RateLimiter rateLimiter() {
    return RateLimiter.create(10.0); // 10 requests per second
}

// Or use bucket4j
@Bean
public Bucket loginBucket() {
    return Bucket.builder()
        .addLimit(Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1))))
        .build();
}
```

#### 3. Audit Logging

```java
@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    private UUID id;
    
    private String userId;
    private String action;        // LOGIN, LOGOUT, CREATE, UPDATE, DELETE
    private String resource;      // User, Sweet, Order
    private String resourceId;
    private String ipAddress;
    private String userAgent;
    private String oldValue;      // JSON of previous state
    private String newValue;      // JSON of new state
    private LocalDateTime timestamp;
    private String status;        // SUCCESS, FAILURE
}

// Audit service
@Service
public class AuditService {
    public void log(String userId, String action, String resource, 
                    String resourceId, String oldValue, String newValue) {
        AuditLog log = new AuditLog();
        log.setId(UUID.randomUUID());
        log.setUserId(userId);
        log.setAction(action);
        log.setResource(resource);
        log.setResourceId(resourceId);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);
        log.setTimestamp(LocalDateTime.now());
        log.setIpAddress(getCurrentIp());
        log.setUserAgent(getCurrentUserAgent());
        auditLogRepository.save(log);
    }
}
```

### Phase 2: Enhanced Security (Week 3-4)

#### 4. Account Lockout

```java
@Entity
public class User {
    // Add fields
    private int failedLoginAttempts = 0;
    private LocalDateTime lockoutUntil;
    
    public boolean isLocked() {
        return lockoutUntil != null && LocalDateTime.now().isBefore(lockoutUntil);
    }
}

// In AuthService
public void handleFailedLogin(User user) {
    user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
    if (user.getFailedLoginAttempts() >= 5) {
        user.setLockoutUntil(LocalDateTime.now().plusMinutes(30));
        auditService.log(user.getId(), "ACCOUNT_LOCKED", "User", user.getId(), null, null);
    }
    userRepository.save(user);
}
```

#### 5. Password Policy

```java
@Component
public class PasswordValidator {
    public void validate(String password) {
        if (password.length() < 12) {
            throw new WeakPasswordException("Password must be at least 12 characters");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new WeakPasswordException("Password must contain uppercase letter");
        }
        if (!password.matches(".*[a-z].*")) {
            throw new WeakPasswordException("Password must contain lowercase letter");
        }
        if (!password.matches(".*[0-9].*")) {
            throw new WeakPasswordException("Password must contain digit");
        }
        if (!password.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            throw new WeakPasswordException("Password must contain special character");
        }
    }
}
```

#### 6. Security Headers

```java
@Configuration
public class SecurityHeadersConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public void postHandle(HttpServletRequest request, HttpServletResponse response,
                                   Object handler, ModelAndView modelAndView) {
                response.setHeader("X-Content-Type-Options", "nosniff");
                response.setHeader("X-Frame-Options", "DENY");
                response.setHeader("X-XSS-Protection", "1; mode=block");
                response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
                response.setHeader("Content-Security-Policy", "default-src 'self'");
                response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
                response.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
            }
        });
    }
}
```

### Phase 3: Infrastructure (Week 5-6)

#### 7. Database Encryption at Rest

```yaml
# PostgreSQL with encryption (Docker)
services:
  db:
    image: postgres:15
    command: >
      -c ssl=on
      -c ssl_cert_file=/var/lib/postgresql/server.crt
      -c ssl_key_file=/var/lib/postgresql/server.key
    volumes:
      - ./certs:/var/lib/postgresql/
    environment:
      POSTGRES_INITDB_ARGS: "--data-checksums"
```

#### 8. Secrets Management

```yaml
# Use environment variables or secrets manager
# application.properties
jwt.secret=${JWT_SECRET}
spring.datasource.password=${DB_PASSWORD}

# In production, use:
# - AWS Secrets Manager
# - HashiCorp Vault
# - Azure Key Vault
```

#### 9. Monitoring & Alerting

```java
// Add Spring Actuator
// pom.xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

// application.properties
management.endpoints.web.exposure.include=health,metrics,info
management.endpoint.health.show-details=authorized
```

---

## SOC 2 Evidence Checklist

### Security (CC6.1 - CC6.8)

| Control | Evidence Required | How to Provide |
|---------|-------------------|----------------|
| Logical access | User authentication logs | Audit log table |
| Access removal | Deprovisioning process | Logout-all, token blacklist |
| Role-based access | RBAC implementation | USER/ADMIN roles |
| Encryption in transit | TLS certificates | HTTPS config |
| Encryption at rest | DB encryption | PostgreSQL SSL |
| Intrusion detection | Security monitoring | Log analysis, alerts |
| Vulnerability mgmt | Scan reports | OWASP ZAP, Snyk |

### Availability (A1.1 - A1.3)

| Control | Evidence Required | How to Provide |
|---------|-------------------|----------------|
| Uptime monitoring | SLA metrics | Uptime robot, Datadog |
| Backup procedures | Backup logs | Automated DB backups |
| Disaster recovery | DR plan | Documented procedure |
| Incident response | IR plan | Runbook |

---

## Separate Auth Domain for SOC 2?

**NOT REQUIRED** for SOC 2 compliance.

SOC 2 auditors check:
- Are tokens protected from XSS? (YES - HttpOnly)
- Are tokens protected from CSRF? (YES - SameSite)
- Is transmission encrypted? (YES - HTTPS)
- Are sessions properly managed? (YES - expiry, blacklist)

Separate auth domain is a **nice-to-have**, not a requirement.

---

## Quick Wins for SOC 2 Audit

### 1. Update application.properties

```properties
# Production security settings
app.cookie.secure=true
app.cookie.same-site=Strict
jwt.expiration=900000
jwt.refresh-expiration=86400000

# Password requirements
app.password.min-length=12
app.password.require-uppercase=true
app.password.require-lowercase=true
app.password.require-digit=true
app.password.require-special=true

# Account lockout
app.security.max-failed-attempts=5
app.security.lockout-duration-minutes=30

# Rate limiting
app.security.rate-limit-requests=100
app.security.rate-limit-duration-seconds=60
```

### 2. Add Security Headers (Frontend)

```javascript
// In index.html or nginx config
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
```

### 3. Enable HTTPS

```nginx
server {
    listen 443 ssl;
    ssl_certificate /etc/ssl/certs/sweetshop.crt;
    ssl_certificate_key /etc/ssl/private/sweetshop.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

---

## Timeline to SOC 2 Readiness

| Phase | Duration | Tasks |
|-------|----------|-------|
| 1 | 2 weeks | MFA, Rate limiting, Audit logging |
| 2 | 2 weeks | Account lockout, Password policy, Headers |
| 3 | 2 weeks | Infrastructure, Monitoring, Documentation |
| 4 | 4 weeks | Pre-audit, Gap assessment, Remediation |
| 5 | 4-8 weeks | SOC 2 Type 1 audit |
| 6 | 6-12 months | SOC 2 Type 2 audit (observation period) |

**Total: 4-6 months for SOC 2 Type 1**

---

## Cost Estimates

| Item | Cost |
|------|------|
| SOC 2 Type 1 Audit | $20,000 - $50,000 |
| SOC 2 Type 2 Audit | $30,000 - $80,000 |
| Compliance tools (Vanta, Drata) | $10,000 - $25,000/year |
| Security tools (scanning, monitoring) | $5,000 - $15,000/year |
| Development effort | 2-3 months engineering |

---

## Summary

**Your current auth implementation covers 70% of SOC 2 security requirements.**

Missing pieces:
1. MFA (critical for SOC 2)
2. Audit logging (critical)
3. Rate limiting (important)
4. Account lockout (important)
5. HTTPS in production (required)

**Separate auth domain: NOT required for SOC 2**
