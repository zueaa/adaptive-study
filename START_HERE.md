# Start StudyFlow

StudyFlow's runnable app is the Next.js web application in `src/app`. The old Expo Router screens are preserved separately in `expo-app-legacy/` and are not used by the web server.

## Requirements

- Node.js 18 or newer
- PostgreSQL

## Setup

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Create local environment settings:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Set `DATABASE_URL` to your PostgreSQL connection string and replace `NEXTAUTH_SECRET` with a long random value. Keep `.env.local` private.

3. Generate Prisma Client and apply database migrations:

   ```powershell
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Add the demo account, subjects, topics, exams, and weekly availability:

   ```powershell
   npm run prisma:seed
   ```

5. Start the development server:

   ```powershell
   npm run dev
   ```

6. Open http://localhost:3000.

The demo account created by the seed is `demo@studyflow.com` with password `demo123456`. Change or remove this account before deploying anywhere public.

## Checks

```powershell
npm run test:ci
npm run build
```

`npm test` starts Jest in watch mode. `npm run test:ci` runs once and exits.

## Troubleshooting

- If Prisma cannot connect, confirm PostgreSQL is running and `DATABASE_URL` in `.env.local` names an existing database.
- If the schema changed, run `npm run prisma:migrate` and then `npm run prisma:generate`.
- If sign-in reports a configuration error, check `NEXTAUTH_URL` and `NEXTAUTH_SECRET` in `.env.local`.
