# Change: Add HR Agency CRM Core System

## Why
Build a comprehensive CRM system for the HR Agency to manage the entire recruitment lifecycle—from tracking clients and job positions to managing candidates and their CVs. Currently, there is no system in place, making it impossible to organize leads, monitor recruitment pipelines, or provide role-based access to different team members.

## What Changes
This change introduces the foundational CRM system with the following capabilities:

- **Authentication & Authorization**: Secure user login with NextAuth.js, role-based access control (Admin, Manager, Owner), and row-level security in PostgreSQL
- **Client Management**: CRUD operations for clients, relationship tracking, and client-specific data views
- **Job/Position Management**: Create, update, and track job openings with detailed requirements and status tracking
- **Candidate Management**: Manage candidate profiles, track application status, and link to CVs
- **CV Storage & Management**: Upload, store, and retrieve candidate CVs using Google Cloud Storage
- **Dashboard Views**: Role-specific dashboards showing key metrics, recent activity, and actionable insights
- **Kanban & List Views**: Visual pipeline management for leads, candidates, and jobs with drag-and-drop functionality
- **User Profile & Settings**: User account management, preferences, and system configuration

## Impact

### Affected Specs (NEW)
- `specs/authentication/spec.md` - User authentication and session management
- `specs/authorization/spec.md` - Role-based permissions and row-level security
- `specs/client-management/spec.md` - Client CRUD and relationship tracking
- `specs/job-management/spec.md` - Job position lifecycle management
- `specs/candidate-management/spec.md` - Candidate tracking and pipeline management
- `specs/cv-storage/spec.md` - File upload and storage using GCS
- `specs/dashboard-views/spec.md` - Analytics and overview dashboards
- `specs/kanban-list-views/spec.md` - Visual pipeline and list management
- `specs/user-profile/spec.md` - User account and settings

### Affected Code
- `prisma/schema.prisma` - Database schema for all entities
- `app/auth/` - NextAuth configuration and providers
- `app/(dashboard)/` - Main application layouts and pages
- `app/api/` - API routes for external integrations
- `lib/actions/` - Server Actions for data mutations
- `components/` - Reusable UI components (Kanban, forms, tables)

### Breaking Changes
None - this is a new system build.

## Dependencies
- Next.js 14+ with App Router
- NextAuth.js for authentication
- Prisma with PostgreSQL
- Google Cloud Storage SDK
- shadcn/ui components
- React Hook Form + Zod
- Sonner for notifications
