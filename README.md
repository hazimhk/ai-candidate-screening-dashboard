# AI Candidate Screening Dashboard

A portfolio-ready HR dashboard where recruiters can add candidates, upload or paste resume text, generate AI summaries, score fit, and organize candidates by status.

## Stack

- Next.js + React + Tailwind CSS
- Next.js API routes
- PostgreSQL + Prisma
- Custom JWT cookie authentication
- OpenAI API for structured candidate summaries
- Local demo fallback when OpenAI quota is unavailable

## Features

- Login page with demo credentials
- Dashboard metrics
- Candidate table with search, skill filter, and status filter
- Add and edit candidate form
- PDF resume upload with text extraction
- Candidate detail page
- AI summary generation with strengths, gaps, relevant skills, interview questions, and fit score
- No-cost demo summary mode for portfolio testing without API quota
- REST API for candidate CRUD
- PostgreSQL schema with Prisma

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

The local `.env.local` in this workspace already includes `OPENAI_API_KEY`. Prisma also reads `.env`, so keep the database settings there:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_candidate_screening?schema=public"
AUTH_SECRET="replace-with-a-long-random-secret"
AI_SUMMARY_MODE="auto"
```

`AI_SUMMARY_MODE` accepts:

- `auto`: try OpenAI first, then fall back to a local demo summary if quota is unavailable.
- `demo`: always use the local no-cost summary generator.
- `openai`: require OpenAI and show an error if the API call fails.

3. Start local PostgreSQL:

```bash
docker compose up -d
```

4. Run the database migration and seed demo data:

```bash
npm run prisma:migrate -- --name init
npm run seed
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

Demo login:

- Email: `recruiter@example.com`
- Password: `password123`

## API

- `GET /api/candidates`
- `POST /api/candidates`
- `GET /api/candidates/:id`
- `PUT /api/candidates/:id`
- `DELETE /api/candidates/:id`
- `POST /api/candidates/:id/summary`
- `POST /api/resume/extract`

## AI Output Shape

```json
{
  "summary": "Candidate has strong frontend experience with React and API integration.",
  "strengths": ["React development", "UI implementation", "API consumption"],
  "gaps": ["Limited backend ownership", "Needs more cloud deployment exposure"],
  "relevant_skills": ["React", "TypeScript", "REST APIs"],
  "suggested_questions": [
    "Explain how you integrate frontend with backend APIs.",
    "How would you secure a candidate upload feature?",
    "How do you validate AI-generated summaries?"
  ],
  "fit_score": 78
}
```

## Deployment Notes

- Use Supabase or Railway for PostgreSQL.
- Deploy the Next.js app on Vercel.
- Set `DATABASE_URL`, `OPENAI_API_KEY`, `OPENAI_MODEL`, and `AUTH_SECRET` in deployment environment variables.
- Run `prisma migrate deploy` during deployment.
