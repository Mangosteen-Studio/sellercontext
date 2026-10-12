const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const compiler = require('../assets/compiler-core.js');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

test('draft and interview have explicit modes with the same versioned protocol', () => {
  assert.equal(compiler.VERSION, '2.0.0');
  assert.ok(compiler.getPrompt().startsWith('MODE: DRAFT FIRST.'));
  assert.ok(compiler.getPrompt('interview').startsWith('MODE: INTERVIEW.'));
  for (const mode of ['draft', 'interview']) assert.ok(compiler.getPrompt(mode).endsWith(compiler.protocol));
  assert.throws(() => compiler.getPrompt('manual'));
});
test('provider links preserve the selected prompt and Gemini uses paste fallback', () => {
  for (const mode of ['draft', 'interview']) {
    for (const provider of ['ChatGPT', 'Claude']) {
      assert.equal(new URL(compiler.launchUrl(provider, mode)).searchParams.get('q'), compiler.getPrompt(mode));
    }
    assert.equal(compiler.launchUrl('Gemini', mode), 'https://gemini.google.com/app');
  }
  assert.throws(() => compiler.launchUrl('unknown'));
});
test('website, assistant instructions and installable skill share one protocol', () => {
  for (const file of ['assistants/instructions.md', 'skills/seller-context/references/interview-contract.md']) {
    assert.ok(read(file).includes(compiler.protocol), file);
  }
  assert.equal(read('SELLER.md'), read('skills/seller-context/assets/SELLER.md'));
  const home = read('index.html');
  for (const mode of ['draft', 'interview']) assert.ok(home.includes(`data-compiler-mode="${mode}"`));
  assert.doesNotMatch(home, /id="build"|id="contextForm"|sellerInterviewPrompt|function generateMarkdown|id="review"/);
});

function boot({clipboardFails = false, fallbackWorks = false, hash = ''} = {}) {
  const copies = [], replacements = [], removed = [];
  const sections = ['draft', 'interview'].map(mode => {
    const nodes = Object.fromEntries(['status', 'preview', 'copy'].map(key => [key, {textContent: '', addEventListener(_, fn) {this.click = fn;}}]));
    const details = {open: false};
    const links = ['ChatGPT', 'Claude', 'Gemini'].map(ai => ({dataset: {ai}, addEventListener(_, fn) {this.click = fn;}}));
    return {dataset: {compilerMode: mode}, nodes, details, links,
      querySelector(selector) {return selector === 'details' ? details : nodes[selector.match(/compiler-(\w+)/)[1]];},
      querySelectorAll() {return links;}};
  });
  let hashHandler;
  const document = {
    querySelectorAll: () => sections, querySelector: () => null,
    body: {append() {}},
    createElement: () => ({style: {}, select() {}, remove() {removed.push(true);}}),
    execCommand: () => fallbackWorks
  };
  const window = {SellerCompiler: compiler, isSecureContext: true,
    location: {hash, replace(value) {replacements.push(value);}},
    addEventListener(_, fn) {hashHandler = fn;}};
  vm.runInNewContext(read('assets/compiler-ui.js'), {window, document,
    navigator: {clipboard: {async writeText(text) {if (clipboardFails) throw Error('denied'); copies.push(text);}}}});
  return {sections, copies, replacements, removed, window, hashHandler};
}
test('both copy buttons and provider links use their own selected mode', async () => {
  const ui = boot();
  for (const section of ui.sections) {
    const prompt = compiler.getPrompt(section.dataset.compilerMode);
    assert.equal(section.nodes.preview.textContent, prompt);
    await section.nodes.copy.click();
    assert.equal(ui.copies.at(-1), prompt);
    assert.match(section.nodes.status.textContent, /Copied/);
    for (const link of section.links) assert.equal(link.href, compiler.launchUrl(link.dataset.ai, section.dataset.compilerMode));
    section.links[2].click();
    await new Promise(resolve => setImmediate(resolve));
    assert.match(section.nodes.status.textContent, /Paste it into Gemini/);
  }
});
test('clipboard denial opens selectable prompt, while legacy copy fallback succeeds', async () => {
  const ui = boot({clipboardFails: true});
  await ui.sections[0].nodes.copy.click();
  assert.equal(ui.sections[0].details.open, true);
  assert.match(ui.sections[0].nodes.status.textContent, /Clipboard unavailable/);
  assert.equal(ui.removed.length, 1);
  const fallback = boot({clipboardFails: true, fallbackWorks: true});
  await fallback.sections[1].nodes.copy.click();
  assert.match(fallback.sections[1].nodes.status.textContent, /Copied/);
});
test('old builder links route to interview and checker bookmarks remain valid', () => {
  assert.deepEqual(boot({hash: '#build'}).replacements, ['#interview']);
  const ui = boot();
  ui.window.location.hash = '#before-you-send'; ui.hashHandler();
  assert.deepEqual(ui.replacements, ['/before-you-send/']);
});
