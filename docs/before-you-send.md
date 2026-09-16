# Before You Send

## Scope

A free, English-language writing checker at `/before-you-send/`. The standalone black page has one draft field, no settings panel, an original editorial illustration, and links to the homepage's AI compiler (`/#generate`) and manual builder (`/#build`). The old homepage `#before-you-send` fragment redirects here with JavaScript. Serve the project through HTTP for root-relative links.

Same exact text, settings, and rules version produce the same findings. Determinism does not establish correctness. These are email-originated heuristics, not a validated measure of LinkedIn performance. This is a review aid, not AI-authorship detection, semantic fact checking, confidentiality screening, or approval to send.

No accounts, model calls, text uploads, analytics events containing drafts, browser storage, or automatic rewrites. State is in memory and the form only. Reloading or Clear removes the session's draft and findings. Copy findings intentionally puts quoted draft text on the clipboard; users are warned to review it before sharing. A browser's own extensions or clipboard synchronization are outside this tool's control.

## Current rules: 1.2.0

The public page uses fixed `maxWords: null` and `style: 'structure'`: no total-draft word budget or personal phrase preferences. Common structure checks run automatically, with plain-language explanations and permission to keep intentional rhetoric. The engine retains optional settings for programmatic consumers, but these are not exposed as a “Your standards” panel.

- Literal dictionaries for filler/hype and vague phrases. Case-insensitive, Unicode word-boundary checks; whitespace variations match. Exact dictionaries live in `assets/send-check-core.js`.
- Sentences over 30 words; paragraphs over 80 words. Sentence boundaries are punctuation followed by whitespace/end, or newlines. Abbreviations, quoted messages, and unusual formatting can trigger misleading findings.
- Three-word sequences occurring at least three times. The second occurrence is flagged; overlapping repeated sequences are reduced. Necessary product language may legitimately repeat.
- Percentage expressions, guarantees, risk-free language, and selected customer-result phrases request evidence review. They are not labeled false or unsupported; even sourced claims may trigger. Directly negated guarantees are skipped. No external sources are fetched.
- Engine-only word budget: 150 when omitted, configurable from 20 to 2,000, or disabled with `null` (the public page default). This is a preference, not an empirically established optimum.
- Up to 20 explicitly supplied banned phrases, 100 characters each. Literal, not user-authored regex. No automatic SELLER.md parsing or inference.
- Optional next-step rules: common meeting-request phrases, or exactly one question mark. These cannot understand buyer intent, multiple requests inside one sentence, or all possible meeting asks.

### Writing patterns and optional engine preset

Adapted from the user's local `linkedin-posts` skill: its structures, contrast-trap guidance, and deliberate-rhythm exception. Public `structure` mode enables stacked openings, negation reversals, and short rhetorical transitions. The engine-only `linkedin` preset additionally enables personal phrase preferences. The skill itself and its personal analytics/examples are not published or bundled. These are review heuristics, not a validated AI detector.

- Three or more adjacent clauses beginning with the same word trigger a stacked-opening flag. Clauses split on commas, semicolons, sentence punctuation, and newlines; each needs at least two words. Leading bullets and a conjunction before the repeated opener are tolerated. This is a narrow anaphora/parallelism approximation, not a semantic classifier.
- The engine's `allowRhythm` option skips only that check. Other repetition rules remain active. The public page instead explains that deliberate repetition can be kept, without a setting to configure.
- Common “it is not X / it is Y” and “this isn't X / it's Y” frames trigger a contrast-style flag. Detection is bounded and does not cover all grammatical equivalents. Necessary factual corrections may use this pattern.
- Public mode flags selected short rhetorical transitions. The additional `linkedin` preset flags stock setup phrases, a first-word “Most” hook, the literal word “shift”, and a small interjection list. Literal contexts such as a work shift can be appropriate: these remain review flags, not automatic deletions.
- Personal lowercase, punctuation, hashtags, post length, timing, engagement statistics, and inferred authenticity are excluded. This is not a complete LinkedIn-post grader or automatic implementation of the entire skill.

No inference is made from an em dash alone, polished grammar, or author identity. No numerical quality score is produced. Zero findings is visibly labeled as not a quality guarantee. The fictional example's customer result is invented for demonstration, not approved evidence.

## Implementation contract

`assets/send-check-core.js` exports `assess({text, maxWords, cta, bannedPhrases, style, allowRhythm})` for Node and the browser. `style` defaults to `plain`; `structure` enables common pattern checks, and `linkedin` adds personal phrase preferences. `allowRhythm` defaults to false. `text` is limited to 20,000 UTF-16 code units. The result includes rules version, exact input/settings snapshot, word/character counts, total findings, truncation state, and at most 200 findings. Each finding has a rule ID, category, exact quote, explanation, suggested action, and UTF-16 start/end offsets (end exclusive). Whole-draft checks have null offsets. No time, randomness, locale-sensitive input transformation, or model output affects findings.

`assets/send-check-ui.js` renders input as text nodes, merges overlapping highlight ranges, supports locating quoted text in the editable draft, and invalidates results whenever the draft changes. It never interprets draft HTML. The result is not persisted or automatically fed into the builder. The homepage's compiler and manual creation flow remain separate and unchanged. Presentation is in `before-you-send/index.html` and `assets/before-you-send-page.css`.

## Validation and improvement

Run `node --test tests/*.test.cjs`. Coverage includes determinism, exact Unicode offsets, dictionary boundaries, regex metacharacters in custom rules, input/settings bounds, thresholds, opt-in CTA checks, evidence wording, empty results, truncation, fixed public mode, and standalone-page links. Browser checks cover example assessment, edit invalidation, literal HTML rendering, empty input, clearing, both creation links, and desktop/mobile layout.

For improvements, collect voluntarily shared, redacted examples—not silent draft telemetry. Ask sellers which individual flags are useful and which are false positives. Add fixtures before changing rules, increment VERSION for any behavior change, and update the on-page method description. Keep a frozen regression set including clear emails, legitimate technical terms, supported metrics, quotations, and different English writing styles. Validate usefulness before expanding beyond email or introducing a combined score.
