# Train Schedule Server

A backend service for managing train schedules, built with NestJS and modern web technologies.

## 📂 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── decorators/          # Custom decorators for auth
│   ├── dto/                 # Data transfer objects
│   ├── guards/              # Auth guards
│   ├── auth.controller.ts   # Auth endpoints
│   ├── auth.module.ts       # Auth module definition
│   └── auth.service.ts      # Auth business logic
│
├── common/                  # Shared utilities and validators
│   └── validators/          # Custom validation decorators
│
├── config/                  # Configuration module
│   ├── config.module.ts     # Config module definition
│   ├── configuration.ts     # Configuration types
│   └── validationSchema.ts  # Environment validation
│
├── favorites/               # Favorites module
│   └── dto/                 # Favorites DTOs
│
├── places/                  # Places module
│   └── dto/                 # Places DTOs
│
├── prisma/                  # Prisma ORM
│   └── prisma.service.ts    # Database service
│
├── schedules/               # Schedules module
│   └── dto/                 # Schedule DTOs
│
├── types/                   # Global TypeScript types
│
├── users/                   # Users module
│   └── dto/                 # User DTOs
│
├── ws/                      # WebSocket module
│   └── events/              # WebSocket events
│
├── app.controller.ts        # Main app controller
├── app.module.ts            # Root module
└── main.ts                  # Application entry point
```

## 🗄️ Data Models

### User
- `id`: Unique identifier (auto-increment)
- `name`: User's full name
- `role`: User role (USER or ADMIN)
- `login`: Unique login identifier
- `password`: Hashed password
- `refreshToken`: JWT refresh token
- `createdAt`: Account creation timestamp
- `favorites`: User's favorite schedules

### Schedule
- `id`: Unique identifier (auto-increment)
- `type`: Type of train (HIGH_SPEED, EXPRESS, etc.)
- `createdAt`: Schedule creation timestamp
- `points`: List of schedule points
- `favorites`: Users who favorited this schedule

### SchedulePoint
- `id`: Unique identifier (auto-increment)
- `timeToArrive`: Scheduled arrival time
- `placeId`: Reference to Place
- `scheduleId`: Reference to Schedule
- `order`: Point order in schedule
- `place`: Related Place entity
- `schedule`: Related Schedule entity

### Place
- `id`: Unique identifier (auto-increment)
- `name`: Place name (unique)
- `createdAt`: Creation timestamp
- `schedulePoints`: Related schedule points

### FavoriteSchedule
- `id`: Unique identifier (auto-increment)
- `userId`: Reference to User
- `scheduleId`: Reference to Schedule
- `createdAt`: Favorite creation timestamp
- `user`: Related User entity
- `schedule`: Related Schedule entity

## 🚀 Features

- **RESTful API** - Clean and intuitive API endpoints
- **Authentication** - Secure JWT-based authentication
- **Real-time Updates** - WebSocket support for real-time schedule updates
- **Validation** - Request validation using class-validator
- **Type Safety** - Full TypeScript support
- **Database** - Prisma ORM for database operations
- **Environment Configuration** - Easy environment management with @nestjs/config

## 🛠️ Tech Stack

### Core Dependencies
- **@nestjs/common** - Core NestJS framework
- **@nestjs/core** - NestJS runtime system
- **@nestjs/platform-express** - Express web server integration
- **@nestjs/platform-socket.io** - WebSocket support via Socket.IO
- **rxjs** - Reactive programming library

### Authentication & Security
- **@nestjs/passport** - Authentication middleware
- **@nestjs/jwt** - JWT utilities
- **passport-jwt** - JWT strategy for Passport
- **bcrypt** - Password hashing
- **cookie-parser** - Parse HTTP request cookies

### Database
- **@prisma/client** - Type-safe database client
- **prisma** - Database ORM and migrations

### Validation & Serialization
- **class-validator** - Decorator-based validation
- **class-transformer** - Object transformation and serialization
- **joi** - Schema validation

### Development Tools
- **@nestjs/cli** - NestJS command line tools
- **typescript** - TypeScript language support
- **eslint** - Code linting
- **prettier** - Code formatting
- **jest** - Testing framework

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn package manager
- PostgreSQL database (or another database supported by Prisma)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/train-schedule-server.git
   cd train-schedule-server
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database credentials and other configuration.

4. Run database migrations
   ```bash
   npx prisma generate && npx prisma migrate dev
   ```

### Running the Application

```bash
# Development mode with hot-reload
$ npm run start:dev

# Production build
$ npm run build
$ npm run start:prod
```

The API will be available at `http://localhost:3000` by default.

## 🌐 API Documentation

After starting the server, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# App
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/train_schedule"

# JWT
JWT_SECRET=your_jwt_secret

```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
