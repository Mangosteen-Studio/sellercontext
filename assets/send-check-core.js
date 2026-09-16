(function (root) {
  'use strict';
  const VERSION = '1.2.0';
  const LIMIT = 20000;
  const wordPattern = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;
  const words = text => [...text.matchAll(wordPattern)];
  const definitions = [
    ['filler', 'Filler', ['hope this email finds you well', 'just reaching out', 'I wanted to reach out', 'at the end of the day', "in today's fast-paced world"], 'This stock phrase may delay the useful part of the email.', 'Start with the specific reason you are writing.'],
    ['hype', 'Filler', ['game-changing', 'revolutionary', 'best-in-class', 'cutting-edge', 'world-class'], 'This is a broad promotional description, not an explanation.', 'Replace it with a concrete capability or a substantiated distinction.'],
    ['vague', 'Vague language', ['unlock value', 'drive value', 'drive growth', 'streamline your operations', 'take your business to the next level', 'seamless integration'], 'This phrase does not itself explain what changes for the buyer.', 'Name the workflow, outcome, or integration constraints. Keep it if nearby detail already explains it.']
  ];
  const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function literalMatches(text, phrase) {
    const regex = new RegExp(escape(phrase).replace(/\s+/g, '\\s+'), 'giu');
    return [...text.matchAll(regex)].filter(m => {
      const before = text.slice(Math.max(0, m.index - 2), m.index);
      const after = text.slice(m.index + m[0].length, m.index + m[0].length + 2);
      return !(/[\p{L}\p{N}_]$/u.test(before) && /^[\p{L}\p{N}_]/u.test(m[0])) &&
        !(/^[\p{L}\p{N}_]/u.test(after) && /[\p{L}\p{N}_]$/u.test(m[0]));
    });
  }
  function assess(input) {
    const text = input.text;
    if (typeof text !== 'string' || !text.trim()) throw new Error('Paste your draft above, then check it.');
    if (text.length > LIMIT) throw new Error('Keep the draft under 20,000 characters.');
    const maxWords = input.maxWords === null ? null : input.maxWords === undefined ? 150 : Number(input.maxWords);
    if (maxWords !== null && (!Number.isInteger(maxWords) || maxWords < 20 || maxWords > 2000)) throw new Error('Choose a word budget between 20 and 2,000.');
    const cta = input.cta || 'any';
    if (!['any', 'no-meeting', 'one-question'].includes(cta)) throw new Error('Choose a supported next-step rule.');
    const style = input.style || 'plain';
    if (!['plain', 'linkedin', 'structure'].includes(style)) throw new Error('Choose a supported writing-style preset.');
    const allowRhythm = input.allowRhythm === true;
    const banned = input.bannedPhrases || [];
    if (!Array.isArray(banned) || banned.length > 20 || banned.some(p => typeof p !== 'string' || !p.trim() || p.length > 100)) throw new Error('Use up to 20 banned phrases, each 1–100 characters.');
    const bannedPhrases = [...new Set(banned.map(p => p.trim().toLowerCase()))];
    const findings = [];
    const tokens = words(text);
    function add(ruleId, category, start, end, explanation, suggestion) {
      findings.push({ruleId, category, start, end, quote: start === null ? '' : text.slice(start, end), explanation, suggestion});
    }
    for (const [id, category, phrases, why, action] of definitions) {
      for (const phrase of phrases) for (const m of literalMatches(text, phrase)) add(id, category, m.index, m.index + m[0].length, why, action);
    }
    for (const m of text.matchAll(/\b\d+(?:[.,]\d+)?[ \t]*(?:%|percent\b)/giu)) {
      add('numeric-claim', 'Evidence check', m.index, m.index + m[0].length, 'A percentage deserves a source and a clear baseline. This is not a finding that the number is false.', 'Check the source, date, sample, and permission to use it. It may already be supported.');
    }
    for (const m of text.matchAll(/\b(?:guarantee(?:d|s)?|risk[- ]free|customers? (?:saved|achieved|increased|reduced))\b/giu)) {
      if (/\b(?:not|never|no)\s+$/iu.test(text.slice(Math.max(0, m.index - 20), m.index))) continue;
      add('claim-language', 'Evidence check', m.index, m.index + m[0].length, 'This wording may make a promise or describe a customer result.', 'Verify the evidence and approved wording; qualify the conditions if needed.');
    }
    if (maxWords !== null && tokens.length > maxWords) add('word-budget', 'Your standards', null, null, `${tokens.length} words exceeds your ${maxWords}-word budget.`, 'Keep the buyer-specific point and next step; cut details that can wait.');
    let sentenceStart = 0;
    function checkSentence(end) {
      const part = text.slice(sentenceStart, end);
      const count = words(part).length;
      if (count > 30) {
        const start = sentenceStart + (part.match(/^\s*/) || [''])[0].length;
        add('long-sentence', 'Wordiness', start, end, `This sentence has ${count} words; the review threshold is 30.`, 'Consider splitting at the main change of idea. Long sentences are not automatically bad.');
      }
    }
    for (const m of text.matchAll(/[.!?]+(?=\s|$)|\n+/g)) { checkSentence(m.index + m[0].length); sentenceStart = m.index + m[0].length; }
    checkSentence(text.length);
    let cursor = 0;
    for (const paragraph of text.split(/\n\s*\n/)) {
      const start = text.indexOf(paragraph, cursor);
      cursor = start + paragraph.length;
      const count = words(paragraph).length;
      if (count > 80) add('dense-paragraph', 'Wordiness', start, cursor, `This paragraph has ${count} words; the review threshold is 80.`, 'Separate the context, useful detail, and request into short paragraphs.');
    }
    const triples = new Map();
    for (let i = 0; i + 2 < tokens.length; i++) {
      const start = tokens[i].index, end = tokens[i + 2].index + tokens[i + 2][0].length;
      const phrase = text.slice(start, end);
      if (/[.!?\n]/.test(phrase)) continue;
      const key = tokens.slice(i, i + 3).map(m => m[0].toLowerCase()).join(' ');
      const hits = triples.get(key) || [];
      hits.push({start, end}); triples.set(key, hits);
    }
    let repeatEnd = -1;
    for (const hits of triples.values()) if (hits.length >= 3 && hits[1].start >= repeatEnd) {
      const hit = hits[1]; repeatEnd = hit.end;
      add('repeated-phrase', 'Repetition', hit.start, hit.end, `This three-word phrase appears ${hits.length} times.`, 'Check whether each repetition adds meaning. Necessary product terms can repeat.');
    }
    for (const phrase of bannedPhrases) for (const m of literalMatches(text, phrase)) add('banned-phrase', 'Your standards', m.index, m.index + m[0].length, 'This matches a phrase you explicitly asked to avoid.', 'Remove or replace it, or change your rule if it does not apply here.');
    if (cta === 'no-meeting') for (const m of text.matchAll(/\b(?:book|schedule|arrange|set up|jump on|hop on)\s+(?:(?:a|an|the|quick|short|brief|15[- ]minute|30[- ]minute)\s+)*(?:call|demo|meeting)\b/giu)) {
      add('meeting-request', 'Your standards', m.index, m.index + m[0].length, 'This resembles a meeting request, which your selected rule avoids.', 'Ask a useful diagnostic question instead, if that fits this buyer.');
    }
    if (cta === 'one-question') {
      const questions = [...text.matchAll(/\?/g)];
      if (questions.length !== 1) add('question-count', 'Your standards', null, null, `Your rule asks for exactly one question mark; this draft has ${questions.length}.`, 'Keep one clear question. This punctuation check cannot determine whether it is a good CTA.');
    }
    if (style === 'linkedin' || style === 'structure') {
      const category = style === 'structure' ? 'Writing pattern' : 'Writing-style preference';
      if (style === 'linkedin') {
      for (const phrase of ["here's the thing", 'here’s the thing', 'here is the thing', 'shift', 'oh my god']) {
        for (const m of literalMatches(text, phrase)) add('style-stock-phrase', category, m.index, m.index + m[0].length, 'Your selected writing preset avoids this phrase. This is a style preference, not evidence of AI authorship.', 'State the concrete observation without the stock setup. Keep essential literal meanings if this preference is not appropriate.');
      }
      for (const m of text.matchAll(/\b(?:but here['’]s|but here is|i(?:['’]ve| have) seen (?:this|it)(?: (?:play out|happen|all the time))?|i see this (?:constantly|all the time))\b/giu)) {
        add('style-stock-setup', category, m.index, m.index + m[0].length, 'This is a stock setup avoided by the selected writing preset.', 'Lead with the specific event or observation you can substantiate. Do not invent a scene.');
      }
      const hook = text.match(/^\s*["“'‘]?(most)\b/iu);
      if (hook) {
        const start = hook.index + hook[0].toLowerCase().lastIndexOf('most');
        add('style-most-hook', category, start, start + 4, 'This preset avoids hooks that begin with “Most”.', 'Use a specific subject or observation instead of a broad claim about a group.');
      }
      }
      for (const m of text.matchAll(/(?:^|[.!?\n]\s*)(the\s+(?:reality|result|kicker)\s*\?)/giu)) {
        const start = m.index + m[0].lastIndexOf(m[1]);
        add('style-fragment-transition', category, start, start + m[1].length, 'A short rhetorical question is being used as a transition.', 'Connect the next sentence directly to the preceding idea. Genuine questions are fine.');
      }
      for (const m of text.matchAll(/\b(?:(?:it['’]s|it is|this is|that is)\s+not|(?:it|this|that)\s+isn['’]t)\s+[^.!?\n,;—]{1,120}[,.;—\n]\s*(?:it['’]s|it is|this is|that is)\s+[^.!?\n]{1,120}/giu)) {
        add('style-negation-reversal', category, m.index, m.index + m[0].length, 'This uses a familiar “not X, it is Y” contrast frame. Repeated contrasts can crowd out the explanation.', 'State the positive point directly. If the distinction matters, explain it once and move on; do not erase a necessary correction.');
      }
      if (!allowRhythm) {
        // Literal repeated openers across adjacent clauses, not a semantic rhetoric classifier.
        const clauses = [...text.matchAll(/[^,;.!?\n]+/gu)].map(m => {
          const listPrefix = (m[0].match(/^\s*(?:[-*•]|\d+[)])\s+/u) || [''])[0].length;
          const tokens = words(m[0].slice(listPrefix));
          if (tokens.length < 2) return null;
          const first = /^(?:and|or)$/iu.test(tokens[0][0]) && tokens.length > 2 ? 1 : 0;
          return {key: tokens[first][0].toLowerCase(), start: m.index + listPrefix + tokens[0].index, end: m.index + m[0].trimEnd().length};
        });
        for (let i = 0; i < clauses.length;) {
          if (!clauses[i]) { i++; continue; }
          let end = i + 1;
          while (end < clauses.length && clauses[end]?.key === clauses[i].key) end++;
          if (end - i >= 3) add('style-stacked-openers', category, clauses[i].start, clauses[end - 1].end, `${end - i} nearby phrases start with “${clauses[i].key}”. That repeated rhythm may be doing more work than the detail.`, style === 'structure' ? 'Combine the points or vary the openings. Keep the repetition if you chose it deliberately and each phrase adds something.' : 'Combine the points into one sentence or vary the openings. If the rhythm is intentional, enable “Allow deliberate repeated openings” to skip this check.');
          i = end;
        }
      }
    }
    findings.sort((a, b) => (a.start ?? text.length) - (b.start ?? text.length) || (a.ruleId < b.ruleId ? -1 : a.ruleId > b.ruleId ? 1 : 0) || (a.end ?? 0) - (b.end ?? 0));
    return {version: VERSION, input: {text, maxWords, cta, bannedPhrases, style, allowRhythm}, wordCount: tokens.length, characterCount: text.length, totalFindings: findings.length, truncated: findings.length > 200, findings: findings.slice(0, 200).map((f, i) => ({id: `${f.ruleId}-${i}`, ...f}))};
  }
  const api = {VERSION, LIMIT, assess};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BeforeYouSend = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
