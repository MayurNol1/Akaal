---
name: workflow
description: The required order of work for any non-trivial change in this repo — Explore, then Plan, then Implement. Follow these phases in order; do not skip ahead to code.
---

# Workflow: Explore → Plan → Implement

Every non-trivial change follows these three phases **in order**. Do not jump straight to editing files.

## 1. Explore

Understand before you touch anything.

- Read the relevant code: the target files plus the modules/services/routes they touch.
- Follow the layered pattern — `src/modules/<domain>/` (repository → service → validation → types) and the API routes that call them.
- Check `CLAUDE.md`, `.claude/skills/api-conventions.md`, and `src/constants/` (routes, roles) for existing conventions.
- Identify what already exists so you reuse it instead of duplicating.
- **Do not edit files in this phase.** Read and search only.

## 2. Plan

Decide the approach before writing code.

- State what will change and which files/layers are affected.
- Respect the architecture: business logic in the service layer, Prisma only in repositories, API routes return the standard envelope.
- Note validation (Zod schema), auth gating, and any Decimal/serialization concerns.
- Surface trade-offs or open questions and confirm with the user if the direction is ambiguous.
- For anything beyond a trivial edit, present the plan and get agreement before implementing.

## 3. Implement

Only after exploring and planning.

- Make the changes following the agreed plan and the repo conventions.
- Keep new code in the repository→service→route flow; use `@/*` imports and `Routes.*` constants.
- Verify: `npm run lint`, and `npm run build` for anything substantial.
- Preserve the mystical UI tone (Disciples, Manifestations) in user-facing copy.

If new information in a later phase invalidates an earlier one, go back — re-explore or re-plan rather than pushing through.
