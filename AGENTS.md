# Project Instructions

## Purpose

Maintain a small, understandable research source tracker for an Engineering Design 2 assignment. Prefer reliable, easily demonstrated features over unnecessary complexity.

## Stack

- React and Vite
- Supabase database and authentication
- Plain CSS
- Netlify deployment

## Development rules

- Keep secrets out of source control. Only use the public Supabase browser key in `VITE_` variables.
- Preserve row-level security and per-user ownership for every database operation.
- Keep components readable enough to explain during a short demonstration.
- Validate user input and provide clear loading, success, empty, and error states.
- Run `npm run lint` and `npm run build` before committing.
- Use small commits with messages that describe the completed change.
