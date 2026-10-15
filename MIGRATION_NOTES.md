# Migration notes

- Replaced Create React App / `react-scripts` with Vite.
- Replaced the remote JSON demo endpoint and local `json-server` workflow with Supabase database reads and writes.
- Added Supabase email/password sign-in for the administrator.
- Admin edit/delete controls are rendered only for the configured administrator UUID; Supabase Row Level Security remains the authoritative enforcement layer.
- Fixed the old delete endpoint typo and removed the old client-side ID-based permission guess.
- Updated React entry-point setup for current React.
- Added a Vite environment example, Netlify SPA redirect, and a small Vitest test.

The original uploaded ZIP was not modified. This archive is a separate modernized copy. The Supabase URL, public anon/publishable key, and administrator UUID are intentionally not included; set them in `.env.local` locally and in Netlify's environment-variable settings.
