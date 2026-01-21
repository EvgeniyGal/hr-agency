## ADDED Requirements

### Requirement: Main Dashboard
The system SHALL provide a role-specific overview dashboard showing key metrics and activity.

#### Scenario: Dashboard for Owner/Manager
- **WHEN** an Owner or Manager accesses the dashboard
- **THEN** the system displays metrics cards for total clients, active jobs, candidates, and placements

#### Scenario: Dashboard for Admin
- **WHEN** an Admin accesses the dashboard
- **THEN** the system displays read-only metrics and recent activity feed

#### Scenario: Empty state dashboard
- **WHEN** a new user accesses an empty dashboard
- **THEN** the system shows onboarding prompts and quick action buttons

### Requirement: Metrics Cards
The system SHALL display key performance indicators as interactive cards.

#### Scenario: Total clients metric
- **WHEN** viewing the dashboard
- **THEN** the Total Clients card shows count with trend indicator (up/down from previous period)

#### Scenario: Active jobs metric
- **WHEN** viewing the dashboard
- **THEN** the Active Jobs card shows count of jobs with status "Open"

#### Scenario: Candidates pipeline metric
- **WHEN** viewing the dashboard
- **THEN** the Candidates card shows breakdown by status (Lead, Contacted, Interviewing, etc.)

#### Scenario: Placements metric
- **WHEN** viewing the dashboard
- **THEN** the Placements card shows successful placements this month/quarter/year

#### Scenario: Click metric card for details
- **WHEN** a user clicks on a metric card
- **THEN** the system navigates to the relevant filtered list view

### Requirement: Recent Activity Feed
The system SHALL display a chronological feed of recent actions.

#### Scenario: Activity feed display
- **WHEN** viewing the dashboard
- **THEN** the system shows the last 10 activities (created, updated, deleted actions)

#### Scenario: Activity details
- **WHEN** an activity is displayed
- **THEN** it shows user name, action type, entity, and relative timestamp (e.g., "2 hours ago")

#### Scenario: Navigate from activity
- **WHEN** a user clicks an activity item
- **THEN** the system navigates to the related entity's detail page

### Requirement: Charts and Visualizations
The system SHALL provide visual charts for pipeline and trend analysis.

#### Scenario: Jobs by status chart
- **WHEN** viewing the dashboard
- **THEN** a bar or pie chart shows distribution of jobs by status

#### Scenario: Candidates pipeline chart
- **WHEN** viewing the dashboard
- **THEN** a funnel or bar chart shows candidates by status

#### Scenario: Placements over time chart
- **WHEN** viewing the dashboard
- **THEN** a line chart shows placements trend over the last 6 months

#### Scenario: Interactive chart filtering
- **WHEN** a user clicks a segment in a chart
- **THEN** the system filters to show details for that segment

### Requirement: Dashboard Filters
The system SHALL allow users to filter dashboard data by date range and other criteria.

#### Scenario: Date range filter
- **WHEN** a user selects a custom date range
- **THEN** all dashboard metrics and charts update to reflect that period

#### Scenario: Client filter
- **WHEN** a user filters by a specific client
- **THEN** the dashboard shows only data related to that client

#### Scenario: Reset filters
- **WHEN** a user clicks "Reset Filters"
- **THEN** the dashboard returns to default view (all data, current period)

### Requirement: Dashboard Performance
The system SHALL load dashboard data efficiently with Server Components.

#### Scenario: Fast initial load
- **WHEN** a user navigates to the dashboard
- **THEN** key metrics render within 1 second using server-side data fetching

#### Scenario: Progressive enhancement
- **WHEN** dashboard page loads
- **THEN** static content appears first, followed by client-side charts

#### Scenario: Dashboard refresh
- **WHEN** a user refreshes the dashboard
- **THEN** the system fetches latest data and updates all metrics
