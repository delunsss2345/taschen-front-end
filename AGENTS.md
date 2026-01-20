# AGENTS
Add context instructions here.
SUBPROJECT REQUIREMENTS  
APPLICATION UI DEVELOPMENT

1) Overview requirements  
Timeline: 12 weeks (3 months), split into 6 sprints x 2 weeks.

Deliverable: 1 runnable web app (deployed), with a clear Git repo, and documentation.

Technical goals: React (UI/State), Next.js (routing, SSR/SSG/ISR), API, auth, testing, CI/CD.

2) Minimum functional requirements (MVP)  
Auth & authorization  
- Sign up / Sign in / Sign out  
- Refresh token or re-login flow  
- Minimum roles: admin / user  

Core CRUD by project domain  
- At least 3 CRUD modules (e.g., Products, Orders, Users)  
- Form validation, loading/error/empty states  

Search + filter + pagination  
- Keyword search  
- Filter by 2–3 criteria  
- Pagination or infinite scroll  

Dashboard / Reporting  
- At least 2 charts or statistic tables (total revenue, orders by day…)  

Upload  
- Image upload (avatar / product images) + preview + size/type validation  

3) React technical requirements  
Clear component separation: UI components / containers / hooks  

State:  
- Local state for UI  
- Global state with Redux Toolkit / Zustand (choose 1)  
- Data fetching with React Query / RTK Query (choose 1)  

Must include at minimum:  
- useMemo, useCallback used appropriately  
- Custom hooks: useAuth, useDebounce, useFetch...  
- Forms: React Hook Form + Zod/Yup (recommended)  

4) Next.js technical requirements (mandatory)  
App Router (recommended Next 14/15) + clear route structure  

Render strategy:  
- At least 1 SSR page  
- At least 1 SSG/ISR page  

SEO  
- Metadata (title/description/open graph)  
- Friendly URL + canonical (if applicable)  

API Routes / Server Actions (choose 1 approach for a lightweight backend)  
- At least 5 endpoints or 5 actions serving the project  

Auth in Next  
- NextAuth or custom JWT (if custom, must include middleware to protect routes)  

5) Code quality & architecture  
TypeScript recommended as mandatory  

ESLint + Prettier + Husky (pre-commit)  

Conventions:  
- Naming (camelCase/PascalCase)  
- Separate folders: components/, features/, services/, lib/, types/, utils/  

Error handling:  
- Unified API error format  
- Toast/alert UX for errors  

Minimum performance:  
- Lazy-load components/pages where appropriate  
- Image optimization (Next Image)  
- Avoid unnecessary re-renders (memo where appropriate)  

6) Testing (minimum to pass)  
- Unit tests: 10–15 tests (utils/hooks/components)  
- Integration/UI tests: 3–5 flows (login, create item, search…)  
- (Optional) E2E Playwright/Cypress: 1–2 scenarios  

7) Git workflow & project management  
Public/private GitHub/GitLab repo  

Branches:  
- main, develop, feature/*, hotfix/*  

Commit convention (e.g., Conventional Commits):  
- feat:, fix:, chore:, refactor:, test:  

Each sprint must include:  
- Issue/Task list (Backlog)  
- PR review (at least 1 time / sprint)  

8) CI/CD & Deploy  
Deploy to one of:  
- Vercel (recommended for Next)  
- Netlify / Render  

Minimum CI:  
- Run lint + tests on PR  
- Build check before merge  
- Provide .env.example + environment setup instructions  

9) Required documentation (deliverables)  
Standard README.md:  
- Description, features, tech stack  
- Local setup  
- npm scripts  
- Demo link  
- Demo account (if any)  

docs/  
- ERD or data schema  
- API spec (Postman/Swagger or markdown)  
- Architecture diagram (simple)  
- Sprint report (1 file per sprint)  

10) Suggested 12-week roadmap (6 sprints)  
Sprint 1: Setup, UI base, routing, design system, mock data  
Sprint 2: Auth + protected routes + profile  
Sprint 3: CRUD module 1–2 + upload  
Sprint 4: CRUD module 3 + search/filter/pagination  
Sprint 5: Dashboard + SSR/SSG/ISR + SEO + optimization  
Sprint 6: Testing, bugfix, polish UI/UX, CI/CD, finalize docs