# Seller Context comparison foundation

## First release

The homepage presents a clearly labeled, fictional, hand-written outreach comparison before asking visitors to build a profile. Both sides share the exact same buyer and product facts. The baseline is a plausible email, not an intentionally false or broken output. Each explained change references a section of the example SELLER.md.

Visitors can paste a brief and paste or load their SELLER.md, preview two matched prompts, copy each, and download the run as JSON. No model API is called. No context is uploaded, persisted, or added to analytics by this feature. The downloaded pack does contain the visitor's context.

## Shared contract

`assets/comparison-core.js` owns the format registry, illustrative example, and pure `createRun({ format, brief, context })` function. It runs in the browser and Node without dependencies. `assets/comparison-ui.js` handles presentation and local files; `assets/comparison.css` scopes the layout.

Each comparison pack includes:

- `schemaVersion`: version of the comparison contract, initially 1.
- `format`: the artifact adapter, initially `outreach`.
- `brief`: identical task, buyer facts, source evidence, and constraints for both variants.
- `context`: the SELLER.md snapshot added only to the contextual variant.
- `prompts.baseline` and `prompts.contextual`: baseline text is an exact prefix of the contextual prompt.
- `criteria`: dimensions to review; outreach uses relevance, supported claims, voice, and next step.
- `outputs.baseline` and `outputs.contextual`: initially null for an unexecuted run. Examples use `{ blocks: [{ type, text }] }`.
- `generation`: provider, model, settings, and status; unset until an actual run occurs.

The example's provenance is explicit. Do not present these hand-written outputs as an actual measured test, reply-rate increase, or evidence that every model will improve. The visitor may prefer either output.

## Output standards inside context creation

The comparison demonstrates the effect of context; it does not contain a standalone AE review form. Standards are captured in the draft-first compiler, with an interview as the fallback. The website no longer has a manual questionnaire.

The compiler distinguishes observed patterns, declared preferences, supported company facts, and confirmed rules. It proposes exact wording, scope, and exceptions for inferred standards in the editable draft. The seller reviews the whole file rather than confirming every supported answer. If an important standard is unclear, the compiler asks what the seller would change in a redacted example and why. One-off feedback is not automatically a general rule, and skipping leaves a gap rather than inventing judgment.

The old review-core.js and review-ui.js prototype remains in source but is not loaded by the homepage. Its ready/revise/hold exports are not current website features. The website prompt, downloadable assistant instructions, and installable skill share the same draft-first protocol.

There is no API call, automatic learning, persistent storage, or automatic send. The compiler runs in the user's chosen external AI and depends on that AI following the prompt.

## Future slide support

Add a `slides` format adapter with a fixed slide count, the same brief on both sides, and criteria for narrative, buyer relevance, evidence, and recommended action. Extend the block vocabulary to `{ type: "slide", title, bullets, speakerNotes, sourceRefs }` while retaining the comparison envelope. Render each variant into the same deck template so design differences do not obscure the effect of context.

Sequence:

1. Outreach: side-by-side examples and matched prompt export (implemented).
2. Actual paired generation: provider adapter executes both prompts and stores outputs plus provider/model/settings, prompt version, context fingerprint, timestamps, and failures. Keep secrets server-side. Ask before uploading a visitor's context, cap spend, and allow deletion.
3. Review: output standards are proposed in the draft and confirmed during whole-file review, with targeted questions when needed. A separate review prototype remains off-page for potential future generation-linked workflows. Blind variant labels during formal evaluation; repeat runs to account for model variation. Keep a preference distinct from measured sales outcomes.
4. Slide outlines: compare narrative and evidence using the same paired generation contract.
5. Deck export: render the chosen outline to HTML preview and PPTX using a shared template. Resolve assets and sources before export.

For slides, retain the review's decision, reasoning, checks, and separately approved rule proposal. Add slide/block IDs to edits and evidence references instead of flattening a whole deck into an outreach text field. Make the criteria format-specific before enabling slide review.

Personal context remains one SELLER.md; this feature does not introduce additional required context files. Baseline and contextual generations should use separate sessions, the same model/settings and shared grounding sources, with personal memory and extra retrieval disabled. Facts in the brief override contradictory seller context.

## Validation

Run `node --test tests/*.test.cjs`. Checks cover matched prompts, draft/interview modes, provider links, clipboard fallbacks, shared compiler instructions, and the retained off-page review prototype. The website prepares prompts and gathers output standards within context creation; it does not generate model outputs or export slides.
