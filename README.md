# Research Source Tracker

Research Source Tracker is a full-stack web application for organizing sources collected for an academic research project. It was created as an individual Engineering Design 2 assignment and as a small prototype related to the Multi-Agent Data Collection and Analysis System for Generative AI in Education senior design project.

## Links

- Deployed application: Added after deployment
- Demo video: Added after recording

## What the application does

After creating an account and logging in, a user can add news articles, government pages, blogs, or other research sources. Each record stores the source title, URL, source type, comment availability, collection status, and notes. Users can view, search, filter, edit, and delete their records. Dashboard totals provide a quick summary of collection progress.

Every record is connected to the account that created it. Supabase Row Level Security prevents users from viewing or changing another user's records.

## Technologies used

- React 19
- Vite 8
- Supabase Postgres
- Supabase Authentication
- Supabase Row Level Security
- Netlify
- Git and GitHub

## Local setup

1. Clone this repository.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a Supabase project.
4. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor.
5. Copy `.env.example` to `.env.local` and add the project's URL and publishable or anonymous key:

   ```text
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open the local URL shown in the terminal.

## Available commands

```bash
npm run dev      # Start the development server
npm run lint     # Check the source code
npm run build    # Create a production build
npm run preview  # Preview the production build
```

## Security notes

- Authentication is handled by Supabase rather than custom password code.
- Database access is protected with per-user Row Level Security policies.
- Environment variables are excluded from Git.
- The Supabase service-role key must never be used in this frontend application.

See [`docs/PROJECT_SPEC.md`](docs/PROJECT_SPEC.md) for the original scope and acceptance criteria.
