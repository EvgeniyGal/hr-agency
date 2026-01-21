# HR Agency CRM

A premium, feature-rich CRM for HR agencies built with Next.js 15, Prisma 7, and Tailwind v4.

## 🚀 Features

- **Multi-role Auth**: Owner, Manager, and Admin with RBAC enforcement.
- **Client & Job Management**: Track partners and positions in a high-end interface.
- **Candidate Pipeline**: Visual Kanban board with drag-and-drop interactivity.
- **Secure CV Storage**: Integrated Google Cloud Storage with metadata tracking.
- **Real-time Analytics**: Dashboard with interactive charts for status monitoring.
- **Audit Logging**: Full activity tracking for all significant user actions.

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma 7](https://www.prisma.io/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Interactivity**: [@dnd-kit](https://dndkit.com/), [Recharts](https://recharts.org/)
- **Storage**: [Google Cloud Storage](https://cloud.google.com/storage)

## 📦 Setup

### 1. Prerequisites
- Node.js 18+
- PostgreSQL instance
- Google Cloud Project (for Storage)

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in the values:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `NEXTAUTH_SECRET`: Random string for session encryption.
- `GCS_*`: Google Cloud Storage credentials and bucket name.

### 3. Initialize Database
```bash
npx prisma migrate dev --name init
npm run prisma seed
```

### 4. Run Development Server
```bash
npm install
npm run dev
```

## 🔐 Default Accounts (Seed Data)
| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Owner   | owner@hragency.com     | owner123   |
| Manager | manager@hragency.com   | manager123 |
| Admin   | admin@hragency.com     | admin123   |

## 📄 Documentation
Requirements and specifications can be found in the `openspec` directory.
