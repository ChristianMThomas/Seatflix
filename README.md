# Mind-Forge-SeatFlix

A full-stack movie streaming platform with user authentication, movie discovery, and personalized profiles.

## Overview
Mind-Forge-SeatFlix is a **free movie streaming website** that combines modern web technologies to deliver a seamless viewing experience. Users can explore movies, stream content, and manage their profiles with JWT-based secure authentication.

## Features
- 🎬 **Stream movies** for free using TMDB's extensive movie database
- 🔎 **Search & Discovery** with trending movies and personalized recommendations
- 🔐 **Secure Authentication** with JWT tokens and BCrypt password hashing
- 👤 **User Profiles** with avatar uploads and account management
- 📊 **Search Analytics** tracking powered by Appwrite
- 🎨 **Responsive UI** built with React and Tailwind CSS
- ⚡ **Fast Performance** with Vite build tooling

## Tech Stack

### Frontend
- **React 19** - UI framework with React Router v7
- **Vite 6** - Fast build tooling and dev server
- **Tailwind CSS v4** - Utility-first styling
- **Axios** - HTTP client with JWT interceptors

### Backend
- **Spring Boot 3.5.0** - Java REST API framework
- **Spring Security** - JWT-based authentication
- **MySQL** - User data and authentication
- **BCrypt** - Password hashing

### External APIs
- **TMDB API** - Movie data and streaming content
- **Appwrite** - Search analytics and trending data

## Project Structure

```
Seatflix/
├── Movie-App-Frontend/     # React + Vite frontend
│   ├── src/
│   │   ├── pages/          # Route components
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AuthContext for state management
│   │   └── api.js          # Axios instance with JWT interceptors
│   └── .env.example        # Frontend environment variables template
│
├── Movie-App-Backend/      # Spring Boot API
│   ├── src/main/java/      # Java source code
│   │   ├── Users/          # User endpoints and services
│   │   ├── config/         # Security and CORS configuration
│   │   ├── security/       # JWT authentication filter
│   │   └── util/           # JWT utilities
│   └── .env.example        # Backend environment variables template
│
└── CLAUDE.md              # Development documentation
```

## Getting Started

### Prerequisites
- **Node.js 18+** and npm
- **Java 17+** and Maven
- **MySQL 8.0+**
- **TMDB API account** (free at https://www.themoviedb.org/settings/api)
- **Appwrite account** (optional, for search analytics)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/Seatflix.git
cd Seatflix
```

#### 2. Setup Backend
```bash
cd Movie-App-Backend

# Copy environment template
cp .env.example .env

# Edit .env with your database credentials and JWT secret
# DB_URL=jdbc:mysql://localhost:3306/seatflix
# DB_USERNAME=root
# DB_PASSWORD=your_password
# JWT_SECRET=your-super-secret-key-min-32-characters-long

# Create MySQL database
mysql -u root -p
CREATE DATABASE seatflix;
exit;

# Run the application
./mvnw spring-boot:run
```
Backend will run on `http://localhost:8080`

#### 3. Setup Frontend
```bash
cd Movie-App-Frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your API keys
# VITE_SEATFLIX_API_URL=http://localhost:8080
# VITE_TMDB_API_KEY=your-tmdb-bearer-token
# VITE_APPWRITE_PROJECT_ID=your-project-id (optional)

# Start development server
npm run dev
```
Frontend will run on `http://localhost:5173`

## API Endpoints

### Public Routes
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login and receive JWT token

### Protected Routes (requires JWT)
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/{id}` - Update user profile
- `POST /api/v1/users/upload-avatar` - Upload profile picture
- `DELETE /api/v1/users/{id}` - Delete user account

## Deployment

### Backend (Railway/Heroku)
```bash
# Build JAR file
./mvnw clean package

# Set environment variables in platform dashboard
# Start command: java -jar target/SeatFlix-0.0.1-SNAPSHOT.jar
```

### Frontend (Vercel/Netlify)
```bash
# Build command
npm run build

# Output directory: dist/
# Set VITE_SEATFLIX_API_URL to production backend URL
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is open source and available under the MIT License.

## Acknowledgments
- Movie data provided by [TMDB](https://www.themoviedb.org/)
- Backend analytics by [Appwrite](https://appwrite.io/)

