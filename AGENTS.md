# Moviera: Project Rules (read first)

Moviera is a BookMyShow-inspired movie ticket booking platform (portfolio project). It is a monorepo with two apps:

| App | Path | Rules file |
|---|---|---|
| API | `backend/` | `backend/AGENTS.md` |
| Web | `frontend/` | `frontend/AGENTS.md` |

Before changing code in an app, read that app's `AGENTS.md`. These rules override your defaults. If a rule conflicts with the task, stop and ask. Do not silently break the rule.

Roles: `USER`, `THEATRE_ADMIN`, `SUPER_ADMIN`.
Domain: movies, theatres, screens, seats, shows, show seats, bookings, payments (Stripe, INR, amounts stored in **paise**), reviews.

## How to work on every task

1. **Inspect first, change nothing.** Read the code that already does something similar. Report briefly: what exists, what can be reused, which files will change, any blockers or schema gaps.
2. **Reuse before you create.** Search for an existing component, hook, helper, schema, use case or query before writing a new one. Never fork a shared piece (pagination, search, debounce, modal, error handling).
3. **Smallest change that completes the task.** No unrelated refactors, renames, dependency upgrades or formatting churn. If you notice a problem outside the scope, list it in the final report. Do not fix it.
4. **Follow the nearest good example, not the nearest file.** Both apps contain legacy code (see "Known debt" in each app's rules). Do not copy those patterns.
5. **Backend first for full-stack features:** schema, migration, API, tests. Then frontend types, api, hooks, UI.
6. **Verify before you say done** (see Definition of done).
7. **Finish with a report** (format below).

## Hard rules (never)

- No mock, dummy or hardcoded data to make a screen look finished. Use the real API. If the endpoint is missing, say so.
- No extra logic when the task is restructuring or styling. Move or restyle existing code only.
- No new dependency without asking. Prefer what is already installed.
- No schema change unless the task needs it. Report every schema and migration change.
- Do not touch the Auth module unless the task is about auth.
- Never open, print, log or commit `.env*` files or secrets. Never log tokens, passwords, OTPs or personal data.
- Never trust the client: authorization, ownership checks and validation are enforced server-side.
- No `any`, no leftover `console.*`, no commented-out code, no TODO without a reason.

## Shared API contract (both apps depend on it)

- Success: `{ success: true, message, data }`.
- Error: `{ success: false, code, message, details? }`.
- Paginated data: `{ items: T[], pagination: { page, limit, total, totalPages } }`.
- List query params: `search`, `status` (`ALL | ACTIVE | INACTIVE`, default `ALL`), `page` (>= 1, default 1), `limit` (1 to 100, default 20).
- IDs are cuid strings. Dates are ISO strings. Money is integer paise.
- Changing a response shape means updating the backend read model, the frontend type and the tests in the same task.

## Definition of done

- Backend: `npx tsc --noEmit` is clean, `npm run test:run` is green, `npx prisma validate` passes when the schema changed.
- Frontend: `npm run lint` and `npm run build` are clean.
- New behavior has tests (backend: use case + schema; frontend: pure utils + schemas).
- UI handles loading, error, empty and "no matching results" states, is responsive and keyboard accessible.
- No leftovers: duplicate files, scratch files, debug logs.

## Final report format

1. Summary of what was implemented
2. Reused vs newly created (name the existing pieces you reused)
3. Modified and created files, and why
4. Migration(s) and data notes
5. Test, type-check, lint and build results
6. Issues found but NOT fixed, and remaining limitations

## Reference implementations (copy these patterns)

- Backend CRUD, paginated list and status toggle: the Facilities slice in `backend/src/modules/theatre/` (`CreateFacility*`, `EditFacility*`, `ToggleFacilityStatus*`, `ListFacilities*`).
- Backend create with image upload and location resolution: `CreateTheatreUseCase`.
- Frontend list page (search, status filter, pagination, all states): `frontend/src/features/theatres/pages/FacilitiesPage.tsx`.
- Frontend large form: `frontend/src/features/theatres/components/create-theatre/` with `hooks/useCreateTheatreForm.ts`, `schemas/createTheatreForm.schema.ts` and `utils/`.

## Prompt template for new tasks

> Follow `AGENTS.md` (root plus the app you touch).
> Task: <what and why>.
> Inspect first and report the plan, then implement the smallest change. Reuse existing components and helpers.
> Scope limits: <what not to touch>.
> Finish with the standard report.
