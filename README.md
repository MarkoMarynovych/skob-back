# Plast-Proba API v2.0

The official backend for Plast-Proba, a digital Scout management system for Plast, the Ukrainian Scouting organization. This API is built with NestJS, TypeScript, and PostgreSQL, following Clean Architecture principles.

## Core Features

- **Hierarchical Role System:** ADMIN → LIAISON → FOREMAN → SCOUT
- **Group-Based Management:** Foremen create and manage groups of Scouts
- **Database-Driven Probas:** All achievement requirements (Probas) are managed in the database, allowing for dynamic updates
- **Role-Aware Invitations:** A secure, link-based invitation system that respects the role hierarchy
- **Progress Tracking & Notes:** Foremen can digitally sign off on Proba items and leave contextual notes
- **Secure Authentication:** Uses Google OAuth 2.0 with JWTs stored in secure, HTTP-only cookies

## Tech Stack

- **Framework:** NestJS 10
- **Language:** TypeScript 5
- **Database:** PostgreSQL
- **ORM:** TypeORM with a migration-first approach
- **Authentication:** Passport.js (Google OAuth 2.0), JWT
- **Async Jobs:** Redis & Bull queues for email processing
- **Package Manager:** pnpm

## Getting Started

### 1. Prerequisites

- Node.js (v18+)
- pnpm (v8+)
- Docker and Docker Compose

### 2. Environment Setup

1.  Copy the environment template:
    ```bash
    cp .env.example .env
    ```
2.  Fill in the required values in the `.env` file. You will need credentials for:
    - PostgreSQL
    - Redis
    - Google OAuth 2.0 Client
    - SendGrid API

### 3. Running the Application

1.  **Start Services:** Launch the PostgreSQL and Redis containers.
    ```bash
    docker-compose up -d
    ```

2.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

3.  **Run Database Migrations:**
    ```bash
    pnpm migration:run
    ```
    This will set up all necessary tables and seed the database with Roles and Proba templates.

4.  **Start the API:**
    ```bash
    pnpm start:dev
    ```
    The API will be running at `http://localhost:3000`.

## API Endpoints

The API is documented via Swagger/OpenAPI. Once the application is running, access the documentation at:
**`http://localhost:3000/api`**

### Key Endpoint Modules

#### Authentication
- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - OAuth callback handler
- `GET /auth/logout` - Clear authentication cookie

#### Users
- `GET /users/me` - Get current user profile
- `GET /users/:email` - Get user by email (FOREMAN+)
- `PATCH /users/:email` - Update user profile

#### Groups
- `POST /groups` - Create new group (FOREMAN+)
- `GET /groups` - Get user's groups
- `POST /groups/:groupId/members` - Add member to group (FOREMAN+)

#### Invitations
- `GET /invites/send/:email` - Send invitation to user (FOREMAN+)
- `GET /invites/:hash` - Accept invitation (public link)

#### Probas
- `GET /probas/:userId` - Get user's proba progress
- `PATCH /probas/item` - Sign individual proba item (FOREMAN+)
- `PATCH /probas/entire` - Sign entire proba section (FOREMAN+)
- `POST /probas/users/:scoutId/probas` - Manually assign proba template (FOREMAN+)

#### Proba Notes
- `POST /progress/:progressId/notes` - Create note on progress item (FOREMAN+)
- `PUT /progress/notes/:noteId` - Update note (author only)
- `DELETE /progress/notes/:noteId` - Delete note (author only)

## Architecture

This project uses a Clean Architecture approach with three primary layers:

### 1. Domain Layer
Contains core business entities and repository interfaces. This layer has no external dependencies.

- **Entities:** Pure business objects (`User`, `Group`, `ProbaTemplate`)
- **Repository Interfaces:** Contracts for data access
- **Enums:** Role hierarchy, gender variants

### 2. Application Layer
Contains business logic (Use Cases) and Data Transfer Objects (DTOs).

- **Use Cases:** Encapsulate single business operations
  - `SendInviteUseCase` - Handles role-based invitation logic
  - `AcceptInviteUseCase` - Updates user role and group membership
  - `AssignProbaUseCase` - Validates group membership before assignment
  - `CreateNoteUseCase` - Authorizes note creation based on group
- **DTOs:** Input/output data structures with validation

### 3. Infrastructure Layer
Contains controllers, database repositories, and external service clients.

- **Controllers:** RESTful API endpoints
- **Repositories:** TypeORM implementations of repository interfaces
- **Guards:** AuthGuard (JWT), RolesGuard (role-based authorization)
- **Strategies:** Google OAuth2 Passport strategy

This separation of concerns makes the application highly maintainable and testable.

## Database Schema

### Core Tables

**roles** - System roles (ADMIN, LIAISON, FOREMAN, SCOUT)

**users** - User accounts with role assignment

**groups** - Scout groups owned by Foremen

**group_memberships** - Many-to-many relationship between users and groups

**invites** - Invitation links with role assignment and expiration

### Proba System

**proba_templates** - Top-level proba definitions (level, gender variant, version)

**proba_section_templates** - Sections within probas

**proba_item_templates** - Individual requirements within sections

**user_proba_progress** - Tracks completion status for each user+item

**proba_notes** - Contextual notes from Foremen on progress items

## Development Commands

### Running the Application
```bash
pnpm install                    # Install dependencies
pnpm start:dev                  # Start development server with hot reload
pnpm start:prod                 # Start production server
pnpm build                      # Build the application
```

### Database Management
```bash
pnpm migration:generate src/database/migrations/MigrationName  # Generate migration
pnpm migration:run              # Run pending migrations
pnpm migration:revert           # Revert last migration
```

### Code Quality
```bash
pnpm run lint                   # Run ESLint with auto-fix
pnpm run format                 # Format code with Prettier
pnpm run test                   # Run unit tests
pnpm run test:watch             # Run tests in watch mode
pnpm run test:cov               # Run tests with coverage
pnpm run test:e2e               # Run end-to-end tests
```

## Security Features

### Authentication
- Google OAuth 2.0 for user authentication
- JWT tokens stored in HTTP-only cookies
- Automatic first-login proba assignment based on gender

### Authorization
- Global RolesGuard checks `@Roles()` decorator on endpoints
- Use cases validate group membership before operations
- Hierarchical role system enforces proper invitation flow

### Data Protection
- Cascade delete configured on all foreign keys
- Unique constraints prevent duplicate group memberships
- Invite links expire after 7 days

## Role Hierarchy

### ADMIN
- Highest level of access
- Can invite LIAISON users
- Full system access

### LIAISON
- Mid-level administrator
- Can invite FOREMAN users
- Manages regional operations

### FOREMAN
- Group leader role
- Can invite SCOUT users
- Creates groups and manages scouts
- Signs proba items and creates notes

### SCOUT
- Base user role
- Assigned on first login
- Can view their own progress
- Member of foreman's groups

## Proba System

### Template Structure
Probas are organized in a three-tier hierarchy:

1. **Template** - Top level (e.g., "Прихильник Пласту")
   - Level (0, 1, 2)
   - Gender variant (MALE, FEMALE, NEUTRAL)
   - Version number for updates

2. **Section** - Grouping of related items
   - Title and display order
   - Contains multiple items

3. **Item** - Individual requirement
   - Text description
   - Display order within section

### First-Login Assignment
When a new user authenticates via Google:
- System checks user's gender
- Finds Level 0 proba templates matching gender
- Automatically initializes all Level 0 items in user's progress

### Manual Assignment
Foremen can assign additional proba templates:
- Must be in same group as scout
- Select template by ID
- All items initialized as incomplete

## Email Notifications

The system uses Bull queues to handle email sending asynchronously:

- **Invitation emails** sent via SendGrid
- Queue processor handles retries on failure
- Template system for consistent email formatting

## Contributing

### Code Style
- Follow TypeScript best practices
- Use Clean Architecture patterns
- Write descriptive commit messages
- Add JSDoc comments for complex logic

### Testing
- Write unit tests for use cases
- Add integration tests for repositories
- Use e2e tests for critical user flows

## License

This project is proprietary and confidential.

## Support

For issues or questions, contact the development team at the Plast organization.
