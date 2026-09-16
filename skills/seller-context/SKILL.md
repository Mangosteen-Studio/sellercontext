---
name: seller-context
description: Build, update, or audit one adaptive SELLER.md that teaches AI sales agents how an individual seller, founder-seller, or company sales team works. Use when capturing company sales context, personal selling judgment, territory logic, live-system references, offer, ICP, buyers, proof, objections, voice, commercial rules, or quality bar; compiling context from explicitly authorized email, calendar, CRM, call-note, or sales-document sources; running a scope-aware interview; or refreshing an existing SELLER.md without inventing missing facts.
---

# Seller Context

Build one durable, evidence-aware `SELLER.md` for AI systems that research accounts, write outreach, prepare meetings, create sales artifacts, or recommend actions. Capture company sales truth and, when relevant, how the individual seller decides—not merely how the seller sounds.

## Load the contract

Read [references/interview-contract.md](references/interview-contract.md) completely before compiling, interviewing, updating, or auditing a profile. Use [assets/SELLER.md](assets/SELLER.md) as the canonical output structure.

## Set scope first

Determine scope before inspecting sources or beginning the interview. If the user already states the scope clearly, record it and continue to the first unanswered relevant question. Otherwise ask:

> Are we building Seller Context for you as an individual or founder-seller, for a company sales team, or for both?

Use the answer to select later questions. Produce one `SELLER.md` in every mode. Do not create or require separate company, territory, or CRM context files.

- **Individual or founder-seller:** Capture company sales context, personal judgment and taste, territory logic when relevant, and live-system references.
- **Company sales team:** Capture shared commercial truth, approved proof and claims, sales standards, role variations, territory rules, governance, and live-system references. Do not invent a shared personal style.
- **Both:** Capture the company foundation first, then add the individual's judgment and territory as clearly labeled sections in the same file.

## Choose a workflow

- **Source-assisted compile:** Use when connected sources are available and the seller may authorize them.
- **Adaptive interview:** Use when no sources are available or the user prefers not to connect them. Ask only questions relevant to the selected scope.
- **Refresh:** Use when an existing `SELLER.md` is supplied. Preserve confirmed rules, identify stale or conflicting fields, and ask only what must change.
- **Audit:** Use when the seller wants gaps, weak evidence, stale context, or unsafe claims identified without changing the file.

## Authorize before reading

Before inspecting connected email, calendar, CRM, call notes, documents, or other private sources:

1. Name the exact source types available in the current environment.
2. Ask which sources the seller authorizes and for what time period.
3. Wait for explicit authorization.
4. Review only the authorized scope.

Do not treat access as authorization. Do not inspect a source merely because a connector or tool is available.

Prefer a recent, representative period. Learn seller voice and judgment from work the seller authored, sent, edited, rejected, reused, or approved. Use incoming buyer messages only for buyer language and deal context, not as evidence of the seller's personal style.

## Maintain the coverage ledger

Track every relevant question selected from the adaptive contract using exactly one status per question:

- `Confirmed`
- `Proposed from authorized context`
- `Partial`
- `Missing`

Treat every inference as proposed until the user confirms it. Connected context may reduce typing, but it never removes the confirmation requirement. Mark skipped branches as `Not applicable`, not missing.

## Compile or interview

For source-assisted work:

1. Distill recurring patterns; do not paste raw messages or transcripts into the profile.
2. Record evidence type, count, recency, and confidence when practical.
3. Show each proposed answer with the pattern supporting it.
4. Ask the seller to confirm, correct, or remove it.

For adaptive interview work:

1. Start with context scope, then follow only the relevant branch in the contract.
2. Ask one question at a time and wait for the answer.
3. Ask concise follow-ups when a compound question remains partial.
4. Prefer exact buyer language, concrete examples, ranges, named workflows, and verified proof.

Ask no more than 14 primary questions unless the user requests a deeper interview. Ask only the gap questions needed for qualification, commercial rules, legal or security boundaries, customer-memory references, and the AI output quality bar.

## Reconcile judgment and taste

Separate:

- **Observed patterns:** Repeated behavior found in authorized evidence.
- **Declared standards:** Rules the seller states directly.
- **Confirmed rules:** Patterns or standards the seller explicitly approves for agent use.

Surface conflicts between behavior and stated standards. Do not resolve them silently. Before generating the final file, show the most important inferred patterns and ask the seller to confirm, correct, or remove them.

Treat care as attention, accuracy, useful questions, honest uncertainty, respectful challenge, and reliable follow-through. Never fabricate familiarity, emotions, or empathy.

## Build the file

Copy the canonical structure from [assets/SELLER.md](assets/SELLER.md), then replace fields with confirmed information and clearly labeled proposed information. Set `Context mode` and mark irrelevant subsections as `Not applicable` rather than creating additional files.

- Begin with `# SELLER.md`.
- Preserve `[fill in]` for unresolved fields rather than guessing.
- Never invent customers, metrics, competitors, pricing, pain, capabilities, or proof.
- Keep raw personal information, private correspondence, customer names, and unnecessary confidential detail out of the file.
- Keep volatile account lists, opportunity state, approvals, and recent activity in their source systems; record durable lessons and references in the same `SELLER.md` instead.
- Apply precedence in this order: current explicit instruction; verified live facts; confirmed rules; observed patterns; defaults.
- Mark a file with unresolved required questions as a draft. Do not declare it complete.
- When the seller confirms the profile, output one clean Markdown document without prefatory commentary.

If the task permits writing files, save the result as `SELLER.md` in the user-approved location. Do not overwrite an existing profile without preserving or presenting the meaningful changes.

## Validate

Run:

```bash
python3 scripts/validate_seller_md.py /path/to/SELLER.md
```

Fix structural errors before delivery. Report unresolved blanks and `[fill in]` markers honestly; they are permitted in drafts.

## Refresh safely

Refresh when the seller's role, territory, product, pricing, policy, methodology, or win/loss pattern materially changes. Update provenance, version, review date, last material change, and change summary. Preserve confirmed rules that remain valid and ask before materially changing them.
