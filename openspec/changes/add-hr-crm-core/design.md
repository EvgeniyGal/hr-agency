# Design: HR Agency CRM Core System

## Context
Building a greenfield CRM for an HR recruitment agency. The system needs to handle multi-tenant-like scenarios (different companies as clients), role-based permissions, file storage, and visual pipeline management. The team prefers a modern Next.js 14 stack with Server Components and Prisma.

**Stakeholders**: HR agency owners, managers, and admin staff who will manage clients, candidates, and recruitment pipelines.

**Constraints**:
- Must use Next.js 14 App Router with Server Components
- PostgreSQL as the primary database
- Google Cloud Storage for file uploads
- Row-level security for data isolation between roles

## Goals / Non-Goals

### Goals
- Provide secure, role-based access to all CRM features
- Enable efficient candidate and job pipeline management
- Support multiple views (dashboard, list, Kanban) for different workflows
- Ensure data privacy with row-level security
- Store CVs securely in Google Cloud Storage

### Non-Goals
- Multi-tenancy across different agencies (single agency deployment only)
- Advanced AI-powered candidate matching (can be added later)
- Integrations with third-party job boards (future phase)
- Real-time collaboration features (not in MVP)

## Decisions

### 1. Authentication Strategy
**Decision**: Use NextAuth.js with Credentials provider (email/password) and optional OAuth (Google, GitHub).

**Reasoning**:
- NextAuth.js is the de facto standard for Next.js authentication
- Supports both credentials and social login out of the box
- Integrates seamlessly with Server Actions and middleware
- Provides secure session management with JWT or database sessions

**Alternatives Considered**:
- Clerk: More features but adds vendor lock-in and costs
- Custom JWT solution: More work, higher security risk
- Auth0: Overkill for this use case, adds complexity

### 2. Authorization Model
**Decision**: Implement role-based access control (RBAC) with three roles (Owner, Manager, Admin) + PostgreSQL row-level security (RLS).

**Roles**:
- **Owner**: Full access to all features, can manage users and settings
- **Manager**: Can manage clients, jobs, and candidates but cannot change system settings
- **Admin**: Read-only access to reports and dashboards

**RLS Implementation**:
- Use Prisma middleware to inject `userId` or `organizationId` filters on queries
- Apply RLS policies at the database level for defense-in-depth
- Server Actions will enforce permission checks before mutations

**Reasoning**:
- RBAC is simple, well-understood, and sufficient for the initial scope
- RLS at the database level prevents accidental data leaks
- Can be extended to attribute-based access control (ABAC) later if needed

**Alternatives Considered**:
- ABAC: Too complex for initial requirements
- Database-only RLS without app-level checks: Harder to debug, less clear errors
- JWT-based permissions: Would require complex token refresh logic

### 3. Data Model Architecture
**Decision**: Use a normalized relational schema with Prisma ORM.

**Core Entities**:
- **User**: Authentication and profile information
- **Client**: Companies hiring through the agency
- **Job**: Positions to be filled (belongs to Client)
- **Candidate**: Individuals being recruited
- **Application**: Many-to-many relationship between Candidate and Job
- **CV**: File metadata linking to Google Cloud Storage
- **Activity**: Audit log for tracking changes

**Key Relationships**:
- Client 1:N Job
- Candidate N:M Job (through Application)
- Candidate 1:N CV
- User 1:N Activity (for audit trail)

**Reasoning**:
- Normalized design prevents data duplication
- Prisma provides type-safe queries and migrations
- Application entity enables tracking status and notes per candidate-job pair

### 4. File Storage Strategy
**Decision**: Store CVs in Google Cloud Storage with metadata in PostgreSQL.

**Flow**:
1. Client uploads file via Next.js Route Handler or Server Action
2. File is validated (type, size) and uploaded to GCS
3. Metadata (filename, URL, size, upload date) stored in PostgreSQL `CV` table
4. Signed URLs generated for temporary access when viewing/downloading

**Reasoning**:
- GCS is cost-effective, scalable, and integrates well with Google Cloud ecosystem
- Separating metadata from blob storage keeps database lean
- Signed URLs provide secure, time-limited access

**Alternatives Considered**:
- Store files in PostgreSQL (bytea): Poor performance, bloats database
- Vercel Blob: Vendor lock-in, potentially more expensive at scale
- AWS S3: Equally good but user prefers Google Cloud

### 5. View Architecture (Dashboard, List, Kanban)
**Decision**: Implement three view types using modular Server Components with Client Components for interactivity.

**Dashboard**:
- Server Component fetching aggregated data (counts, recent activity)
- Charts rendered client-side using lightweight library (e.g., Recharts)

**List View**:
- Server Component with server-side pagination and filtering
- Uses shadcn/ui `Table` component with sorting and search

**Kanban View**:
- Server Component for initial data load
- Client Component for drag-and-drop (using `@dnd-kit/core`)
- Optimistic updates with Server Action mutations

**Reasoning**:
- Server Components reduce client bundle size and improve performance
- Selective client components only where interactivity is needed
- Modular design allows reusing views for different entities (candidates, jobs, leads)

**Alternatives Considered**:
- Full client-side SPA: Slower initial load, more complex state management
- Pure server-side with no interactivity: Poor UX for drag-and-drop

### 6. Database Schema Conventions
**Decision**: Use consistent naming and include soft deletes + timestamps.

**Conventions**:
- PascalCase for model names (e.g., `User`, `JobApplication`)
- camelCase for field names (e.g., `createdAt`, `firstName`)
- Every table includes: `id` (CUID), `createdAt`, `updatedAt`, `deletedAt` (nullable)
- Foreign keys follow pattern: `<entity>Id` (e.g., `clientId`, `userId`)

**Reasoning**:
- Soft deletes preserve audit trail and enable recovery
- Timestamps essential for tracking and debugging
- Consistent naming reduces cognitive load

## Risks / Trade-offs

### Risk 1: Row-Level Security Performance
- **Mitigation**: Index foreign keys properly, use Prisma query optimization, monitor slow queries
- **Trade-off**: Slight query overhead vs. strong data isolation

### Risk 2: File Upload Limits
- **Mitigation**: Implement file size validation (max 10MB per CV), use streaming uploads for large files
- **Trade-off**: Some very large CVs may need to be compressed

### Risk 3: Complexity of Kanban Drag-and-Drop
- **Mitigation**: Use battle-tested `@dnd-kit` library, implement optimistic updates with rollback on failure
- **Trade-off**: Client-side bundle increases, but UX significantly improves

### Risk 4: Initial Data Volume Unknown
- **Mitigation**: Design schema with scalability in mind (indexes, partitioning-ready), plan for pagination everywhere
- **Trade-off**: Slightly more complex queries upfront

## Migration Plan

**Phase 1: Foundation (Weeks 1-2)**
- Set up Next.js project with authentication
- Define Prisma schema and run initial migration
- Implement basic RBAC and user management

**Phase 2: Core Entities (Weeks 3-4)**
- Build Client, Job, Candidate CRUD operations
- Implement CV upload to Google Cloud Storage
- Add Server Actions for all mutations

**Phase 3: Views & UX (Weeks 5-6)**
- Create Dashboard with key metrics
- Implement List Views with filtering/sorting
- Build Kanban pipeline for candidates and jobs

**Phase 4: Polish & Testing (Week 7)**
- E2E tests with Playwright for critical paths
- Unit tests for Server Actions and business logic
- Performance optimization and accessibility review

**Rollback Strategy**:
- Git-based rollback for code changes
- Prisma migrations can be reverted using `prisma migrate resolve --rolled-back`
- GCS bucket versioning enabled for file recovery

## Open Questions

1. **Email Notifications**: Should we send email notifications when candidates are moved through the pipeline?
   - **Suggestion**: Defer to post-MVP, add as separate change
2. **Export Functionality**: Do users need to export candidate lists to CSV/Excel?
   - **Suggestion**: Add in Phase 2 if time permits, otherwise post-MVP
3. **Search**: Should we implement full-text search for candidates/jobs?
   - **Suggestion**: Start with basic SQL LIKE queries, consider PostgreSQL full-text search if needed
4. **Custom Fields**: Will users need to add custom fields to Client/Job/Candidate entities?
   - **Suggestion**: Use JSONB columns for flexibility, expose UI in settings later
