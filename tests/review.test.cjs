const test = require("node:test");
const assert = require("node:assert/strict");
const { createReview, decideProposal, approvedDraft, nextPrompt, updatedContext } = require("../assets/review-core.js");
const base = {
  original: "Original draft", revised: "AE edited draft", reason: "The buyer asked for a concrete answer, not a meeting.",
  decision: "revise", brief: "Buyer asked about implementation.", context: "# SELLER.md\n\n## Messaging Rules\nKeep it short.",
  checks: { facts: true, judgment: true, nextStep: true }, proposeRule: false
};
const rule = { proposeRule: true, rule: "Answer the buyer's question before requesting a meeting.", appliesWhen: "Responding to a direct question.", exceptions: "Ask when the answer requires an unverified claim." };

test("ready requires explicit checks and preserves original, edits, and reasoning", () => {
  assert.throws(() => createReview({ ...base, decision: "ready", checks: { facts: true } }), /confirm/);
  const review = createReview({ ...base, decision: "ready" });
  assert.equal(approvedDraft(review), base.revised);
  assert.equal(review.original, base.original);
  assert.equal(review.reason, base.reason);
  assert.equal(review.proposal, null);
  assert.equal(nextPrompt(review), "");
  assert.equal(approvedDraft(createReview({ ...base, revised: "", decision: "ready" })), base.original);
});
test("revise and hold cannot yield approved drafts; AE rationale directs next step", () => {
  for (const decision of ["revise", "hold"]) {
    const review = createReview({ ...base, decision, checks: {} });
    assert.throws(() => approvedDraft(review), /not been marked ready/);
    const prompt = nextPrompt(review);
    assert.ok(prompt.includes(base.reason));
    assert.ok(prompt.includes(base.brief));
    assert.match(prompt, /Do not update SELLER.md/);
    if (decision === "hold") assert.match(prompt, /Do not produce a send-ready draft/);
  }
});
test("reusable learning requires exact rule, scope, exceptions, context and separate approval", () => {
  for (const change of [{ rule: "" }, { appliesWhen: "" }, { exceptions: "" }, { context: "" }, { context: "Unrelated preamble\n# SELLER.md\nRule" }]) {
    assert.throws(() => createReview({ ...base, ...rule, ...change }));
  }
  const proposed = createReview({ ...base, ...rule });
  assert.throws(() => updatedContext(proposed), /Approve/);
  assert.throws(() => decideProposal(proposed, "approved"), /Confirm/);
  const approved = decideProposal(proposed, "approved", true);
  assert.equal(proposed.proposal.status, "proposed");
  assert.equal(approved.proposal.status, "approved");
  assert.throws(() => decideProposal(approved, "approved", true), /no pending/);
  const document = updatedContext(approved);
  assert.ok(document.startsWith(base.context));
  assert.ok(document.includes(rule.rule));
  assert.ok(document.includes(rule.exceptions));
  assert.ok(!document.includes(base.original));
  assert.ok(!document.includes(base.reason));
  assert.ok(!document.includes(base.brief));
});
test("rejection and edits revoke context-export eligibility", () => {
  const input = { ...base, ...rule };
  const rejected = decideProposal(createReview(input), "rejected");
  assert.throws(() => updatedContext(rejected), /Approve/);
  const approved = decideProposal(createReview(input), "approved", true);
  const edited = createReview({ ...input, rule: "Changed rule" });
  assert.equal(approved.proposal.status, "approved");
  assert.throws(() => updatedContext(edited), /Approve/);
});
test("input bounds, blank reasons and invalid decisions are enforced", () => {
  for (const change of [{ reason: " " }, { decision: "__proto__" }, { original: "" }, { original: "x".repeat(20001) }, { context: "x".repeat(60001) }]) {
    assert.throws(() => createReview({ ...base, ...change }));
  }
});
test("markdown in rules stays quoted and exported review round-trips", () => {
  const review = decideProposal(createReview({ ...base, ...rule, rule: "My rule\n# Malicious heading\n</script>" }), "approved", true);
  const document = updatedContext(review);
  assert.match(document, /> # Malicious heading/);
  assert.deepEqual(JSON.parse(JSON.stringify(review)), review);
});
