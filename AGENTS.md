<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## EGM (Elephant & Goldfish) mindset — installed for this machine

Design with an elephant, review with a goldfish.

- **Bundle:** `~/.local/share/egm/candidates/egm-8f168124593f/bundle`
  (skills, `agents/*.md` personas, `resources/`, `docs/`). Upstream:
  `google/elephant-goldfish-model` at commit `8f168124593f`.
- **Agents (OpenCode V2, global):** `~/.config/opencode/agents/egm.md` (primary
  orchestrator) + 8 read-only reviewers: `egm-codebase-details`,
  `egm-comprehension`, `egm-design`, `egm-implementation-readiness`,
  `egm-inventive-catalyst`, `egm-structural`, `egm-style`, `egm-zoom-out`.
- **Skills (hidden from auto-invoke, load by id):** `egm-brainstorm`,
  `egm-draft`, `egm-review`, `egm-resolve`, `egm-review-loop`,
  `egm-drift-report`, `egm-bootstrap`.
- **Reinstall/upgrade:** run the upstream installer into a new candidate dir,
  then `python3 ~/.local/share/egm/install-opencode-v2.py <new-bundle>` and
  update the `skills` path in `~/.config/opencode/opencode.json`.

How to work here:

1. Non-trivial feature → brainstorm, then draft a spec, then review with fresh
   subagents, then resolve, then implement. Trivial fixes skip the ceremony.
2. Never simulate a reviewer in the drafting context. Reviews must be
   subagent sessions that receive only the target document, absolute paths, and
   the reading list — no conversation history.
3. Artifact-first: write briefs, drafts, and reports to files; chat carries a
   pointer and one question at a time. Preserve every human approval gate.
4. Critique first, plain English, no flattery, no echo-chamber framing.
5. Approved specs go to `docs/designs/<feature-slug>.md`
   (see `docs/designs/README.md`).

## Repo rules

- **`docs/FILE_TREE.md` is the codebase index.** Read it before searching. When
  a change adds, moves, or removes a route, component group, script, env var, or
  deploy target, update that file in the same change.
- Do not print or commit `.env.local` values. `SUPABASE_SERVICE_ROLE_KEY` is
  server-only (used only by `src/app/api/auth/register/route.ts`).
- `src/components/*.tsx` (non-`mui`) and `src/data/*` are unused legacy code —
  confirm with the import-map command in `docs/FILE_TREE.md` before touching,
  reviving, or deleting them.
- Live styling is split: MUI (`src/theme/theme.ts`) for the lander and modals,
  Tailwind v4 + shadcn (`src/app/globals.css`) for the dashboard. Keep new work
  inside the system the surrounding component already uses.
