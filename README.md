# TestPilot AI

AI-powered QA workspace for turning software requirements into ready-to-use testing artifacts.

TestPilot AI takes a plain-English requirement and generates three connected outputs inside a polished dashboard:

- Structured manual test cases
- Cucumber Gherkin scenarios
- Selenium Java step definition scaffolds

The app is built as a full-stack Next.js product with Supabase for auth and persistence, and Groq for LLM-powered generation.

## Overview

This project was built to reduce the slowest part of early QA work: translating raw requirements into test assets that engineers can immediately review, refine, and automate.

Instead of switching between docs, spreadsheets, and automation frameworks, the user can work in one flow:

1. Sign in
2. Create a project
3. Paste a requirement
4. Generate test cases, Gherkin, and Java step defs
5. Save, revisit, copy, or download the results

## Highlights

- Modern landing page plus authenticated product workspace
- Email/password auth and Google OAuth with Supabase
- Project-based organization for generated outputs
- Saved generation history with delete support
- Downloadable `.json`, `.feature`, and `.java` artifacts
- Protected API routes with ownership checks
- Prompt-driven AI layer separated cleanly under `lib/ai/`

## Tech Stack

- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS
- React Query
- Monaco Editor
- Supabase Auth + PostgreSQL
- Groq API
- Zod validation

## Product Surfaces

- `/` public landing page
- `/login` and `/signup` authentication flow
- `/dashboard` summary view
- `/projects` project management
- `/generate` primary AI generation workspace
- `/history` saved artifact history

## Architecture Snapshot

```text
Next.js App Router UI
        |
        v
Route Handlers in app/api/
        |
        +--> Groq AI generation layer in lib/ai/
        |
        +--> Supabase Auth + PostgreSQL
```

Core tables:

- `users`
- `projects`
- `generations`

Supported generation types:

- `test_cases`
- `gherkin`
- `step_defs`

## Local Development

### Prerequisites

- Node.js 18.18+ or 20+
- A Supabase project
- A Groq API key

### Install

```bash
npm install
```

### Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

### Database setup

Apply these SQL files in order:

1. `supabase/migrations/001_initial.sql`
2. `supabase/migrations/002_user_trigger.sql`

The schema enables row-level security and creates the auth-to-profile sync trigger required by the app.

### Auth setup

Enable email/password auth in Supabase.

If you want Google OAuth locally, configure the callback URL as:

```text
http://localhost:3000/auth/callback
```

### Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## API Examples

All generation routes require an authenticated session and a valid `projectId` owned by the current user.

### Generate test cases

```bash
curl -X POST http://localhost:3000/api/generate/testcases \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "YOUR_PROJECT_ID",
    "requirement": "Users should be able to reset their password from the login page using a verified email address."
  }'
```

Example response:

```json
{
  "success": true,
  "data": {
    "testCases": [
      {
        "id": "TC001",
        "title": "Reset password with valid email",
        "preconditions": "User account exists",
        "steps": [
          "Open login page",
          "Click Forgot Password",
          "Enter a registered email",
          "Submit the form"
        ],
        "expected_result": "A reset link is sent to the registered email address",
        "priority": "High"
      }
    ],
    "generationId": "generated-row-id"
  }
}
```

### Generate Gherkin

```bash
curl -X POST http://localhost:3000/api/generate/gherkin \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "YOUR_PROJECT_ID",
    "requirement": "Users should be able to reset their password from the login page using a verified email address."
  }'
```

Example response:

```json
{
  "success": true,
  "data": {
    "feature": "Feature: Password reset\n  Scenario: Reset password with registered email\n    Given the user is on the login page\n    When the user requests a password reset with a registered email\n    Then a reset link should be sent",
    "generationId": "generated-row-id"
  }
}
```

### Generate Selenium Java step definitions

```bash
curl -X POST http://localhost:3000/api/generate/stepdefs \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "YOUR_PROJECT_ID",
    "gherkin": "Feature: Password reset\nScenario: Reset password with registered email\nGiven the user is on the login page\nWhen the user requests a password reset with a registered email\nThen a reset link should be sent"
  }'
```

## Deployment

### Recommended: Vercel + Supabase

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add these environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`
4. In Supabase Auth settings, add your production callback URL:

```text
https://your-domain.com/auth/callback
```

5. Run the Supabase migration SQL on the production database.
6. Deploy.

### Build commands

```bash
npm run build
npm run start
```

## Route Protection

These routes are protected by middleware:

- `/dashboard`
- `/generate`
- `/projects`
- `/history`

Unauthenticated users are redirected to `/login`. Signed-in users visiting `/login` or `/signup` are redirected to `/dashboard`.

## Current Scope

Implemented now:

- auth
- project management
- generation history
- test case generation
- Gherkin generation
- Selenium Java step-definition generation
- copy and download actions

Ideas noted in product docs but not implemented end-to-end in this repo:

- Jira integration
- PDF requirement upload
- coverage scoring
- bug prediction
- API test generation
- direct export to external QA platforms

## Troubleshooting

### Project fetch fails after signup

Make sure `supabase/migrations/002_user_trigger.sql` has been applied. The app expects new auth users to be mirrored into `public.users`.

### Generation fails

Check:

- `GROQ_API_KEY` is set
- the user is authenticated
- the request includes a valid `projectId`
- the requirement text passes validation

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

- App metadata describes the product as an AI-powered test case generator.
- Remote Unsplash images are enabled in the Next.js config for the auth screens.
- There is no automated test script configured in `package.json` yet.
