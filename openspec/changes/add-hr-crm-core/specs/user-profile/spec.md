## ADDED Requirements

### Requirement: View User Profile
The system SHALL allow users to view their account information.

#### Scenario: Access profile page
- **WHEN** a user navigates to /dashboard/profile
- **THEN** the system displays their name, email, role, and account details

#### Scenario: View avatar
- **WHEN** viewing the profile page
- **THEN** the system displays the user's avatar or a default placeholder

### Requirement: Edit User Profile
The system SHALL allow users to update their profile information.

#### Scenario: Update name
- **WHEN** a user changes their first or last name
- **THEN** the system validates and saves the changes

#### Scenario: Update email
- **WHEN** a user changes their email address
- **THEN** the system sends a verification email before updating

#### Scenario: Profile validation
- **WHEN** a user submits invalid profile data
- **THEN** the system displays validation errors and prevents submission

### Requirement: Avatar Upload
The system SHALL allow users to upload a profile avatar.

#### Scenario: Upload avatar image
- **WHEN** a user uploads a valid image file (JPG, PNG, max 2MB)
- **THEN** the system uploads to GCS and updates the user's avatar URL

#### Scenario: Invalid image rejection
- **WHEN** a user uploads an invalid file or oversized image
- **THEN** the system rejects the upload with an error message

#### Scenario: Remove avatar
- **WHEN** a user removes their avatar
- **THEN** the system reverts to the default placeholder

### Requirement: Change Password
The system SHALL allow users to change their password securely.

#### Scenario: Password change with current password
- **WHEN** a user provides current password and new password meeting strength requirements
- **THEN** the system updates the password hash and logs the user out of other sessions

#### Scenario: Incorrect current password
- **WHEN** a user enters an incorrect current password
- **THEN** the system rejects the change with an error message

#### Scenario: Weak new password
- **WHEN** a user enters a new password not meeting requirements
- **THEN** the system displays validation errors

### Requirement: User Preferences
The system SHALL store and apply user-specific preferences.

#### Scenario: Set default view preference
- **WHEN** a user sets their preferred view (List or Kanban)
- **THEN** the system applies this preference when navigating to entity lists

#### Scenario: Notification preferences
- **WHEN** a user configures email notification settings
- **THEN** the system respects these preferences for future notifications

#### Scenario: Theme preference
- **WHEN** a user selects a theme (light, dark, system)
- **THEN** the system applies the theme across all pages

### Requirement: System Settings (Owner Only)
The system SHALL provide system-wide settings accessible only to Owners.

#### Scenario: Manage users
- **WHEN** an Owner accesses settings
- **THEN** they can view, invite, edit, and deactivate user accounts

#### Scenario: Assign user roles
- **WHEN** an Owner changes a user's role
- **THEN** the system updates the role and applies new permissions immediately

#### Scenario: System configuration
- **WHEN** an Owner modifies system settings (e.g., default statuses, custom fields)
- **THEN** changes apply globally for all users

#### Scenario: Non-owner access blocked
- **WHEN** a Manager or Admin attempts to access system settings
- **THEN** the system redirects with a permission denied message

### Requirement: User Invitation
The system SHALL allow Owners to invite new users.

#### Scenario: Send invitation email
- **WHEN** an Owner invites a new user with email and role
- **THEN** the system sends an invitation link via email

#### Scenario: Accept invitation
- **WHEN** a recipient clicks the invitation link
- **THEN** they can set their password and create an account

#### Scenario: Expired invitation
- **WHEN** a user clicks an expired invitation link
- **THEN** the system displays an error and prompts the Owner to resend

### Requirement: Account Deactivation
The system SHALL allow Owners to deactivate user accounts.

#### Scenario: Deactivate user
- **WHEN** an Owner deactivates a user account
- **THEN** the user can no longer log in and active sessions are terminated

#### Scenario: Reactivate user
- **WHEN** an Owner reactivates a previously deactivated account
- **THEN** the user can log in again with existing credentials
