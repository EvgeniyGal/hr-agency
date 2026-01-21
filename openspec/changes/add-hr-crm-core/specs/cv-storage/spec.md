## ADDED Requirements

### Requirement: Upload CV
The system SHALL allow authorized users to upload candidate CVs to Google Cloud Storage.

#### Scenario: Successful CV upload
- **WHEN** a user uploads a PDF or DOCX file for a candidate
- **THEN** the system validates the file, uploads to GCS, and creates a CV metadata record

#### Scenario: File type validation
- **WHEN** a user attempts to upload a file with invalid extension (not PDF/DOCX)
- **THEN** the system rejects the upload with a validation error

#### Scenario: File size validation
- **WHEN** a user uploads a file larger than 10MB
- **THEN** the system rejects the upload and displays a size limit error

#### Scenario: Multiple CVs per candidate
- **WHEN** a user uploads a new CV for a candidate who already has CVs
- **THEN** the system adds the new CV without deleting previous versions

### Requirement: Download CV
The system SHALL provide secure access to stored CVs via signed URLs.

#### Scenario: Generate signed URL
- **WHEN** a user requests to download a CV
- **THEN** the system generates a time-limited signed URL (valid for 15 minutes)

#### Scenario: Expired URL handling
- **WHEN** a user clicks an expired signed URL
- **THEN** the system displays an error and prompts to regenerate the link

### Requirement: Delete CV
The system SHALL allow authorized users to remove CV files.

#### Scenario: Delete CV file
- **WHEN** an Owner deletes a CV
- **THEN** the system removes the file from GCS and deletes the metadata record

#### Scenario: Delete confirmation
- **WHEN** a user attempts to delete a CV
- **THEN** the system prompts for confirmation before permanent deletion

### Requirement: CV Metadata Storage
The system SHALL store CV metadata in PostgreSQL for quick access and search.

#### Scenario: Store file metadata
- **WHEN** a CV is uploaded
- **THEN** the system stores filename, GCS URL, file size, upload date, and uploader user ID

#### Scenario: Display CV metadata
- **WHEN** viewing a candidate's CVs
- **THEN** the system shows filename, upload date, file size, and uploader name

### Requirement: CV Upload UI
The system SHALL provide a user-friendly drag-and-drop upload interface.

#### Scenario: Drag-and-drop upload
- **WHEN** a user drags a file into the upload zone
- **THEN** the system highlights the zone and accepts the file on drop

#### Scenario: Click to upload
- **WHEN** a user clicks the upload zone
- **THEN** the system opens a file picker dialog

#### Scenario: Upload progress indication
- **WHEN** a file is uploading
- **THEN** the system displays a progress bar and percentage

#### Scenario: Upload error handling
- **WHEN** an upload fails due to network or server error
- **THEN** the system displays an error message with retry option

### Requirement: CV Security
The system SHALL ensure only authorized users can access candidate CVs.

#### Scenario: Permission check on download
- **WHEN** a user attempts to download a CV
- **THEN** the system verifies the user has permission to view that candidate

#### Scenario: Unauthorized access blocked
- **WHEN** an unauthorized user attempts to access a CV URL directly
- **THEN** the system returns a 403 Forbidden error

### Requirement: CV Versioning
The system SHALL support multiple versions of CVs per candidate.

#### Scenario: View CV history
- **WHEN** a candidate has multiple CV uploads
- **THEN** the system displays all versions with upload dates

#### Scenario: Mark latest CV
- **WHEN** a new CV is uploaded
- **THEN** the system automatically marks it as the latest version
