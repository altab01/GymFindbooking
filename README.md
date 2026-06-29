# FitnessFreak

A full-stack gym finder application with a React frontend and Spring Boot backend. Users can register, log in, and find gyms near their location using the Google Places API. The backend handles complete user lifecycle management with secure password storage.

---

## What It Does

FitnessFreak lets users discover gyms nearby based on their current location. The app integrates Google Places API to fetch real gym data — name, address, rating, and coordinates — filtered by a configurable radius. Users can create accounts, log in securely, and manage their profiles.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (with React Router) |
| Backend Framework | Spring Boot 3 |
| Language | Java 17 |
| Database | MySQL |
| ORM | Spring Data JPA |
| Password Security | BCrypt |
| External API | Google Places API |
| Build Tool | Maven |
| API Style | REST |

---

## Project Structure

```
fitnessfreak/
├── src/main/java/com/fitnessfreak/
│   ├── controller/
│   │   └── UserController.java
│   ├── service/
│   │   └── UserService.java
│   ├── repository/
│   │   └── UserRepository.java
│   ├── model/
│   │   └── User.java
│   ├── dto/
│   │   └── UserDTO.java
│   └── exception/
│       └── UserException.java
├── src/main/resources/
│   └── application.properties
└── frontend/
    ├── src/
    │   ├── Pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Forget.jsx
    │   │   └── gym_dashboard.jsx
    │   └── App.jsx
```

---

## Database Schema

### users
| Column | Type | Notes |
|---|---|---|
| id | BIGINT | Primary key, auto-increment |
| name | VARCHAR(255) | User's full name |
| email | VARCHAR(255) | Unique, used for login |
| password | VARCHAR(255) | BCrypt hashed — never stored plain text |
| phone | VARCHAR(20) | Optional |
| location | VARCHAR(255) | User's city/area e.g. Koramangala, Bengaluru |
| created_at | TIMESTAMP | Auto-set on insert |
| updated_at | TIMESTAMP | Auto-updated on every save |

---

## API Endpoints

### 1. Signup
```
POST /api/users/signup
Content-Type: application/json

{
  "name": "Rohan Verma",
  "email": "rohan@example.com",
  "password": "secret123",
  "phone": "+91 98765 43210",
  "location": "Koramangala, Bengaluru"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully!",
  "data": {
    "id": 1,
    "name": "Rohan Verma",
    "email": "rohan@example.com",
    "phone": "+91 98765 43210",
    "location": "Koramangala, Bengaluru",
    "createdAt": "2024-01-15T10:30:00"
  }
}
```

Password is never returned in any response.

---

### 2. Login
```
POST /api/users/login
Content-Type: application/json

{
  "email": "rohan@example.com",
  "password": "secret123"
}
```

BCrypt compares the input password against the stored hash. Both "email not found" and "wrong password" return the same error message intentionally — to prevent email enumeration attacks.

---

### 3. Get User Profile
```
GET /api/users/{id}
```

---

### 4. Update Profile
```
PUT /api/users/{id}
Content-Type: application/json

{
  "name": "Rohan R. Verma",
  "phone": "+91 99999 00000",
  "location": "Indiranagar, Bengaluru"
}
```

Only name, phone, and location can be updated. Email and password changes are handled separately.

---

### 5. Delete Account
```
DELETE /api/users/{id}
```

---

### 6. Nearby Gyms (Google Places Integration)
```
GET /api/gyms/nearby?latitude=12.9352&longitude=77.6245&radius=3000
```

Calls Google Places API internally with `type=gym`, parses the JSON response, and returns a clean list of nearby gyms.

**Response:**
```json
[
  {
    "name": "Gold's Gym",
    "address": "80 Feet Road, Koramangala",
    "latitude": 12.9360,
    "longitude": 77.6250,
    "rating": 4.3
  }
]
```

---

## Security Design

### Password Hashing
Passwords are hashed using BCrypt before storage. BCrypt is a one-way hashing algorithm with built-in salt — the same password hashed twice produces different outputs, making rainbow table attacks ineffective.

```java
passwordEncoder.encode(rawPassword)     // on signup
passwordEncoder.matches(raw, hashed)    // on login
```

### Why BCrypt over MD5/SHA?
MD5 and SHA are fast — which makes them easy to brute force. BCrypt is deliberately slow and has a configurable cost factor. As hardware gets faster, the cost factor can be increased without changing the algorithm.

---

## Frontend Pages

| Page | Route | Purpose |
|---|---|---|
| Login | `/` | Email + password login, calls `/api/users/login` |
| Signup | `/signup` | Registration form, calls `/api/users/signup` |
| Forgot Password | `/forgot-password` | Password reset flow |
| Dashboard | `/dashboard` | Gym map, nearby search, profile |

After successful login or signup, the user object is stored in `localStorage` and the user is redirected to `/dashboard`.

---

## Setup and Running

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Google Places API key

### Backend

```bash
cd fitnessfreak
```

Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fitnessfreak_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
google.api.key=your_google_places_api_key
```

Run:
```bash
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`, backend at `http://localhost:8080`.

---

## CRUD Summary

| Operation | Method | Endpoint |
|---|---|---|
| Create | POST | `/api/users/signup` |
| Read (login) | POST | `/api/users/login` |
| Read (profile) | GET | `/api/users/{id}` |
| Read (all users) | GET | `/api/users` |
| Update | PUT | `/api/users/{id}` |
| Delete | DELETE | `/api/users/{id}` |

---

## What I Learned

Integrating a third-party API (Google Places) inside a Spring Boot service layer taught me how to handle external HTTP calls using RestTemplate and parse nested JSON responses. Implementing BCrypt for password security made me understand why plain text or weakly hashed passwords are a real vulnerability. Building the full login/signup flow end to end — from React form to Spring Boot controller to MySQL — gave me a complete picture of how a production user auth system comes together.
