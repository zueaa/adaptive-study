# StudyFlow - Intelligent Adaptive Study Planning

**StudyFlow** is an intelligent, adaptive study planning web application built with Next.js, PostgreSQL, and Prisma. Unlike traditional calendar tools, StudyFlow **owns the scheduling decisions** — you set constraints and preferences, and StudyFlow decides what to study when using sophisticated priority algorithms and continuous re-optimization.

## 🎯 Core Concept

StudyFlow automatically generates and continuously re-optimizes your study schedule based on:
- Subjects, topics, and their characteristics (difficulty, importance)
- Exam dates and urgency
- Remaining workload and completion percentage
- Your availability (weekly recurring + one-off blocks)
- Study history and staleness
- Spaced repetition for optimal retention

## ✨ Key Features

### 1. **Intelligent Priority Scoring**
Multi-factor algorithm that ranks topics using:
- **Urgency** (exponential decay as exams approach)
- **Difficulty** (harder topics get more attention)
- **Importance** (user-defined weight)
- **Workload** (remaining hours needed)
- **Staleness** (topics not touched in a while get boosted)

### 2. **Automatic Schedule Generation**
- Allocates study time to highest-priority topics first
- Respects min/max session length and daily session caps
- Distributes topics across multiple sessions (spacing effect)
- Never schedules after exam dates
- Generates concrete sessions with start/end times

### 3. **Adaptive Re-planning** (The Core Differentiator)
When you mark a session as "missed" or "partial":
- Recalculates all priorities based on new state
- Automatically reschedules incomplete work
- Bumps lower-priority sessions if necessary
- Surfaces "at risk" warnings when workload exceeds available time
- Suggests trade-offs (reduce scope or add more hours)

### 4. **Spaced Repetition for Revision**
- Auto-schedules revision sessions using SM-2 algorithm
- Review intervals grow with successful recall, shrink with poor recall
- Self-reported recall confidence adjusts future intervals
- Revision sessions compete with learning sessions via priority engine

### 5. **Dashboard & Analytics**
- Calendar view (week/day) with color-coded sessions
- "Today" view with one-tap complete/partial/skip actions
- Per-subject mastery progress tracking
- "At risk" panel for topics/exams at risk
- Adherence rate (planned vs completed)
- Hours studied per week, topics most skipped

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- React Hook Form + Zod validation

**Backend:**
- Next.js API Routes
- PostgreSQL (via Prisma ORM)
- NextAuth (email/password + Google OAuth)

**Scheduling Engine:**
- Pure, framework-independent TypeScript functions
- Fully unit-tested (Jest)
- No external dependencies (no AI APIs)
- Deterministic and explainable

### Project Structure

```
studyflow/
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Demo data seeder
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API routes
│   │   │   ├── auth/              # Authentication
│   │   │   ├── subjects/          # Subject CRUD
│   │   │   ├── topics/            # Topic CRUD
│   │   │   ├── exams/             # Exam CRUD
│   │   │   ├── availability/      # Availability CRUD
│   │   │   ├── sessions/          # Session management
│   │   │   ├── schedule/          # Schedule generation & rescheduling
│   │   │   └── study-logs/        # Ad-hoc study logging
│   │   ├── auth/                  # Auth UI pages
│   │   ├── dashboard/             # Adaptive plan, calendar, and analytics
│   │   ├── onboarding/            # First subject, topics, availability, and schedule
│   │   └── layout.tsx             # Root layout
│   ├── components/                # Reusable UI components
│   ├── engine/                    # Scheduling engine (pure functions)
│   │   ├── priorityCalculator.ts
│   │   ├── scheduleGenerator.ts
│   │   ├── adaptiveScheduler.ts
│   │   ├── spacedRepetition.ts
│   │   ├── types.ts
│   │   └── __tests__/             # Engine unit tests
│   ├── lib/                       # Utilities
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # NextAuth config
│   │   └── session.ts             # Session helpers
│   └── types/                     # TypeScript type definitions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

### Database Schema

**Core Models:**
- `User` - Profile, timezone, session preferences
- `Subject` - Study subjects with colors
- `Topic` - Topics with difficulty, importance, estimated hours, progress
- `Exam` - Upcoming exams with dates
- `AvailabilityBlock` - Recurring or one-off time blocks
- `StudySession` - Scheduled sessions with status tracking
- `RevisionSchedule` - Spaced repetition tracking per topic
- `StudyLog` - Historical study records with self-ratings

**Key Relations:**
- User → Subjects → Topics → Exams
- User → AvailabilityBlocks
- Topics → StudySessions
- Topics → RevisionSchedule
- User + Topic → StudyLogs

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd studyflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/studyflow?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-change-in-production"
   
   # Optional: Google OAuth
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   ```

4. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # Seed with demo data (optional)
   npm run prisma:seed
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

### Database Setup (Detailed)

**Option 1: Local PostgreSQL**
```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb studyflow

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://your_user@localhost:5432/studyflow"
```

**Option 2: Docker**
```bash
docker run --name studyflow-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=studyflow \
  -p 5432:5432 \
  -d postgres:15

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/studyflow"
```

**Option 3: Cloud (Railway, Supabase, Neon)**
- Create a PostgreSQL database on your preferred platform
- Copy the connection string to `DATABASE_URL` in `.env`

## 📚 API Documentation

### Authentication

**POST /api/auth/register**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**POST /api/auth/signin** (NextAuth)
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Subjects

**GET /api/subjects** - List all subjects
**POST /api/subjects** - Create subject
```json
{
  "name": "Mathematics",
  "color": "#3b82f6"
}
```
**GET /api/subjects/[id]** - Get single subject
**PATCH /api/subjects/[id]** - Update subject
**DELETE /api/subjects/[id]** - Delete subject

### Topics

**GET /api/topics** - List all topics (filter by `?subjectId=`)
**POST /api/topics** - Create topic
```json
{
  "name": "Calculus - Derivatives",
  "subjectId": "subject_id",
  "difficulty": 4,
  "importance": 5,
  "estimatedHours": 15,
  "examId": "exam_id" // optional
}
```
**PATCH /api/topics/[id]** - Update topic
**DELETE /api/topics/[id]** - Delete topic

### Exams

**GET /api/exams** - List all exams
**POST /api/exams** - Create exam
```json
{
  "name": "Midterm Exam",
  "date": "2024-02-15T09:00:00Z",
  "subjectId": "subject_id"
}
```
**PATCH /api/exams/[id]** - Update exam
**DELETE /api/exams/[id]** - Delete exam

### Availability

**GET /api/availability** - List all availability blocks
**POST /api/availability** - Create availability block

Recurring block:
```json
{
  "dayOfWeek": 1,  // 0=Sunday, 1=Monday, etc.
  "startTime": "09:00",
  "endTime": "12:00",
  "recurring": true
}
```

One-off block:
```json
{
  "specificDate": "2024-02-15T00:00:00Z",
  "startTime": "14:00",
  "endTime": "18:00",
  "recurring": false
}
```

**PATCH /api/availability/[id]** - Update block
**DELETE /api/availability/[id]** - Delete block

### Study Sessions

**GET /api/sessions** - List sessions (filter by `?topicId=`, `?status=`, `?startDate=`, `?endDate=`)
**PATCH /api/sessions/[id]** - Update session status
```json
{
  "status": "COMPLETED",
  "actualDuration": 55,
  "completionPercentage": 100
}
```

### Schedule Generation

**POST /api/schedule/generate** - Generate schedule
```json
{
  "daysAhead": 14  // optional, defaults to 14
}
```

Response includes:
- `schedule`: Array of generated sessions
- `atRiskTopics`: Topics that can't be completed in time
- `warnings`: Human-readable warning messages
- `stats`: Generation statistics

**POST /api/schedule/reschedule** - Adaptive rescheduling

Automatically detects missed/partial sessions and regenerates schedule.

### Ad-hoc Study Logging

**POST /api/study-logs** - Log unplanned study time
```json
{
  "topicId": "topic_id",
  "duration": 45,  // minutes
  "focusRating": 4,  // 1-5, optional
  "difficultyRating": 3,  // 1-5, optional
  "notes": "Completed practice problems"  // optional
}
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:ci
```

### Test Coverage

The scheduling engine is **fully unit-tested**:
- ✅ Priority calculation algorithm
- ✅ Urgency scoring (exponential decay)
- ✅ Difficulty/importance normalization
- ✅ Workload and staleness calculation
- ✅ Schedule generation with constraints
- ✅ Time slot allocation and session splitting
- ✅ Adaptive rescheduling logic
- ✅ Spaced repetition (SM-2 algorithm)
- ✅ At-risk topic identification

## 🧮 Scheduling Algorithm Details

### Priority Score Formula

```
Priority Score = 
  (Urgency × 0.30) +
  (Difficulty × 0.20) +
  (Importance × 0.20) +
  (Remaining Workload × 0.20) +
  (Staleness × 0.10)
```

All factors normalized to 0-1 range.

### Urgency Calculation

```
Days Until Exam    Urgency Score
0-2 days           0.85-1.0 (Critical)
3-7 days           0.65-0.85 (High)
8-14 days          0.50-0.65 (Medium)
15-30 days         0.25-0.50 (Low)
30+ days           Exponential decay
```

### Spaced Repetition Intervals

Based on simplified SM-2 algorithm:
- **First review:** ~2 days after learning
- **Second review:** ~5-7 days  
- **Third review:** ~10-20 days
- Later reviews use exponential growth with ease factor adjustment

## 🎨 Design Decisions

1. **Pure Function Scheduling Engine**
   - No framework dependencies
   - Fully unit-testable
   - Deterministic output
   - Easy to debug and understand

2. **Database-Driven, Not AI-Driven**
   - No external API calls
   - No unpredictable AI behavior
   - Fast, reliable, offline-capable
   - Cost-effective

3. **Adaptive by Design**
   - Continuously responds to actual behavior
   - No static plans that become obsolete
   - Learns from missed sessions
   - Prevents student from falling behind invisibly

4. **Exam-Centric Urgency**
   - Exams drive all priority calculations
   - Automatic panic mode as exams approach
   - Clear warnings when goals are unrealistic

## 🔒 Security

- NextAuth session-based authentication
- Password hashing with bcrypt (12 rounds)
- Server-side ownership verification on all routes
- Zod validation for all API inputs
- SQL injection protection via Prisma
- CSRF protection via NextAuth

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

### Docker

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generated-secret-at-least-32-chars"
GOOGLE_CLIENT_ID="your-google-oauth-id"  # if using OAuth
GOOGLE_CLIENT_SECRET="your-google-oauth-secret"
```

## 📊 Performance Considerations

- Prisma connection pooling enabled by default
- Database indexes on frequently queried fields
- Sessions deleted after generation to prevent bloat
- Schedule generation happens async (not blocking user actions)
- Lightweight client-side bundle (no heavy charting libs yet)

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Lint code

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed demo data
npm run prisma:studio    # Open Prisma Studio (DB GUI)

# Testing
npm test                 # Run tests
npm run test:ci          # Run tests (CI mode)
```

## 🗺️ Roadmap

### Completed ✅
- [x] Next.js project setup with TypeScript
- [x] Prisma schema design
- [x] Scheduling engine (priority, generation, adaptive, spaced repetition)
- [x] Unit tests for scheduling engine
- [x] NextAuth authentication
- [x] CRUD API routes for all entities
- [x] Schedule generation and rescheduling endpoints
- [x] Ad-hoc study logging

### In Progress 🚧
- [ ] Onboarding UI flow
- [ ] Dashboard with calendar view
- [ ] Topic overview page
- [ ] Analytics page with charts
- [ ] Session interaction components

### Planned 📋
- [ ] Mobile-responsive design
- [ ] Error handling and loading states
- [ ] Email notifications for upcoming sessions
- [ ] Export study reports (PDF)
- [ ] Multi-timezone support
- [ ] Collaborative study groups
- [ ] Mobile app (React Native)

## 🤝 Contributing

This project was built as a demonstration of intelligent scheduling algorithms for student study planning. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Inspired by real student productivity challenges
- SM-2 spaced repetition algorithm by Piotr Wozniak
- Built with modern web development best practices

---

**StudyFlow** - Study smarter, not harder. 🎓

For questions or issues, please open a GitHub issue or contact the maintainers.
