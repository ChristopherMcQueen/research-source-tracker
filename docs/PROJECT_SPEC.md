# Research Source Tracker - Project Specification

## Purpose

Research Source Tracker is a small full-stack web application for organizing sources collected for the Multi-Agent Data Collection and Analysis System for Generative AI in Education senior design project. It replaces an informal list of links with a searchable, user-specific record of what has been found and what still needs to be reviewed.

## Core data

Each source record contains:

- Source title
- URL
- Source type: News, Government, Blog, or Other
- Comment availability: Available, Unavailable, or Unknown
- Collection status: Not Started, In Progress, or Complete
- Notes
- Creation and update timestamps
- Owner ID supplied by Supabase Authentication

## Required screens and states

1. Authentication screen with account registration and login.
2. Tracker dashboard showing the signed-in user's source records.
3. Source form for adding a record and editing an existing record.
4. Empty, loading, success, and error states.

## Acceptance criteria

- A visitor can register, log in, and log out.
- An authenticated user can create, read, update, and delete source records.
- Users cannot view or modify records belonging to another account.
- Required fields are validated before a record is saved.
- Records can be searched and filtered by type or collection status.
- The interface works on desktop and mobile screens.
- The application can be deployed as a static frontend on Netlify.
- No passwords or privileged database keys are stored in the repository.

## Technology choices

- React and Vite for the frontend
- Supabase Postgres for data storage
- Supabase Authentication for email and password accounts
- Supabase Row Level Security for per-user data protection
- Netlify for deployment
- Git and GitHub for version control

## Out of scope

- Automated article scraping
- Social media collection
- LLM or external AI API integration
- Team sharing and administrator roles

The assignment evaluates the use of AI-assisted development, not whether the finished application contains an AI feature. Keeping those items out of scope makes the prototype focused and achievable while meeting the complete assignment rubric.
