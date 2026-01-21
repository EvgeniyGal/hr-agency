## ADDED Requirements

### Requirement: Create Client
The system SHALL allow authorized users to create new client records.

#### Scenario: Successful client creation
- **WHEN** a Manager provides valid client details (name, industry, contact info)
- **THEN** the system creates a new Client record and returns to the clients list

#### Scenario: Required field validation
- **WHEN** a user attempts to create a client without a required field (e.g., company name)
- **THEN** the system displays validation errors and prevents submission

#### Scenario: Duplicate client name warning
- **WHEN** a user creates a client with a name very similar to an existing client
- **THEN** the system shows a warning but allows creation if confirmed

### Requirement: Update Client
The system SHALL allow authorized users to update existing client records.

#### Scenario: Successful client update
- **WHEN** a Manager modifies client details and saves
- **THEN** the system updates the Client record and displays a success notification

#### Scenario: Concurrent update conflict
- **WHEN** two users attempt to update the same client simultaneously
- **THEN** the system uses optimistic locking to prevent data loss and notifies the second user

### Requirement: Delete Client
The system SHALL allow authorized users to soft-delete client records.

#### Scenario: Soft delete with confirmation
- **WHEN** an Owner deletes a client
- **THEN** the system prompts for confirmation, sets deletedAt timestamp, and hides from default views

#### Scenario: Client with active jobs protection
- **WHEN** a user attempts to delete a client with active jobs
- **THEN** the system warns about related jobs and requires explicit confirmation

### Requirement: View Client List
The system SHALL display all accessible clients in a paginated list view.

#### Scenario: List with pagination
- **WHEN** a user views the clients list
- **THEN** the system displays 20 clients per page with pagination controls

#### Scenario: Search by name
- **WHEN** a user searches for a client by name
- **THEN** the system filters the list to matching clients

#### Scenario: Filter by industry
- **WHEN** a user applies an industry filter
- **THEN** the system shows only clients in that industry

#### Scenario: Sort by column
- **WHEN** a user clicks a column header (name, created date)
- **THEN** the system sorts the list by that column in ascending/descending order

### Requirement: View Client Details
The system SHALL display comprehensive client information including related jobs.

#### Scenario: Client detail page
- **WHEN** a user clicks on a client in the list
- **THEN** the system displays full client details, contact info, and a list of related jobs

#### Scenario: Related jobs navigation
- **WHEN** a user views a client detail page
- **THEN** they can click on any related job to navigate to the job detail page

### Requirement: Client Metadata
The system SHALL support custom metadata fields for clients using JSONB storage.

#### Scenario: Store custom field
- **WHEN** a user adds a custom field (e.g., "Contract Expiry Date") to a client
- **THEN** the system stores it in the metadata JSONB column

#### Scenario: Display custom fields
- **WHEN** viewing client details with custom metadata
- **THEN** the system renders all custom fields in a dedicated section
