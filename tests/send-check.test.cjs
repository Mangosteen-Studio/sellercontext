const test = require('node:test');
const assert = require('node:assert/strict');
const { assess, VERSION } = require('../assets/send-check-core.js');
const fs = require('node:fs');
const path = require('node:path');

test('public mode catches structures without a personal standards panel or word budget', () => {
  const text = 'More reach. More leads. More wins. It is not volume, it is relevance. The reality? Most teams agree a shift takes work. ' + Array(160).fill('context').join(' ');
  const input = {text, maxWords: null, style: 'structure'};
  const r = assess(input);
  assert.deepEqual(r, assess(input));
  assert.equal(r.input.maxWords, null);
  for (const ruleId of ['style-stacked-openers', 'style-negation-reversal', 'style-fragment-transition']) {
    const f = r.findings.find(f => f.ruleId === ruleId);
    assert.ok(f, ruleId);
    assert.equal(text.slice(f.start, f.end), f.quote);
    assert.equal(f.category, 'Writing pattern');
  }
  assert.ok(!r.findings.some(f => ['word-budget', 'style-stock-phrase', 'style-stock-setup', 'style-most-hook'].includes(f.ruleId)));
  assert.ok(!r.findings.some(f => /preset|enable|Your standards/i.test(f.explanation + f.suggestion + f.category)));
  assert.ok(assess({text}).findings.some(f => f.ruleId === 'word-budget'));
});

test('standalone page has one draft field, local assets and both creation routes', () => {
  const root = path.join(__dirname, '..');
  const page = fs.readFileSync(path.join(root, 'before-you-send/index.html'), 'utf8');
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const ui = fs.readFileSync(path.join(root, 'assets/send-check-ui.js'), 'utf8');
  assert.equal((page.match(/<textarea\b/g) || []).length, 1);
  assert.doesNotMatch(page, /<select\b|<input\b|Your standards/);
  for (const id of ['generate', 'build']) {
    assert.ok(page.includes(`href="/#${id}"`));
    assert.ok(home.includes(`id="${id}"`));
  }
  assert.ok(home.includes('href="/before-you-send/"'));
  assert.ok(home.includes("window.location.hash === '#before-you-send'"));
  assert.doesNotMatch(home, /id="before-you-send"|src="assets\/send-check/);
  assert.ok(page.includes('href="https://sellercontext.com/before-you-send/"'));
  for (const match of page.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)) {
    assert.ok(fs.existsSync(path.join(root, match[1])), match[1]);
  }
  assert.match(ui, /maxWords: null, style: 'structure'/);
  assert.doesNotMatch(ui, /find\('(budget|style|banned|cta|rhythm)'\)/);
});
test('repeatable findings have exact offsets and no authorship score', () => {
  const input = {text: 'Hi Zoë 👋. Our game-changing platform will unlock value. Customers saved 35%.'};
  const a = assess(input);
  assert.deepEqual(a, assess(input)); assert.equal(a.version, VERSION);
  assert.ok(a.findings.length >= 4);
  for (const f of a.findings) if (f.start !== null) assert.equal(input.text.slice(f.start, f.end), f.quote);
  assert.equal(a.score, undefined); assert.equal(a.aiProbability, undefined);
});
test('literal matching is case insensitive, word bounded, whitespace tolerant, and regex safe', () => {
  const r = assess({text: 'SCATTER cat CAT. unlock\nvalue. a+b (.*)', bannedPhrases: ['cat','a+b','(.*)']});
  assert.deepEqual(r.findings.filter(f=>f.ruleId==='banned-phrase').map(f=>f.quote), ['cat','CAT','a+b','(.*)']);
  assert.ok(r.findings.some(f=>f.ruleId==='vague'));
});
test('empty, long, invalid settings and excessive custom rules fail safely', () => {
  for (const input of [{text:' '},{text:'x'.repeat(20001)},{text:'Hi',maxWords:''},{text:'Hi',maxWords:20.5},{text:'Hi',cta:'unknown'},{text:'Hi',bannedPhrases:['']},{text:'Hi',bannedPhrases:Array(21).fill('phrase')},{text:'Hi',bannedPhrases:['x'.repeat(101)]}]) assert.throws(()=>assess(input));
});
test('wordiness thresholds and question rules are explicit', () => {
  const text = Array(81).fill('word').join(' ')+'.';
  const ids = assess({text,maxWords:50,cta:'one-question'}).findings.map(f=>f.ruleId);
  for (const id of ['long-sentence','dense-paragraph','word-budget','question-count','repeated-phrase']) assert.ok(ids.includes(id),id);
  assert.ok(!assess({text:Array(30).fill('word').join(' ')}).findings.some(f=>f.ruleId==='long-sentence'));
});
test('custom CTA checks are opt in and benign drafts can have zero flags', () => {
  const text = 'Could we schedule a quick demo?';
  assert.equal(assess({text}).findings.length, 0);
  assert.ok(assess({text,cta:'no-meeting'}).findings.some(f=>f.ruleId==='meeting-request'));
  assert.equal(assess({text:'Which handoff is taking your managers the most time?',cta:'one-question'}).findings.length, 0);
});
test('evidence cues do not declare falsehood and negated guarantees are skipped', () => {
  const r = assess({text:'Results are not guaranteed. Revenue increased 20 percent (source: annual report).'});
  assert.ok(!r.findings.some(f=>f.ruleId==='claim-language'));
  const f = r.findings.find(f=>f.ruleId==='numeric-claim');
  assert.match(f.explanation,/not a finding.*false/);
});
test('report size is bounded and user markup stays literal data', () => {
  const r = assess({text:'<img src=x onerror=alert(1)> '+ 'drive value. '.repeat(300)});
  assert.equal(r.findings.length,200); assert.equal(r.truncated,true);
  assert.ok(r.totalFindings > 200);
  assert.ok(r.input.text.startsWith('<img'));
});
test('LinkedIn structure checks are opt-in and identify varied-word anaphora', () => {
  for (const text of ['higher targets, higher stakes, higher stress', 'no edits\nno switches\nno surprises', 'we need clarity. we need evidence. we need ownership.']) {
    assert.ok(!assess({text}).findings.some(f=>f.ruleId.startsWith('style-')));
    const r = assess({text,style:'linkedin'});
    const f = r.findings.find(f=>f.ruleId==='style-stacked-openers');
    assert.ok(f,text); assert.equal(text.slice(f.start,f.end),f.quote);
    assert.deepEqual(r, assess({text,style:'linkedin'}));
  }
});
test('stacking requires three adjacent clauses and respects deliberate rhythm', () => {
  for (const text of ['more clarity, more proof', 'more clarity. we need evidence. more ownership.', 'clear goals, honest evidence, useful questions']) {
    assert.ok(!assess({text,style:'linkedin'}).findings.some(f=>f.ruleId==='style-stacked-openers'));
  }
  const r = assess({text:'no edits, no switches, no surprises. Here’s the thing.',style:'linkedin',allowRhythm:true});
  assert.ok(!r.findings.some(f=>f.ruleId==='style-stacked-openers'));
  assert.ok(r.findings.some(f=>f.ruleId==='style-stock-phrase'));
  assert.equal(r.input.allowRhythm,true);
});
test('negation reversal flags common frames without flagging every negation', () => {
  for (const text of ["It's not just effort. It's ownership.", 'This isn’t about speed — it’s about trust.', "it's not volume, it's relevance"]) {
    assert.ok(assess({text,style:'linkedin'}).findings.some(f=>f.ruleId==='style-negation-reversal'),text);
  }
  assert.ok(!assess({text:"It's not verified yet. Can you check the source?",style:'linkedin'}).findings.some(f=>f.ruleId==='style-negation-reversal'));
});
test('writing preset detects hook, transition and stock setups without personal formatting rules', () => {
  const r = assess({text:"Most teams agree. But here's the kicker. I've seen this play out. The reality? A shift takes work.",style:'linkedin'});
  for (const id of ['style-most-hook','style-stock-setup','style-fragment-transition','style-stock-phrase']) assert.ok(r.findings.some(f=>f.ruleId===id),id);
  const clear = assess({text:'A Night Shiftworker Asked Most Teams For Evidence. #Sales',style:'linkedin'});
  assert.ok(!clear.findings.some(f=>f.ruleId.startsWith('style-')));
  assert.throws(()=>assess({text:'Hi',style:'unknown'}),/writing-style/);
});
