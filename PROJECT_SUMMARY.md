# StudyFlow Project Summary

StudyFlow is an adaptive study-planning web app built with Next.js App Router, TypeScript, PostgreSQL, Prisma, Tailwind CSS, and NextAuth. Its scheduling decisions live in the pure-function modules under `src/engine`, separate from API handlers and React components.

## Implemented

- Prisma models for users, subjects, topics, exams, availability, study sessions, revision schedules, study logs, and topic notes.
- Email/password authentication and authenticated CRUD API routes for subjects, topics, exams, and availability.
- Priority scoring, schedule generation, adaptive replanning, at-risk identification, and SM-2-inspired revision calculations, with unit tests.
- Schedule generation and replanning endpoints backed by Prisma.
- Session status updates with transactional, delta-based progress accounting; terminal status changes trigger schedule replanning.
- Automatic missed-session detection on dashboard load and a catch-up action that marks overdue sessions missed before calling the shared adaptive re-planning service.
- A persistent countdown session timer with pause/resume, overtime, and complete/partial actions that save actual duration.
- Authenticated text/Markdown notes per topic with create, reopen, edit, and delete actions. File uploads need a storage provider and are not configured.
- A responsive day/week dashboard with subject mastery, exam countdowns, at-risk topics, weekly study/adherence metrics, most-skipped topics, and ad-hoc study logging.
- Basic onboarding for a first subject, topics, optional exam, weekly availability, and initial schedule generation.
- A demo-data seed script and Prisma baseline migration; Neon production schema is current.

## Still Incomplete

- Manual drag-and-drop editing/rescheduling of calendar sessions.
- File uploads for notes; this requires configuring object storage or another file-storage provider.

## Application Layout

- `src/app/` is the Next.js web application and API.
- `src/engine/` is the framework-independent scheduling engine.
- `prisma/` contains the PostgreSQL schema and demo seed.
- `expo-app-legacy/` preserves the earlier Expo Router screens outside Next.js's reserved `app/` route directory.

For setup, database configuration, test, and run commands, see [START_HERE.md](START_HERE.md).
