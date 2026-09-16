const test = require("node:test");
const assert = require("node:assert/strict");
const { createRun, example } = require("../assets/comparison-core.js");

test("paired prompts preserve buyer facts and isolate seller context", () => {
  const brief = 'Buyer said "no deck". Product: scheduling.\nNo ROI evidence.';
  const context = "PRIVATE-CONTEXT-MARKER: Ask one question.";
  const run = createRun({ brief, context });
  assert.ok(run.prompts.contextual.startsWith(run.prompts.baseline));
  assert.ok(run.prompts.baseline.includes(JSON.stringify(brief)));
  assert.ok(!run.prompts.baseline.includes("PRIVATE-CONTEXT-MARKER"));
  assert.ok(run.prompts.contextual.includes(JSON.stringify(context)));
  assert.equal(run.outputs.baseline, null);
  assert.equal(run.generation.status, "not-run");
  assert.deepEqual(JSON.parse(JSON.stringify(run)), run);
});

test("unknown format, empty input, and oversized context fail before export", () => {
  for (const values of [
    { format: "slides", brief: "brief", context: "context" },
    { format: "__proto__", brief: "brief", context: "context" },
    { brief: " ", context: "context" },
    { brief: "brief", context: "" },
    { brief: "brief", context: "x".repeat(60001) }
  ]) assert.throws(() => createRun(values));
});

test("examples retain provenance and use the shared artifact shape", () => {
  assert.match(example.provenance, /hand-written/);
  for (const output of Object.values(example.outputs)) {
    assert.equal(output.blocks[0].type, "subject");
    assert.ok(output.blocks.every(block => typeof block.text === "string"));
  }
  for (const change of example.changes) assert.ok(example.context.includes(`## ${change.source}`));
});
