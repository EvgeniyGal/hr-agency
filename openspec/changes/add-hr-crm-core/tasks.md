# Implementation Tasks: HR Agency CRM Core

## 1. Project Setup & Infrastructure
- [ ] 1.1 Initialize Next.js 14 project with TypeScript and App Router
- [ ] 1.2 Install and configure Tailwind CSS
- [ ] 1.3 Set up shadcn/ui components
- [ ] 1.4 Configure environment variables (.env.local template)
- [ ] 1.5 Set up ESLint and Prettier with project conventions
- [ ] 1.6 Initialize Prisma with PostgreSQL connection
- [ ] 1.7 Configure Google Cloud Storage SDK and credentials

## 2. Database Schema & Migrations
- [ ] 2.1 Define User model (id, email, password, role, profile fields)
- [ ] 2.2 Define Client model (id, name, industry, contact info, metadata)
- [ ] 2.3 Define Job model (id, title, description, status, clientId, requirements)
- [ ] 2.4 Define Candidate model (id, firstName, lastName, email, phone, status, metadata)
- [ ] 2.5 Define Application model (candidateId, jobId, status, notes, appliedAt)
- [ ] 2.6 Define CV model (id, candidateId, fileName, gcsUrl, uploadedAt)
- [ ] 2.7 Define Activity model (id, userId, entityType, entityId, action, timestamp)
- [ ] 2.8 Add indexes for foreign keys and frequently queried fields
- [ ] 2.9 Run initial Prisma migration
- [ ] 2.10 Seed database with test data (users, clients, jobs, candidates)

## 3. Authentication & Authorization
- [ ] 3.1 Install and configure NextAuth.js
- [ ] 3.2 Create Credentials provider for email/password login
- [ ] 3.3 Add OAuth providers (Google, GitHub)
- [ ] 3.4 Implement password hashing with bcrypt
- [ ] 3.5 Create login page with form validation (Zod + React Hook Form)
- [ ] 3.6 Create signup/registration page
- [ ] 3.7 Implement email confirmation flow (optional for MVP)
- [ ] 3.8 Create password reset flow
- [ ] 3.9 Add middleware for protected routes
- [ ] 3.10 Implement RBAC helpers (canAccess, requireRole)
- [ ] 3.11 Add Prisma middleware for row-level security filters
- [ ] 3.12 Write unit tests for authentication logic

## 4. Client Management
- [ ] 4.1 Create Server Action for creating clients
- [ ] 4.2 Create Server Action for updating clients
- [ ] 4.3 Create Server Action for deleting clients (soft delete)
- [ ] 4.4 Create clients list page with pagination
- [ ] 4.5 Create client detail page showing related jobs
- [ ] 4.6 Create client form component (create/edit)
- [ ] 4.7 Add client search and filtering
- [ ] 4.8 Implement permission checks (only Owner/Manager can create/edit)
- [ ] 4.9 Write tests for Client Server Actions

## 5. Job/Position Management
- [ ] 5.1 Create Server Action for creating jobs
- [ ] 5.2 Create Server Action for updating jobs
- [ ] 5.3 Create Server Action for deleting jobs (soft delete)
- [ ] 5.4 Create jobs list page with filtering by status and client
- [ ] 5.5 Create job detail page showing candidates/applications
- [ ] 5.6 Create job form component with rich text editor for description
- [ ] 5.7 Add job search functionality
- [ ] 5.8 Implement job status workflow (Draft, Open, Closed, Filled)
- [ ] 5.9 Write tests for Job Server Actions

## 6. Candidate Management
- [ ] 6.1 Create Server Action for creating candidates
- [ ] 6.2 Create Server Action for updating candidates
- [ ] 6.3 Create Server Action for deleting candidates (soft delete)
- [ ] 6.4 Create candidates list page with filtering and sorting
- [ ] 6.5 Create candidate detail page showing applications and CVs
- [ ] 6.6 Create candidate form component
- [ ] 6.7 Add candidate search (name, email, skills)
- [ ] 6.8 Implement candidate status tracking (Lead, Contacted, Interviewing, Placed, Rejected)
- [ ] 6.9 Write tests for Candidate Server Actions

## 7. Application/Pipeline Management
- [ ] 7.1 Create Server Action to link candidate to job (create Application)
- [ ] 7.2 Create Server Action to update application status
- [ ] 7.3 Create Server Action to add notes to application
- [ ] 7.4 Display applications on candidate detail page
- [ ] 7.5 Display applications on job detail page
- [ ] 7.6 Implement application status workflow (Applied, Screening, Interview, Offer, Hired, Rejected)

## 8. CV Storage & Management
- [ ] 8.1 Create Server Action for CV upload
- [ ] 8.2 Implement file validation (type: PDF/DOCX, max size: 10MB)
- [ ] 8.3 Upload file to Google Cloud Storage
- [ ] 8.4 Store CV metadata in PostgreSQL (CV model)
- [ ] 8.5 Generate signed URL for secure file access
- [ ] 8.6 Create CV upload component with drag-and-drop
- [ ] 8.7 Show CV list on candidate detail page
- [ ] 8.8 Implement CV download functionality
- [ ] 8.9 Add CV delete functionality (remove from GCS and DB)
- [ ] 8.10 Write tests for CV upload and retrieval

## 9. Dashboard Views
- [ ] 9.1 Create main dashboard layout with role-based content
- [ ] 9.2 Add metrics cards (total clients, active jobs, candidates, placements)
- [ ] 9.3 Create recent activity feed (using Activity model)
- [ ] 9.4 Add charts (jobs by status, candidates by status, placements over time)
- [ ] 9.5 Implement dashboard filters (date range, client, job)
- [ ] 9.6 Optimize dashboard queries for performance

## 10. Kanban & List Views
- [ ] 10.1 Create reusable List component with shadcn/ui Table
- [ ] 10.2 Add sorting, filtering, and pagination to List component
- [ ] 10.3 Install @dnd-kit/core for drag-and-drop
- [ ] 10.4 Create Kanban board component with columns for statuses
- [ ] 10.5 Implement drag-and-drop for candidates across status columns
- [ ] 10.6 Implement drag-and-drop for jobs across status columns
- [ ] 10.7 Create Server Action to update entity status on drop
- [ ] 10.8 Add optimistic UI updates with error rollback
- [ ] 10.9 Create view toggle (List/Kanban) for candidates and jobs pages
- [ ] 10.10 Write tests for Kanban drag-and-drop logic

## 11. User Profile & Settings
- [ ] 11.1 Create user profile page showing account details
- [ ] 11.2 Create profile edit form (name, email, avatar)
- [ ] 11.3 Implement avatar upload to Google Cloud Storage
- [ ] 11.4 Create password change form
- [ ] 11.5 Add user preferences (theme, notifications, defaults)
- [ ] 11.6 Create settings page for Owners (manage users, roles, system config)
- [ ] 11.7 Implement user invitation flow
- [ ] 11.8 Write tests for profile and settings Server Actions

## 12. UI/UX Polish
- [ ] 12.1 Implement toast notifications with Sonner
- [ ] 12.2 Add loading states for all async operations
- [ ] 12.3 Create error boundaries for graceful error handling
- [ ] 12.4 Implement form validation errors display
- [ ] 12.5 Add empty states for lists and dashboards
- [ ] 12.6 Ensure accessibility (ARIA labels, keyboard navigation)
- [ ] 12.7 Test responsive design on mobile, tablet, desktop

## 13. Testing & Validation
- [ ] 13.1 Write unit tests for all Server Actions (Vitest)
- [ ] 13.2 Write component tests for forms and key UI elements (React Testing Library)
- [ ] 13.3 Write E2E tests for critical paths (Playwright):
  - [ ] 13.3.1 User login and authentication
  - [ ] 13.3.2 Create client and job
  - [ ] 13.3.3 Add candidate and link to job
  - [ ] 13.3.4 Upload CV
  - [ ] 13.3.5 Move candidate through Kanban pipeline
- [ ] 13.4 Test row-level security and permission enforcement
- [ ] 13.5 Validate all Zod schemas cover expected cases
- [ ] 13.6 Run accessibility audit with axe DevTools

## 14. Documentation & Deployment Prep
- [ ] 14.1 Document environment variable setup in README
- [ ] 14.2 Create database migration guide
- [ ] 14.3 Document Google Cloud Storage setup
- [ ] 14.4 Write user guide for each role (Owner, Manager, Admin)
- [ ] 14.5 Prepare deployment configuration (Vercel or self-hosted)
- [ ] 14.6 Set up CI/CD pipeline with tests
- [ ] 14.7 Configure production environment variables
