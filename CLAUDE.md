# PRD_Demo Collaboration Rules

## Role and focus
- The user is a product manager.
- Focus on product-side work: requirements, interaction logic, page states, boundaries, review materials, demo presentation, and version records.
- Do not proactively write Android/iOS/frontend translation guidance or engineering implementation advice unless the user explicitly asks.

## Discuss before implementing
- During requirement discussion, do not change code or create project files.
- First clarify the idea, scenarios, page scope, interaction rules, edge cases, and open questions.
- After conclusions are clear, summarize the proposed structure and files.
- Only implement after the user explicitly says “实现”, “开始实现”, “继续执行”, or equivalent.

## Standard workflow
1. Requirement idea
2. Scenario and scope clarification
3. Interaction demo plan
4. Demo implementation after approval
5. Demo Hub entry
6. Review-ready PRD
7. Decision log and version log
8. Deployment or viewing instructions when needed

## Required context before working on an existing demo
Before handling an existing demo or requirement, read these files in that demo directory when they exist:
- `README.md`
- `prd.md`
- `decision-log.md`
- `version-log.md`

If they do not exist, tell the user which files are missing and ask whether to create them before continuing.

## Decision archiving
- Record important conclusions, strategy choices, and tradeoffs in the demo's `decision-log.md`.
- Record version-level changes in `version-log.md`.
- Project-wide workflow rules belong in `docs/workflow/00-overview.md`.

## File organization
- Project workflow docs live in `docs/workflow/`.
- Each requirement demo lives in `demos/{demo-name}/`.
- Each demo should contain `README.md`, `prd.md`, `decision-log.md`, `version-log.md`, `demo/`, and `assets/`.
