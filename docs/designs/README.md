# Design artifacts (`docs/designs/`)

Approved specifications live here, one file per feature, named
`<feature-slug>.md`. Temporary workflow artifacts stay in the project root and
are not committed unless a spec is approved.

## Workflow (EGM)

| Step | Skill | Output |
| --- | --- | --- |
| Explore the idea | `egm-brainstorm` | `concepts_brief.md` |
| Write the spec | `egm-draft` | `design_draft.md` |
| Fresh-eyes review | `egm-review` | `*_report.md` stage reports |
| Resolve findings | `egm-resolve` | updated draft |
| Approve | human | move draft here as `<feature-slug>.md` |
| Check for drift | `egm-drift-report` | drift report |
| Document existing code | `egm-bootstrap` | per-directory `README.md` |

Reviewers run in fresh contexts with no conversation history. Do not ask for a
review inside the drafting session with the drafting context — dispatch the
`egm-*` subagents instead.

## Before implementing

Read the approved spec and `docs/FILE_TREE.md`. If the change alters structure,
update `docs/FILE_TREE.md` in the same commit.
