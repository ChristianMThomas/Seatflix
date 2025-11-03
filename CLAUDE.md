# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mind-Forge-SeatFlix is a free movie streaming website featuring:
- **Frontend**: React + Vite with Tailwind CSS
- **Backend**: Spring Boot (Java 17) REST API with JWT authentication
- **Data Sources**: TMDB API for movies, Appwrite for search analytics
- **Database**: MySQL for user management

## Repository Structure

```
Seatflix/
├── Movie-App-Frontend/     # React frontend application
├── Movie-App-Backend/      # Spring Boot backend API
└── CLAUDE.md              # This file
```

## Frontend Development

### Directory: `Movie-App-Frontend/`

#### Development Commands

```bash
cd Movie-App-Frontend

# Install dependencies
npm install

# Development server (runs on http://localhost:5173)
npm run dev

# Production build
npm run build

# Lint code
npm run lint

# Preview production build
npm preview
```

#### Architecture

**Tech Stack:**
- React 19 with React Router v7
- Vite 6 for build tooling
- Tailwind CSS v4 for styling
- Axios for HTTP requests
- JWT-based authentication

**Key Files:**
- `src/api.js` - Axios instance with JWT interceptors
- `src/context/AuthContext.jsx` - Authentication state management
- `src/pages/` - Route components (Login, Register, Home, Search, Watch, Profile)
- `src/components/` - Reusable UI components

**Authentication Flow:**
1. User logs in via `/api/v1/users/login`
2. Backend returns JWT token + user data
3. Token stored in `localStorage` as `authToken`
4. Axios interceptor adds `Authorization: Bearer {token}` to all requests
5. On 401 responses, token is cleared and user redirected to login

**Routing:**
- **Public routes**: `/`, `/login`, `/register`
- **Protected routes** (require `<ProtectedRoute>` wrapper):
  - `/home` - Featured movies
  - `/Search` - Movie search and discovery
  - `/Watch/:id` - Movie player (uses TMDB movie ID)
  - `/Profile` - User profile management

#### Environment Variables

Create `Movie-App-Frontend/.env.local`:

```env
# Backend API URL
VITE_SEATFLIX_API_URL=http://localhost:8080

# TMDB API (movie data)
VITE_TMDB_API_KEY=<your-tmdb-jwt-bearer-token>

# Appwrite (search analytics)
VITE_APPWRITE_PROJECT_ID=<your-project-id>
VITE_APPWRITE_DB_ID=<your-database-id>
VITE_APPWRITE_COLLECTION_ID=<your-collection-id>
```

#### Data Sources

1. **TMDB API** (`api.themoviedb.org/3`) - Movie data
   - Used in: `Searchpg.jsx`, `Watchpg.jsx`
   - Requires bearer token authentication

2. **Appwrite** (`cloud.appwrite.io`) - Search analytics
   - Tracks search terms and trending movies
   - Functions in: `src/appwrite.js`

3. **Custom Backend** - User authentication and profiles
   - API client in: `src/api.js`
   - All requests automatically include JWT token

## Backend Development

### Directory: `Movie-App-Backend/`

#### Development Commands

```bash
cd Movie-App-Backend

# Run in development (requires Maven)
./mvnw spring-boot:run

# Build JAR file
./mvnw clean package

# Run tests
./mvnw test
```

#### Architecture

**Tech Stack:**
- Spring Boot 3.5.0
- Java 17
- Spring Security with JWT
- Spring Data JPA + Hibernate
- MySQL database
- BCrypt password hashing

**Project Structure:**
```
src/main/java/com/Mind_Forge_SeatFlix/SeatFlix/
├── Users/
│   ├── UsersController.java      # REST endpoints
│   ├── UsersService.java         # Business logic
│   ├── UsersRepository.java      # Database access
│   ├── UsersConfig.java          # Security configuration
│   ├── UserDetailsServiceImpl.java
│   └── LoginRequest.java         # DTO
├── entity/
│   └── Users.java                # User entity/model
├── config/
│   ├── WebConfig.java            # CORS configuration
│   └── CustomUserDetails.java   # Security wrapper
├── security/
│   └── JwtAuthenticationFilter.java  # JWT filter
└── util/
    └── JwtUtil.java              # JWT token utilities
```

#### API Endpoints

**Public Endpoints:**
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login (returns JWT token)

**Authenticated Endpoints** (require `Authorization: Bearer {token}`):
- `GET /api/v1/users` - List all users
- `GET /api/v1/users/{id}` - Get user by ID
- `GET /api/v1/users/me` - Get current authenticated user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user
- `POST /api/v1/users/upload-avatar` - Upload profile picture

#### Authentication Implementation

**JWT Flow:**
1. User submits credentials to `/login`
2. `UsersController` validates with `AuthenticationManager`
3. If valid, `JwtUtil` generates token (24hr expiration by default)
4. Token returned in response: `{"token": "...", "userId": 123, ...}`
5. Client sends token in `Authorization` header on subsequent requests
6. `JwtAuthenticationFilter` intercepts requests, validates token, sets Spring Security context

**Security Configuration:**
- CSRF disabled (stateless JWT authentication)
- Session management: STATELESS
- CORS configured via environment variable
- Password encoding: BCrypt

#### Environment Variables

Create `Movie-App-Backend/.env` (see `.env.example`):

```env
# Database
DB_URL=jdbc:mysql://localhost:3306/seatflix
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-key-min-32-characters-long-for-production
JWT_EXPIRATION=86400000  # 24 hours in milliseconds

# CORS (comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,https://mind-forge-cthomas.com
```

**Loading Environment Variables:**
- Spring Boot automatically loads from system environment or `.env` file
- Format: `${ENV_VAR:default-value}`
- See `application.properties` for configuration

#### Database Schema

**Users Table:**
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- BCrypt hashed
  email VARCHAR(255) UNIQUE NOT NULL,
  profile_pic VARCHAR(255),
  date_joined DATE,
  version BIGINT
);
```

## Common Development Workflows

### Running Full Stack Locally

1. **Start MySQL database** (port 3306)

2. **Start backend:**
   ```bash
   cd Movie-App-Backend
   ./mvnw spring-boot:run
   ```
   Backend runs on http://localhost:8080

3. **Start frontend:**
   ```bash
   cd Movie-App-Frontend
   npm run dev
   ```
   Frontend runs on http://localhost:5173

### Adding a New API Endpoint

1. Add method to `UsersController.java`
2. Add business logic to `UsersService.java`
3. Add database method to `UsersRepository.java` (if needed)
4. Update security config in `UsersConfig.java` if endpoint should be public
5. Add endpoint to `Movie-App-Frontend/src/api.js`
6. Use in frontend component via `api.get()` / `api.post()` etc.

### Deploying

**Backend (Railway/Heroku):**
- Set environment variables in platform dashboard
- Build command: `./mvnw clean package`
- Start command: `java -jar target/SeatFlix-0.0.1-SNAPSHOT.jar`

**Frontend (Vercel/Netlify):**
- Set `VITE_SEATFLIX_API_URL` to production backend URL
- Build command: `npm run build`
- Output directory: `dist/`

## Important Notes

### Security
- **Never commit** `.env` files or secrets to git
- **Always use** environment variables for sensitive data
- JWT secret must be at least 32 characters in production
- File uploads are stored locally in `uploads/` - use cloud storage (S3/Cloudinary) for production

### Authentication
- Frontend persists JWT in `localStorage` (survives page refresh)
- Token expiration handled by backend (default 24hrs)
- No refresh token implemented - user must re-login after expiration
- 401 responses automatically clear token and redirect to login

### Known Limitations
- File uploads stored locally (won't work in containerized/multi-instance deployments)
- No email verification on registration
- No password reset functionality
- No rate limiting on API endpoints
- Search analytics in Appwrite, but user data in MySQL (dual backend)

### Code Style
- Backend: Java standard naming (camelCase for methods/variables)
- Frontend: React/JavaScript conventions (PascalCase for components)
- Validation: Backend uses Jakarta validation annotations (`@NotBlank`, `@Email`)
- Frontend validation: Basic HTML5 + error messages from backend
