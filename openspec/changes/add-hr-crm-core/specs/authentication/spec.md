## ADDED Requirements

### Requirement: User Registration
The system SHALL allow new users to register with email and password.

#### Scenario: Successful registration
- **WHEN** a user provides a valid email and strong password
- **THEN** the system creates a new user account and sends a confirmation email

#### Scenario: Duplicate email rejection
- **WHEN** a user attempts to register with an email that already exists
- **THEN** the system rejects the registration and displays an error message

#### Scenario: Weak password rejection
- **WHEN** a user provides a password that doesn't meet strength requirements (min 8 chars, 1 uppercase, 1 number)
- **THEN** the system rejects the registration with a clear validation error

### Requirement: User Login
The system SHALL authenticate users via email and password or OAuth providers.

#### Scenario: Successful email/password login
- **WHEN** a user provides valid credentials
- **THEN** the system creates a session and redirects to the dashboard

#### Scenario: Failed login attempt
- **WHEN** a user provides invalid credentials
- **THEN** the system displays a generic error message without revealing which field was incorrect

#### Scenario: OAuth login with Google
- **WHEN** a user chooses to login with Google and authorizes the application
- **THEN** the system creates or updates the user account and establishes a session

#### Scenario: OAuth login with GitHub
- **WHEN** a user chooses to login with GitHub and authorizes the application
- **THEN** the system creates or updates the user account and establishes a session

### Requirement: Session Management
The system SHALL maintain secure user sessions using NextAuth.js.

#### Scenario: Valid session access
- **WHEN** an authenticated user accesses a protected route
- **THEN** the system allows access and provides user context

#### Scenario: Expired session handling
- **WHEN** a user's session expires
- **THEN** the system redirects to login and preserves the intended destination

#### Scenario: Session logout
- **WHEN** a user explicitly logs out
- **THEN** the system terminates the session and clears all session cookies

### Requirement: Password Reset
The system SHALL allow users to reset forgotten passwords via email.

#### Scenario: Password reset request
- **WHEN** a user requests a password reset with a valid email
- **THEN** the system sends a time-limited reset link to that email

#### Scenario: Password reset completion
- **WHEN** a user clicks a valid reset link and provides a new password
- **THEN** the system updates the password and invalidates the reset token

#### Scenario: Expired reset token
- **WHEN** a user attempts to use an expired reset link
- **THEN** the system rejects the request and prompts to request a new link

### Requirement: Email Verification
The system SHALL support email verification for new registrations.

#### Scenario: Verification email sent
- **WHEN** a new user registers
- **THEN** the system sends a verification email with a link

#### Scenario: Email verified success
- **WHEN** a user clicks the verification link
- **THEN** the system marks the email as verified and allows full access

#### Scenario: Unverified email login
- **WHEN** a user with an unverified email attempts to login
- **THEN** the system prompts to verify email before granting access
