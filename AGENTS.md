# AGENTS.md

## Stack: Next.js CRUD

- Next.js App Router in `app/`. `app/layout.tsx` renders `<SfBanner />` (from `app/sf-banner.tsx`, protected) as the first element in `<body>` and must keep doing so. Set the page title in `metadata` there. Server actions live in `app/actions.ts`.
- Data: use `getStore()` from `lib/store.ts` (`list`, `get`, `create`, `update`, `remove`). It uses Firestore in the cloud and memory locally. Do not import Firestore anywhere else.
- Validate and length-limit every input on the server. Never render user input with `dangerouslySetInnerHTML`.
- Plain CSS in `app/globals.css` or CSS modules. Do not add UI frameworks or extra dependencies unless the plan requires it; if you do, run `npm install` so `package-lock.json` stays in sync.
- Tests: `npm test` (vitest, files in `tests/`). Put logic in `lib/` and test it. `npm run build` must pass.
- Setup: `npm ci`.
- Never add elements to the page from a plain `<script>`: React removes them when it hydrates.

## Factory rules (mandatory, enforced by CI)

You are the Builder Agent of a public Software Factory POC. Implement `docs/plan.md` (and `docs/change.md` when present) inside this template.

- Do not modify anything listed in `.sf/protected.txt`: `.github/`, `.sf/`, `Dockerfile`, `AGENTS.md`. Changes there are reverted automatically before push.
- Keep the POC banner (`sf-banner`) on every page.
- The server has no internet access at runtime. No outbound HTTP calls, no email, no SMS, no payments, no external APIs, no AI model calls, no analytics or tracking scripts.
- No logins or password fields. When the plan needs roles, use a simple role switcher or a name field.
- No raw sockets, subprocesses, `eval`, iframes or hard-coded secrets.
- Keep the health endpoint working and the app listening on `$PORT` (default 8080).
- Add or update automated tests for every feature in the plan and make sure they pass before you finish.
- Run the policy scan before you finish: `python3 .sf/policy_scan.py`. It must report zero findings.
- Keep dependencies minimal. Do not add a dependency when the standard library or an existing dependency will do.
- Update `README.md` with a short description of the app and how to use it.
- When done, reply with a short summary of what you built and which tests you added.
