## ADDED Requirements

### Requirement: List View
The system SHALL provide a table-based list view for all major entities.

#### Scenario: Display candidates list
- **WHEN** a user navigates to /dashboard/candidates
- **THEN** the system displays candidates in a sortable, filterable table

#### Scenario: Column sorting
- **WHEN** a user clicks a column header
- **THEN** the table sorts by that column in ascending/descending order

#### Scenario: Pagination controls
- **WHEN** viewing a list with more than 20 items
- **THEN** the system displays pagination controls (Previous, Next, page numbers)

#### Scenario: Items per page selection
- **WHEN** a user selects items per page (20, 50, 100)
- **THEN** the list updates to show that many items per page

### Requirement: List Filtering
The system SHALL allow users to filter list views by multiple criteria.

#### Scenario: Filter by status
- **WHEN** a user applies a status filter
- **THEN** the list shows only items matching that status

#### Scenario: Multi-select filters
- **WHEN** a user selects multiple filter values (e.g., multiple statuses)
- **THEN** the list shows items matching any of the selected values

#### Scenario: Clear filters
- **WHEN** a user clicks "Clear Filters"
- **THEN** all filters reset and the full list is displayed

#### Scenario: Filter persistence
- **WHEN** a user applies filters and navigates away
- **THEN** filters are preserved in URL query params and restored on return

### Requirement: List Search
The system SHALL provide real-time search functionality for list views.

#### Scenario: Search as you type
- **WHEN** a user types in the search box
- **THEN** the list filters in real-time after a short debounce (300ms)

#### Scenario: Search by multiple fields
- **WHEN** searching candidates
- **THEN** the system searches across name, email, and skills fields

#### Scenario: No results message
- **WHEN** a search returns no results
- **THEN** the system displays an empty state with suggestions

### Requirement: Kanban Board View
The system SHALL provide a drag-and-drop Kanban board for pipeline management.

#### Scenario: Display candidates Kanban
- **WHEN** a user switches to Kanban view for candidates
- **THEN** the system displays columns for each status (Lead, Contacted, Interviewing, etc.)

#### Scenario: Display jobs Kanban
- **WHEN** a user switches to Kanban view for jobs
- **THEN** the system displays columns for job statuses (Draft, Open, Closed, Filled)

#### Scenario: Cards in columns
- **WHEN** viewing a Kanban board
- **THEN** each column shows cards representing entities with that status

### Requirement: Drag-and-Drop
The system SHALL enable drag-and-drop to move entities between status columns.

#### Scenario: Drag candidate to new status
- **WHEN** a user drags a candidate card from "Contacted" to "Interviewing"
- **THEN** the system updates the candidate status via Server Action

#### Scenario: Optimistic UI update
- **WHEN** a user drops a card in a new column
- **THEN** the UI updates immediately before server confirmation

#### Scenario: Drag failure rollback
- **WHEN** a drag-and-drop Server Action fails
- **THEN** the system rolls back the card to its original position and displays an error

#### Scenario: Invalid drop prevention
- **WHEN** a user attempts to drop a card in an invalid column
- **THEN** the system prevents the drop and shows a visual indicator

### Requirement: View Toggle
The system SHALL allow users to switch between List and Kanban views.

#### Scenario: Toggle to Kanban view
- **WHEN** a user clicks the Kanban view button
- **THEN** the system switches to Kanban layout and updates the URL

#### Scenario: Toggle to List view
- **WHEN** a user clicks the List view button
- **THEN** the system switches to table layout and updates the URL

#### Scenario: View preference persistence
- **WHEN** a user selects a view preference
- **THEN** the system stores it in user settings and applies on next visit

### Requirement: Kanban Card Details
The system SHALL display key information on each Kanban card.

#### Scenario: Candidate card details
- **WHEN** viewing a candidate Kanban card
- **THEN** it displays name, email, key skills, and last update time

#### Scenario: Job card details
- **WHEN** viewing a job Kanban card
- **THEN** it displays job title, client name, and application count

#### Scenario: Click card for details
- **WHEN** a user clicks a Kanban card
- **THEN** the system navigates to the entity's detail page

### Requirement: Kanban Performance
The system SHALL render Kanban boards efficiently even with many items.

#### Scenario: Large dataset handling
- **WHEN** a Kanban board has more than 100 items
- **THEN** the system implements virtualization or pagination per column

#### Scenario: Smooth drag interaction
- **WHEN** dragging cards
- **THEN** animations are smooth (60fps) using optimized DOM updates
