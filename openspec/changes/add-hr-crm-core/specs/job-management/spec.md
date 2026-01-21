## ADDED Requirements

### Requirement: Create Job
The system SHALL allow authorized users to create new job postings.

#### Scenario: Successful job creation
- **WHEN** a Manager creates a job with title, description, requirements, and linked client
- **THEN** the system creates a Job record with status "Draft"

#### Scenario: Required fields validation
- **WHEN** a user attempts to create a job without title or client
- **THEN** the system displays validation errors

#### Scenario: Rich text description
- **WHEN** a user enters a job description
- **THEN** the system supports basic rich text formatting (bold, italic, lists, links)

### Requirement: Update Job
The system SHALL allow authorized users to update existing job postings.

#### Scenario: Update job details
- **WHEN** a Manager modifies job title, description, or requirements
- **THEN** the system saves changes and updates the updatedAt timestamp

#### Scenario: Change job status
- **WHEN** a user changes job status from "Open" to "Closed"
- **THEN** the system updates status and logs the change in Activity

### Requirement: Delete Job
The system SHALL allow authorized users to soft-delete job postings.

#### Scenario: Soft delete job
- **WHEN** an Owner deletes a job
- **THEN** the system sets deletedAt and hides from default views

#### Scenario: Job with active candidates protection
- **WHEN** a user attempts to delete a job with active candidates
- **THEN** the system warns and requires confirmation

### Requirement: Job Status Workflow
The system SHALL manage job lifecycle through defined statuses.

#### Scenario: Job status transitions
- **WHEN** a job progresses through its lifecycle
- **THEN** valid transitions are: Draft → Open → Closed or Draft → Open → Filled

#### Scenario: Invalid status transition
- **WHEN** a user attempts an invalid transition (e.g., Closed → Draft)
- **THEN** the system rejects the change with an error message

### Requirement: View Job List
The system SHALL display all accessible jobs in a list or Kanban view.

#### Scenario: List view with filters
- **WHEN** a user views the jobs list
- **THEN** they can filter by status, client, and date range

#### Scenario: Search jobs
- **WHEN** a user searches for a job by title or keywords
- **THEN** the system returns matching jobs

#### Scenario: Sort jobs
- **WHEN** a user sorts the jobs list
- **THEN** sorting options include created date, updated date, title, and status

### Requirement: View Job Details
The system SHALL display comprehensive job information including linked candidates.

#### Scenario: Job detail page
- **WHEN** a user clicks on a job
- **THEN** the system shows full job details, linked client, and list of candidates/applications

#### Scenario: Application status summary
- **WHEN** viewing a job detail page
- **THEN** the system displays a count of applications by status (Applied, Screening, Interview, etc.)

#### Scenario: Navigate to client
- **WHEN** a user clicks the linked client on a job detail page
- **THEN** the system navigates to that client's detail page

### Requirement: Job Requirements
The system SHALL support structured or unstructured job requirements.

#### Scenario: Add job requirements
- **WHEN** a user creates or edits a job
- **THEN** they can add requirements as a structured list or free text

#### Scenario: Display requirements clearly
- **WHEN** viewing a job detail page
- **THEN** requirements are displayed prominently for candidate matching
