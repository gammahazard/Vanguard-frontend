# 🐕 Vanguard Kennel Systems | Premium Pet Care

![Status](https://img.shields.io/badge/Status-Ultra--Premium-D4AF37?style=for-the-badge&logo=appveyor)
![Security](https://img.shields.io/badge/Security-Biometric%20Verified-4ade80?style=for-the-badge&logo=faceid)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014-000000?style=for-the-badge&logo=next.js)
![Backend](https://img.shields.io/badge/Backend-Rust%20🦀-orange?style=for-the-badge&logo=rust)
![PWA](https://img.shields.io/badge/Platform-PWA%20Mobile-blue?style=for-the-badge&logo=pwa)

Vanguard is a high-end kennel management platform designed for performance, security, and a premium user experience.
Vanguard offers 5-star care, expansive open spaces, and state-of-the-art security for your VIP (Very Important Pup), ensuring peace of mind while you travel.

Built with a decoupled architecture, it leverages a high-performance Rust backend and a modern Next.js frontend.

## 🏗️ System Architecture

Vanguard uses a modern, decoupled architecture for maximum security and performance.

```mermaid
graph TD
    Client((Client PWA))
    Frontend[Vercel Frontend]
    Backend[Linode Rust API]
    DB[(SQLite Database)]

    Client -- HTTPS/JSON --> Frontend
    Frontend -- API Request --> Backend
    Backend -- SQLx --> DB
    
    subgraph "Infrastructure Layer (Linode)"
    Backend
    DB
    end

    subgraph "Edge Layer (Vercel)"
    Frontend
    end
```

## 🏰 System Hierarchy & Access Levels

Vanguard is built with a strictly tiered access model, ensuring that every user has exactly what they need for their specific role.

```mermaid
graph TD
    %% Roles
    User((Root User)) --> Owner[Owner Dashboard]
    User --> Staff[Staff Portal]
    User --> Client[Client Portal]

    %% Owner Capabilities
    Owner --> |Financials| Rev[Revenue & Analytics]
    Owner --> |Security| Audit[Global Audit Logs]
    Owner --> |Users| Management[Staff & Client Management]

    %% Staff Capabilities
    Staff --> |Care| Feeding[Feeding & Medication]
    Staff --> |Operations| Bookings[Booking Confirmation]
    Staff --> |Support| ChatStaff[Client Messenger]

    %% Client Capabilities
    Client --> |Pets| PetProfiles[VIP Pet Profiles]
    Client --> |Bookings| Reservation[New Stay Requests]
    Client --> |Trust| Cam[Live Kennel Cams]
    Client --> |Support| ChatClient[Staff Messenger]

    %% Interactions
    ChatStaff <--> ChatClient
```

## 🔒 Security Architecture

Vanguard employs a **Decoupled Architecture**, explicitly separating the frontend presentation layer from the backend logic and database.

*   **Frontend (Next.js)**: Hosted on Vercel/Edge. Acts purely as a visual client. It processes no sensitive logic and has no direct access to the database.
*   **Backend (Rust)**: Hosted on a secure, isolated Linux VPS. Written in high-performance Rust, it handles all authentication, business logic, and database transactions.

### Vulnerability Mitigation
This separation ensures that common web vulnerabilities (like Next.js Server-Side Request Forgery or RCE exploits) cannot compromise the core system. Even if the frontend were compromised, the attacker would have no access to the backend environment, database credentials, or server files.

## 🔒 Security Flow

Vanguard employs a defense-in-depth strategy to ensure user data remains private.

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Vercel)
    participant B as Backend (Rust/Axum)
    participant D as Database (SQLite)

    U->>F: Enter Credentials
    F->>B: POST /api/login
    B->>D: SELECT user_hash
    D-->>B: Password Hash
    B->>B: Argon2 Verification
    B-->>F: JWT Token + Role
    F-->>U: Redirection to Dashboard
```

## 🚀 Key Features

- **Blazing Fast Backend**: Powered by Rust (Axum + Tokio) for unmatched concurrency.
- **Bank-Grade Security**: Argon2 password hashing and TLS 1.3 encryption.
- **Decoupled Privacy**: Physical isolation between frontend and backend servers.
- **Premium UI**: Material UI components with a glassmorphism aesthetic.
- **Rich Data Seeding**: Complete demo environment with 12+ VIP clients and audit logs.

## 🛡️ Biometric Authentication (WebAuthn)

Vanguard provides cutting-edge security via **WebAuthn (Face ID / Touch ID)**. This allows users to authenticate without passwords using their device's hardware security module.

### How it works

Vanguard implements the FIDO2/WebAuthn standard, ensuring that your biometric data **never leaves your device**. Only a cryptographically signed "challenge" is sent to our Rust backend.

#### 1. Registration Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (PWA)
    participant B as Backend (Rust)
    participant HW as Secure Enclave

    U->>F: Toggle Face ID (Profile)
    F->>B: POST /register/start (Challenge)
    B-->>F: Challenge + RP ID
    F->>HW: Browser Invoke (WebAuthn)
    HW-->>U: Prompt Face/Fingerprint
    U-->>HW: Authenticate
    HW-->>F: Signed Attestation
    F->>B: POST /register/finish
    B->>B: Verify & Store Credential
    B-->>F: Success
```

#### 2. Authentication (Login) Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (PWA)
    participant B as Backend (Rust)
    participant HW as Secure Enclave

    U->>F: Tap "Login with Face ID"
    F->>B: POST /login/start (Challenge)
    B-->>F: Challenge + Allowed Credentials
    F->>HW: Browser Invoke (WebAuthn)
    HW-->>U: Prompt Face/Fingerprint
    U-->>HW: Authenticate
    HW-->>F: Signed Assertion
    F->>B: POST /login/finish
    B->>B: Verify Signature
    B-->>F: JWT Login Token
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Material UI, Emotion, PWA, `@simplewebauthn/browser`.
- **Backend**: Rust, Axum, SQLx, Argon2, `webauthn-rs`.
- **Database**: SQLite.
- **Infrastructure**: Vercel (Frontend), Linode VPS (Backend).

---
© 2025 Vanguard Kennel Systems. All Rights Reserved.
