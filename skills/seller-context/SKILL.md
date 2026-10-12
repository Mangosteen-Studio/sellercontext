---
name: seller-context
description: Draft, refresh, or audit one SELLER.md from available sales context and explicitly authorized sources. Use for a portable sales playbook covering product, buyers, proof, seller judgment, and standards; offer an interview when context is missing or requested.
---

# Seller Context

Create one editable, evidence-aware SELLER.md. Default to a draft from available context, then ask only material gap questions. The seller reviews the file as a whole, not one confirmation per field.

## Contract and template

Read [references/interview-contract.md](references/interview-contract.md) completely before drafting, interviewing, refreshing, or auditing. It defines the draft-first workflow, privacy boundaries, and interview fallback. Follow [assets/SELLER.md](assets/SELLER.md) for the document structure.

## Choose the right workflow

- **Draft first (default):** Use relevant conversation context, supplied task files, and memory actually available. Produce a labeled draft before gap questions. Connected tools are optional, not prerequisites.
- **Interview:** When explicitly chosen or no meaningful sales context exists, ask the first necessary question and skip information already supplied. Draft as soon as useful context exists. No fixed question count.
- **Refresh:** Preserve the existing file, identify stale or conflicting content, and present proposed changes. Do not overwrite confirmed rules silently.
- **Audit:** Report gaps, weak evidence, stale information, and unsafe claims without changing the file unless asked.

Distinguish individual seller, founder-seller, company team, and combined scope. If unclear, mark scope unresolved; do not blend people or employers. Company standards are not automatically one person's voice.

## Output and review

Produce the full draft early, with supported facts, declared standards, proposed inferences, missing fields, and conflicts distinguishable. Never hold the initial document behind an interview or approval gate. A partial draft is a valid deliverable, not a completed profile.

After drafting, ask only questions that materially affect the intended use. The seller can edit, skip, or stop. Show a concise review summary and request approval of the whole file. Approval does not verify uncertain facts or supply missing proof.

If file writing is authorized, save SELLER.md in the requested location. Preserve an existing version or show the meaningful changes before replacement. Do not publish private profiles or send their contents to another system without authorization.

## Validation

Run the structural validator from this skill directory:

```bash
python3 scripts/validate_seller_md.py /path/to/SELLER.md
```

Structural success does not establish factual accuracy, seller approval, or completeness. Report unresolved fields honestly. Ask before materially changing confirmed rules during a refresh.
