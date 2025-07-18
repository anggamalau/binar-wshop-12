# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 educational workshop application designed for sessions 11-12 focusing on refactoring and query optimization. The codebase intentionally contains performance anti-patterns for learning purposes.

## Essential Commands

### Development
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run all tests
npm test -- [file]   # Run specific test file
```

### Database Management
```bash
npm run db-create    # Create database, tables, and seed 1000 users
npm run db-drop      # Drop the database
npm run db-reset     # Drop and recreate with fresh data
npm run db-test      # Test database connection
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Database**: PostgreSQL 12+ (raw SQL via `pg` library)
- **Authentication**: JWT tokens with bcrypt hashing
- **UI**: Tailwind CSS v4 + Primer CSS

### Key Architectural Patterns

1. **API Routes**: All backend logic lives in `src/app/api/` using Next.js Route Handlers
2. **Database Layer**: Raw SQL queries in `src/lib/database.ts` and `src/lib/bad-queries.ts`
3. **Authentication**: JWT-based auth with tokens stored in localStorage (handled by `useAuth` hook)
4. **State Management**: Client-side state with React hooks, no external state management

### Database Schema

The application uses 5 normalized tables:
- `auth`: User credentials (id, email, password_hash)
- `users`: User profiles with extensive fields including JSON data
- `user_roles`: Role assignments
- `user_logs`: Activity tracking
- `user_divisions`: Department assignments

### Performance Anti-Patterns (Intentional)

This codebase contains deliberate performance issues for workshop exercises:

1. **Database**: No indexes, excessive JOINs, subqueries in SELECT, no pagination
2. **Frontend**: No debouncing, inefficient filtering, missing memoization
3. **API**: Fetches all data without limits, complex transformations in application layer

### Testing Approach

Tests use Jest with React Testing Library. Run individual tests with:
```bash
npm test -- __tests__/api/login.test.ts
npm test -- __tests__/components/Navbar.test.tsx
```

### Environment Setup

Create `.env.local` with:
```
DB_USER=your_user
DB_HOST=localhost
DB_NAME=workshop_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secret_key
```

### Default Credentials

All seeded users have password: `User123@`

## Critical Files to Understand

1. **src/lib/bad-queries.ts**: Contains intentionally poor SQL queries that need optimization
2. **src/app/api/users/route.ts**: Main users endpoint with performance issues
3. **src/app/users/page.tsx**: Frontend with inefficient filtering and rendering
4. **src/lib/database.ts**: Database connection and query execution