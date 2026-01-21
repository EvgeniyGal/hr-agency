# Project Context

## Purpose
This application is for an HR Agency, designed to manage clients, candidates, and job positions efficiently. It serves as a central hub for tracking candidate CVs, job openings, and the relationships between candidates and clients.

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Components**: React Server Components (default), Server Actions for data mutations
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: lucide-react
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Server Components (primary), React Context (light client state), TanStack Query (client-heavy flows)
- **Notifications**: Sonner

### Backend & API
- **Auth**: NextAuth.js (Credentials, OAuth (Google/GitHub), JWT/DB sessions)
  - Features: Email/Password, Email confirmation, Password reset, Magic Link (optional)
- **API**: Next.js Server Actions and Route Handlers (/app/api)
- **Database**: PostgreSQL 15+ (Managed via Railway/Neon/Supabase/RDS)
- **ORM**: Prisma (Type-safe queries, Schema-first, Relation management)
- **Migrations**: Prisma Migrate (Versioned, safe evolution, enforced in CI/CD)

### Infrastructure & Storage
- **File Storage**: Google Cloud Storage (for CVs and other documents)

## Project Conventions

### Code Style
- **TypeScript**: Strict mode is enforced. Use explicit types where inference isn't clear.
- **Naming**:
  - Components: PascalCase (e.g., `CandidateList.tsx`)
  - Functions/Variables: camelCase
  - Constants: UPPER_SNAKE_CASE
- **Components**: Prefer Server Components by default. Use `'use client'` only when interactivity or client-side hooks are required.

### Architecture Patterns
- **Data Fetching**: Fetch data directly in Server Components where possible.
- **Mutations**: Use Server Actions for data modifications.
- **Validation**: Shared Zod schemas for both client and server validation.

### Testing Strategy
- **Unit Testing**: **Vitest** for pure functions and business logic.
- **Component Testing**: **React Testing Library** for UI behavior and accessibility.
- **E2E Testing**: **Playwright** for critical path user journeys (Authentication, Candidate Onboarding, Job Posting).
- **API/Action Testing**: Test Server Actions and Route Handlers in isolation using Vitest, mocking Prisma where necessary or using a temporary test database.
- **Visual Regression**: (Optional) UI testing via Playwright snapshots for critical dashboard views.
- **CI Enforcement**: All tests must pass in CI before merging. 100% coverage on core business rules (Zod schemas, candidate processing logic).

### Git Workflow
- **Branching**: Feature branches (e.g., `feat/add-job-posting`)
- **Commits**: Conventional Commits (e.g., `feat: add job model`, `fix: auth redirect`)

## Domain Context
- **Candidates**: Individuals looking for employment or being managed by the agency.
- **Clients**: Partner companies hiring through the agency.
- **Jobs**: Positions being filled.
- **CVs**: Stored in Google Cloud Storage, linked to **Candidate** profiles.

## Important Constraints
- Secure data handling for candidate privacy.
- Proper authorization checks on all Server Actions.

## External Dependencies
- Google Cloud Storage
- PostgreSQL
- NextAuth Providers (Google, GitHub, etc.)
