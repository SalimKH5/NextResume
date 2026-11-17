# NextResume

A web app to build, edit and export professional resumes from ready-made
templates, built with **Next.js 15, TypeScript, NextAuth and MongoDB**.

**Live demo:** https://next-resume-psi-ruddy.vercel.app/

Seven templates: Classic, Sidebar accent, Minimal, Studio, Right rail, Executive and Banner.

## Features

- **Sign in with Google** (NextAuth, users and accounts stored through the MongoDB adapter).
- **Dashboard** listing the resumes of the signed-in user; create a new resume from a template.
- **Resume editor** with sections for personal information, experience, education, skills, languages and interests.
- **Drag and drop** sections between columns and pages (with autoscroll), and reorder items inside sections; keyboard alternatives for both.
- **Rich-text descriptions** (TipTap), 10 bundled resume fonts, profile photo upload (cropped in the browser) with initials fallback.
- **Seven templates** with live preview; template, style and section layout are saved per resume.
- **English / French** interface and resume text.
- **Export to PDF** through the browser print dialog (`react-to-print`).
- **Profile page** to store personal details reused in resumes.
- **Per-user data isolation**: every API route resolves the user from the server session.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Radix UI / shadcn-style components, TipTap, SortableJS |
| Backend | Next.js Route Handlers, NextAuth (Google provider), MongoDB Node driver |
| Hosting | Vercel |

## Architecture

```
src
├── app
│   ├── Auth/                    sign-in page
│   ├── [locale]/dashboard       list of the user's resumes
│   ├── [locale]/edit-profile    personal details form
│   ├── cv-editions/[id]         resume editor + preview (server component loads the CV)
│   └── api
│       ├── auth/[...nextauth]   NextAuth handler
│       ├── user                 GET / POST the session user's profile
│       └── CvtTmplates          POST / GET / PUT the session user's resumes
├── components                   editor sections, templates, UI primitives
└── lib                          auth options, session guard (apiAuth.ts), MongoDB client
```

Data lives in two MongoDB collections: `users` (NextAuth + profile fields) and
`templates_info` (one document per resume: template id, title, content).

## API

All routes require a signed-in session (`401` otherwise) and only act on the session user's data.

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/user` | Current user's profile |
| POST | `/api/user` | Update profile fields (`firstName`, `lastName`, `gender`, `address`, `postalCode`, `town`, `country`, `phoneNumber`, `dateOfbirth`) |
| POST | `/api/CvtTmplates` | Create a resume `{ id_template, title_template, informations }` |
| GET | `/api/CvtTmplates[?id_template=<id>]` | List resumes, or get one |
| PUT | `/api/CvtTmplates` | Update a resume `{ id_template, title_template, informations }` |

## Getting started

Requirements: Node.js 18.18+, a MongoDB database, Google OAuth credentials.

```bash
git clone https://github.com/SalimKH5/NextResume.git
cd NextResume
npm install
# create .env.local (see below)
npm run dev        # http://localhost:3000
```

## Environment variables

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET` | NextAuth secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Public URL of the app, e.g. `http://localhost:3000` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth client |
| `NEXT_PUBLIC_BASE_URL` | Base URL used by server components to call the API |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint |

## Continuous integration

`.github/workflows/ci.yml` runs lint, type-check and a production build on every
push and pull request. Dependabot keeps npm packages and actions up to date.

## Roadmap

- Email/password accounts in addition to Google sign-in.
- Server-side PDF generation for consistent output across browsers.
- Schema validation (Zod) of resume content and tests for the API routes.

## License

[MIT](LICENSE)
