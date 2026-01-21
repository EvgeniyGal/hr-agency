## ADDED Requirements

### Requirement: Create Candidate
The system SHALL allow authorized users to add new candidates to the system.

#### Scenario: Successful candidate creation
- **WHEN** a Manager adds a candidate with first name, last name, email, and phone
- **THEN** the system creates a Candidate record with status "Lead"

#### Scenario: Required fields validation
- **WHEN** a user attempts to create a candidate without required fields
- **THEN** the system displays validation errors

#### Scenario: Duplicate email detection
- **WHEN** a user adds a candidate with an email that already exists
- **THEN** the system warns and links to the existing candidate profile

### Requirement: Update Candidate
The system SHALL allow authorized users to update candidate information.

#### Scenario: Update candidate profile
- **WHEN** a user modifies candidate details (name, email, phone, skills)
- **THEN** the system saves changes and logs the update

#### Scenario: Add candidate notes
- **WHEN** a user adds notes to a candidate profile
- **THEN** the notes are stored with timestamp and author information

### Requirement: Delete Candidate
The system SHALL allow authorized users to soft-delete candidate records.

#### Scenario: Soft delete candidate
- **WHEN** an Owner deletes a candidate
- **THEN** the system sets deletedAt and removes from default views

#### Scenario: Candidate with applications protection
- **WHEN** deleting a candidate with active job applications
- **THEN** the system warns about orphaned applications

### Requirement: Candidate Status Tracking
The system SHALL track candidates through recruitment lifecycle stages.

#### Scenario: Status progression
- **WHEN** a candidate moves through the pipeline
- **THEN** valid statuses include: Lead, Contacted, Interviewing, Offered, Placed, Rejected

#### Scenario: Status change logging
- **WHEN** a candidate's status changes
- **THEN** the system logs the change with timestamp and user

### Requirement: View Candidate List
The system SHALL display all accessible candidates in list or Kanban view.

#### Scenario: List view with pagination
- **WHEN** a user views the candidates list
- **THEN** the system displays 20 candidates per page with pagination

#### Scenario: Search candidates
- **WHEN** a user searches by name, email, or skills
- **THEN** the system returns matching candidates

#### Scenario: Filter by status
- **WHEN** a user filters candidates by status (e.g., "Interviewing")
- **THEN** the system shows only candidates with that status

#### Scenario: Sort candidates
- **WHEN** a user sorts the candidate list
- **THEN** sorting options include name, created date, updated date, and status

### Requirement: View Candidate Details
The system SHALL display comprehensive candidate information including applications and CVs.

#### Scenario: Candidate detail page
- **WHEN** a user clicks on a candidate
- **THEN** the system shows profile, contact info, status, applications, and uploaded CVs

#### Scenario: View application history
- **WHEN** viewing a candidate detail page
- **THEN** all job applications with status and notes are displayed

#### Scenario: Download CV from candidate page
- **WHEN** a user clicks on a CV link
- **THEN** the system generates a signed URL and initiates download

### Requirement: Link Candidate to Job
The system SHALL allow users to link candidates to job openings.

#### Scenario: Create application
- **WHEN** a user links a candidate to a job
- **THEN** the system creates an Application record with status "Applied"

#### Scenario: Prevent duplicate application
- **WHEN** a user attempts to link a candidate to a job they're already applied to
- **THEN** the system displays an error and prevents duplication

### Requirement: Candidate Skills and Tags
The system SHALL support skills and tags for candidate categorization.

#### Scenario: Add skills to candidate
- **WHEN** a user adds skills to a candidate profile
- **THEN** the skills are stored as an array or JSONB field

#### Scenario: Search by skills
- **WHEN** a user searches candidates by skill (e.g., "JavaScript")
- **THEN** the system returns candidates with that skill
