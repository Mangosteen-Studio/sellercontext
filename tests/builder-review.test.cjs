const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const start = html.indexOf('    function questionCoverage()');
const end = html.indexOf('    async function render()', start);
assert.ok(start > 0 && end > start);
function build(values) {
  return vm.runInNewContext(html.slice(start, end) + '\ngenerateMarkdown();', {
    form: {},
    FormData: class { get(name) { return values[name] || ''; } },
    wizardSteps: Array.from({length: 14}, () => ({querySelector: () => ({value: ''})}))
  });
}
test('manual output standards become part of the same SELLER.md', () => {
  const standard = 'Ask about workflow first. Applies to first touch; use confirmed buyer pain when available.';
  const md = build({qualityBar: standard});
  assert.ok(md.startsWith('# SELLER.md'));
  assert.ok(md.includes('### Owner-Declared Output Standards'));
  assert.ok(md.includes(standard));
  assert.match(md, /not independently verified buyer evidence/);
});
test('skipped standards stay missing rather than becoming inferred rules', () => {
  const md = build({});
  assert.match(md, /### Owner-Declared Output Standards[\s\S]*?\[fill in\]/);
});
test('review is inside the builder and compiler rather than a standalone page tool', () => {
  assert.ok(!html.includes('id="review"'));
  assert.ok(!html.includes('<script src="assets/review-ui.js"'));
  assert.match(html, /for="qualityBar">What would you change—and why\?/);
  const prompt = html.slice(html.indexOf('const sellerInterviewPrompt'), html.indexOf('const aiDeepLinks'));
  assert.match(prompt, /part of this interview, not a separate tool or task/);
  assert.match(prompt, /get my approval before adding it/);
  assert.match(prompt, /within the 14-question limit/);
});
