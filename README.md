# Phase 2 Full-Stack Todo Web Application

This is a full-stack todo web application built with Next.js frontend and FastAPI backend, following the Phase 2 constitution for architecture and security requirements.

## Features

- User authentication and registration
- Task CRUD operations (Create, Read, Update, Delete)
- User-specific task isolation
- Responsive web interface
- JWT-based authentication
- PostgreSQL database with SQLModel ORM

## Tech Stack

- **Frontend**: Next.js 16+ with App Router
- **Backend**: FastAPI with Python 3.11+
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT
- **ORM**: SQLModel
- **Frontend Styling**: Tailwind CSS

## Architecture

The application follows a monorepo structure with clear separation between frontend and backend components:

```
project-root/
├── backend/
│   ├── src/
│   │   ├── models/      # Data models
│   │   ├── services/    # Business logic
│   │   ├── api/         # API endpoints
│   │   ├── database/    # Database configuration
│   │   ├── middleware/  # Middleware functions
│   │   ├── config/      # Configuration settings
│   │   └── utils/       # Utility functions
│   ├── main.py          # Main application entry point
│   └── requirements.txt # Dependencies
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js app directory
│   │   ├── components/  # React components
│   │   ├── lib/         # Library functions
│   │   └── context/     # React context providers
│   └── package.json     # Frontend dependencies
└── shared/              # Shared types and utilities
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL client tools
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Start the backend server:
```bash
python -m uvicorn main:app --reload
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

### Backend (.env)

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Secret key for JWT signing
- `ALGORITHM`: Algorithm for JWT (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time
- `BETTER_AUTH_SECRET`: Better Auth secret key
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Better Auth URL

### Frontend (.env.local)

- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Better Auth URL

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Tasks

- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

## Security Features

- JWT-based authentication
- User data isolation (users can only access their own data)
- Password hashing with bcrypt
- Input validation
- SQL injection prevention
- Rate limiting (to be implemented)

## Development

### Running Tests

Backend tests:
```bash
cd backend
pytest
```

Frontend tests:
```bash
cd frontend
npm test
```

### Code Formatting

Backend (using black):
```bash
black src/
```

Frontend (using Next.js formatter):
```bash
npm run format
```

## Deployment

The application can be deployed separately:

1. **Backend**: Deploy to any Python hosting service (Heroku, AWS, etc.)
2. **Frontend**: Deploy to Vercel, Netlify, or similar static hosting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js for the frontend framework
- FastAPI for the backend framework
- SQLModel for the ORM
- Tailwind CSS for styling