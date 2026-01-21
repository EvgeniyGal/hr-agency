## ADDED Requirements

### Requirement: Role-Based Access Control
The system SHALL implement three user roles with distinct permission levels.

#### Scenario: Owner role permissions
- **WHEN** a user with Owner role accesses the system
- **THEN** they have full access to all features including user management, system settings, and all CRUD operations

#### Scenario: Manager role permissions
- **WHEN** a user with Manager role accesses the system
- **THEN** they can manage clients, jobs, candidates, and applications but cannot access user management or system settings

#### Scenario: Admin role permissions
- **WHEN** a user with Admin role accesses the system
- **THEN** they have read-only access to dashboards, reports, and entity lists but cannot create, update, or delete records

### Requirement: Permission Enforcement on Server Actions
The system SHALL validate user permissions before executing any mutation Server Action.

#### Scenario: Authorized mutation
- **WHEN** a Manager user attempts to create a new client
- **THEN** the Server Action validates their role and completes the operation

#### Scenario: Unauthorized mutation attempt
- **WHEN** an Admin user attempts to delete a candidate
- **THEN** the Server Action rejects the request with a 403 Forbidden error

#### Scenario: Unauthenticated mutation attempt
- **WHEN** an unauthenticated user attempts to call a Server Action
- **THEN** the system rejects the request and redirects to login

### Requirement: Row-Level Security
The system SHALL enforce data isolation at the database level using Prisma middleware.

#### Scenario: User queries own organization data
- **WHEN** a Manager queries the clients list
- **THEN** Prisma middleware automatically filters results to only include clients accessible to that user's organization

#### Scenario: Cross-organization data access prevention
- **WHEN** a user attempts to access a client from another organization
- **THEN** the database query returns no results due to RLS filtering

#### Scenario: Owner bypasses RLS for system administration
- **WHEN** an Owner role user performs administrative queries
- **THEN** RLS filters can be optionally bypassed for system-wide operations

### Requirement: Protected Route Middleware
The system SHALL protect all dashboard routes with authentication middleware.

#### Scenario: Authenticated user accesses protected route
- **WHEN** a logged-in user navigates to /dashboard
- **THEN** the middleware validates the session and allows access

#### Scenario: Unauthenticated user blocked from protected route
- **WHEN** an unauthenticated user attempts to access /dashboard/clients
- **THEN** the middleware redirects to /login with the original URL preserved

#### Scenario: Insufficient permissions for route
- **WHEN** an Admin user attempts to access /dashboard/settings (Owner-only)
- **THEN** the middleware redirects to a 403 error page or dashboard home

### Requirement: Audit Logging
The system SHALL log all significant user actions for compliance and debugging.

#### Scenario: Mutation action logged
- **WHEN** a user creates, updates, or deletes any entity
- **THEN** the system creates an Activity record with userId, action type, entity type, and timestamp

#### Scenario: Audit log viewable by Owners
- **WHEN** an Owner views the audit log
- **THEN** they can see all actions with filters by user, date range, and entity type

#### Scenario: Sensitive actions flagged
- **WHEN** a user performs a sensitive action (user role change, settings modification)
- **THEN** the audit log marks it as high-priority for review
