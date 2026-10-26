# ExpenseFlow Pro

Create a polished responsive React + TypeScript + Tailwind + shadcn/ui SaaS frontend prototype called “Expense Organizer” for small business owners. Build all specified pages/routes and functional navigation: landing, login, signup, dashboard, upload, processing, expense review/details, expenses, reports, analytics, settings, pricing. Use a dark navy/blue fintech SaaS visual language with green positives, white cards, subtle shadows, Lucide icons, Recharts, Indian INR demo data around 2026. Persistent responsive sidebar after login and mobile drawer. Prioritize the end-to-end working demo: Dashboard → Upload Receipt → AI Processing → Review extracted data → Save → Dashboard updated → Reports. Include drag-drop/file validation/progress, Try Demo Receipt, realistic receipt preview, animated processing status, editable expense form/items, confidence indicators, demo-mode notice, mock structured extraction service designed to later call secure /api/extract-receipt with Gemini via GEMINI_API_KEY (never expose any key client-side), friendly errors/retries. Structure reusable components and services; don't put everything in one component. Implement working buttons/routes, mock authentication, CRUD-style demo interactions, export/report actions where feasible. Include a README or clear architecture notes for future Supabase tables/relationships and secure Gemini backend integration. Do not leave major buttons dead.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://fin-receipt-pal.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8d86609d-f16a-41c3-b1e2-3fef87cd33ae).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Receipt scanning setup (Gemini)

Receipt uploads are extracted by Google's Gemini vision model, called from a
server-only function (`src/services/gemini-receipt-extraction.js`) so the API
key is never exposed to the browser.

1. Get a key at https://aistudio.google.com/app/apikey
2. Copy `.env.local.example` to `.env.local` and set `GEMINI_API_KEY`
3. `npm run dev` (or restart your dev server if it was already running)

For a deployed environment, set `GEMINI_API_KEY` as a server-side secret on
your host. This app builds against a Cloudflare Workers target by default
(see `vite.config.ts`); on Workers, set it as a secret/binding — plain `.env`
files aren't read at runtime there. `GEMINI_MODEL` is optional (defaults to
`gemini-2.5-flash`) if you want to point at a different Gemini model.

There is no demo/sample data anymore — new workspaces start empty, and every
upload goes through the real extraction pipeline above.
