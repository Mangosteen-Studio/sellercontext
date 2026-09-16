# Seller Context adaptive interview contract

Use this contract to build one `SELLER.md`. Select questions from the user's answers instead of forcing separate company, seller, territory, or CRM files.

## Coverage statuses

- **Confirmed:** The user directly provided or approved the answer.
- **Proposed from authorized context:** The answer is inferred from sources the user explicitly authorized but has not yet approved.
- **Partial:** Some required parts are known; important parts remain unanswered.
- **Missing:** No supported answer is available for a relevant question.
- **Not applicable:** The question belongs to a branch outside the selected context scope.

Do not declare the file complete while a relevant item is proposed, partial, or missing.

## Opening question

If the user already states the scope clearly, record it and continue to the first unanswered relevant question. Otherwise ask first:

> Are we building Seller Context for you as an individual or founder-seller, for a company sales team, or for both?

Record the answer under `Context Scope`, then select the relevant questions below. Ask one question at a time. Do not ask more than 14 primary questions unless the user requests a deeper interview.

## Questions for every mode

1. Who owns this context, who should use it, and what roles or selling motion does it cover?
2. What company is being represented, what does it sell, what outcomes does it create, and where is it not a fit?
3. Who is the ideal customer, what triggers matter, and what disqualifies an account?
4. Who buys, champions, evaluates, or blocks the sale, and what does each person care about?
5. What customer, metric, and narrative proof may agents use, how is it verified, and which claims are prohibited?
6. Why does the company win or lose, what alternatives appear, and what commercial, legal, security, or pricing boundaries must agents follow?

## Individual or founder-seller branch

7. What is the seller's role, responsibility, quota, deal size, sales cycle, methodology, strongest motion, and weakest habit?
8. What territory or account patch does the seller own, how is it prioritized, and where does the live account list reside?
9. How should the agent sound, treat buyers, use calls to action, and communicate uncertainty?
10. When should the agent stay curious, challenge respectfully, recommend action, or recommend not buying?
11. What objections does the seller hear, what do they usually mean, and how should the agent respond?
12. What is one piece of work the seller would send and one they would reject? What makes the difference?
13. What qualification, first-call, follow-up, and deal-management standards should the agent follow?
14. Which live systems should the file reference, what must stay out of the file, and what should trigger a refresh?

For a founder-seller, combine company and individual answers. Do not ask the same underlying question twice.

## Company sales team branch

7. Which roles, segments, regions, or motions must the shared context support, and where should they differ?
8. How are territories organized, tiered, assigned, reviewed, and referenced in the CRM or planning system?
9. What organization-wide messaging, outreach, first-call, qualification, and follow-up standards are approved?
10. Which behaviors show good judgment, and when should an agent remain curious, challenge, escalate, or recommend not buying?
11. Which objections recur across the team, what do they mean, and which approved responses and proof apply?
12. Show work the company would approve and reject. Which standards explain the difference?
13. Who approves company context, proof, pricing, policy, and methodology changes, and how should role-specific variation be handled?
14. Which live systems should the file reference, what must remain in those systems, and what cadence or events should trigger a refresh?

For company mode, capture shared standards and allowed variation. Do not infer that every seller has one personal voice or taste.

## Source-assisted rules

Before reading any source, name what is accessible and ask the user to authorize the source and review period.

When authorized:

- Prefer a recent, representative sample over scanning everything.
- Infer personal voice only from work the individual authored, sent, edited, rejected, reused, or approved.
- Infer company standards from approved company material and repeated team-level evidence, not one person's habits.
- Use incoming buyer content for buyer language and deal context only.
- Record evidence type, count, recency, and confidence when practical.
- Distill patterns rather than copying raw emails, transcripts, customer names, personal information, or unnecessary confidential details.
- Exclude personal, HR, medical, legal, security, and unrelated private content unless the user includes it for a defined reason.

For every proposed answer, show the answer and supporting pattern, then ask the user to confirm, correct, or remove it.

## Reconciliation gate

Before generating the file:

1. Ask only necessary gap questions.
2. Show conflicts between approved company rules, declared standards, and observed behavior.
3. Present the most important inferred patterns.
4. Ask the user to confirm, correct, or remove them.
5. Generate the file only after this gate.

## Output rules

- Produce one file named `SELLER.md`.
- Follow `assets/SELLER.md` without removing required top-level sections.
- Set `Context mode` to individual seller, founder-seller, company sales team, or combined.
- Mark irrelevant subsections `Not applicable`; do not create additional context files.
- Record creation method, authorized sources, review period, exclusions, confidence, gaps, confirmation date, and refresh information.
- Separate observed patterns, declared standards, and confirmed rules.
- Preserve `[fill in]` for unresolved relevant fields.
- Never invent customers, metrics, competitors, pricing, buyer pain, product capabilities, or proof.
- Keep live accounts, opportunities, activity, and approvals in source systems; reference them from `SELLER.md` rather than copying volatile state.
