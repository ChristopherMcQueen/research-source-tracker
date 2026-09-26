# Demo Video Outline

Target length: 3 to 5 minutes

## 0:00-0:30 - Introduction

"This is Research Source Tracker, my individual Engineering Design 2 application. I built it as a small prototype related to our senior design project, which involves collecting and analyzing online sources about generative AI in education. The purpose of this app is to keep those sources and their collection status organized."

Show the deployed application URL in the browser address bar. Do not demonstrate on localhost.

## 0:30-1:05 - Registration and login

Open the Register tab, create a demonstration account, and show that it enters the application. Log out and log back in to demonstrate both authentication flows.

Suggested explanation:

"Account registration, login, and logout are handled through Supabase Authentication. Each saved source is connected to the authenticated user, and the database security rules prevent one account from accessing another account's records."

## 1:05-2:35 - Database and CRUD functionality

Create a source with all fields completed. Point out that the dashboard count changes.

Open the new source to demonstrate Read. Search for part of its title and briefly demonstrate one filter.

Edit the source by changing its collection status and notes. Point out that the status count changes.

Delete either the new record or a separate demonstration record. Confirm that it disappears.

Suggested explanation:

"These actions demonstrate the four required database operations: create, read, update, and delete. The search and filters operate on the records retrieved from Supabase."

## 2:35-3:40 - Code and project structure

Switch to the public GitHub repository and briefly show:

- `src/App.jsx` for session handling
- `src/components/AuthForm.jsx` for registration and login
- `src/components/Dashboard.jsx` for Supabase CRUD operations
- `src/components/SourceForm.jsx` and `SourceList.jsx` for the interface
- `src/lib/supabase.js` for the client configuration
- `supabase/schema.sql` for the table and security policies
- `.env.example` to show that secrets are not committed
- The Git commit history and README

Suggested explanation:

"I used React and Vite for the frontend, Supabase for the database and authentication, and Netlify for deployment. The real environment values are stored outside the repository. The schema file creates the sources table and Row Level Security policies. I built the project in stages and used meaningful Git commits to document that progress."

## 3:40-4:10 - Closing

Return to the deployed dashboard.

"The finished application meets the assignment requirements with a deployed frontend, authenticated users, protected database records, full CRUD functionality, a public GitHub history, and project documentation."

Keep the video under five minutes. Upload it to YouTube with visibility set to Unlisted, then place its link in the README.
