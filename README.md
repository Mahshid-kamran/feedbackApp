# Customer Feedback — modernized

This project was migrated from Create React App to Vite and connected to Supabase for persistent storage and administrator authentication.

## Requirements

- Node.js 20.19+ (Node 24 is suitable)
- A Supabase project

## Run locally

1. Open a terminal in this folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local`.
4. Fill in `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_SUPABASE_ADMIN_UID` using the values from your Supabase project and the administrator's Auth user UUID.
5. Start the development server:
   ```bash
   npm run dev
   ```

Vite normally prints a local URL such as `http://localhost:5173`.

## Supabase table and security

The app expects a `public.feedback` table with `id`, `text`, `rating`, and `created_at` columns. The SQL policies already created for this project allow public reads and inserts and restrict updates/deletes to the administrator UUID. Keep Row Level Security enabled.

The browser key must be the Supabase anon/publishable key. **Never use a `service_role` or secret key in a React/Vite environment variable**, because browser variables are included in the public build.

## Production build

```bash
npm run build
npm run preview
```

Deploy the generated `dist` directory to Netlify. In Netlify, add the same three `VITE_...` environment variables under the site's environment variables and trigger a new deploy. For client-side routes, the included `public/_redirects` file routes requests back to `index.html`.

## Tests

```bash
npm test
```
