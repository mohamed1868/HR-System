# HR System

A simple HR system built with Next.js.
Admins manage employees, requests and payroll. Employees check in / out, send requests and see their payslips.

## Features

**Admin**
- Employees: add, edit, delete and search
- Requests: approve, reject or delete employee requests
- Payroll: set salary, bonuses and deductions for each month, then mark it as paid / published

**Employee**
- Attendance: check in, check out and see the month's attendance
- Requests: send leave, permission, mission or advance requests and follow their status
- Payslips: see the published payslips

**For everyone**
- Login with JWT stored in a cookie
- Profile page
- Arabic and English
- Light and dark theme

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- PostgreSQL + Prisma 7
- Tailwind CSS 4 + shadcn/ui
- next-intl for translations
- Zod for validation

## Getting Started

1. Install the packages

```bash
npm install
```

2. Create a `.env` file in the project root

```env
DATABASE_URL="postgres://user:password@localhost:5432/hr_system"
SECRET_KEY="any-long-random-text"
COMPANY_TIME_ZONE=Africa/Cairo
```

3. Create the database tables and the Prisma client

```bash
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
```

4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## First Admin

There is no sign up page, so the first admin has to be added to the database by hand.

1. Make a hashed password

```bash
node -e "console.log(require('bcrypt').hashSync('123456', 10))"
```

2. Open Prisma Studio and add a user with that hashed password and `isAdmin = true`

```bash
npx prisma studio --config prisma7.config.ts
```

After that, log in with this admin and add the rest of the employees from the Employees page.

## Project Structure

```
app/(pages)     pages (login, admin, user, profile)
app/api         API routes
components      UI components
lib             prisma, auth, validations and helpers
messages        translations (ar.json, en.json)
prisma          database schema and migrations
proxy.ts        protects the pages and the API by role
```

## Scripts

| Command         | What it does           |
| --------------- | ---------------------- |
| `npm run dev`   | Start the dev server   |
| `npm run build` | Build for production   |
| `npm run start` | Run the production app |
| `npm run lint`  | Run ESLint             |
