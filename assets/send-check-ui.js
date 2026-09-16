(function () {
  'use strict';
  const section = document.querySelector('#before-you-send');
  if (!section || !window.BeforeYouSend) return;
  const find = name => section.querySelector(`[data-send="${name}"]`);
  let report = null;
  const sample = 'Hi Priya,\n\nI hope this email finds you well. Our game-changing platform can unlock value and drive growth. Our customers saved 35% on onboarding costs. Could we schedule a quick demo?\n\nAlex';
  find('interactive').hidden = false;
  function invalidate() {
    report = null; find('results').hidden = true; find('findings').replaceChildren(); find('annotated').replaceChildren();
    find('status').textContent = 'Draft changed. Check again when you are ready.';
  }
  find('form').addEventListener('input', invalidate);
  find('form').addEventListener('change', invalidate);
  find('example').addEventListener('click', () => { invalidate(); find('draft').value = sample; find('status').textContent = 'Fictional example loaded. Its customer result is invented for this demonstration, not approved proof.'; find('draft').focus(); });
  find('clear').addEventListener('click', () => { find('form').reset(); invalidate(); find('status').textContent = 'Draft and feedback cleared.'; find('draft').focus(); });
  find('form').addEventListener('submit', event => {
    event.preventDefault(); invalidate();
    try {
      report = window.BeforeYouSend.assess({text: find('draft').value, maxWords: null, style: 'structure'});
      find('summary').textContent = report.totalFindings ? `${report.totalFindings} ${report.totalFindings === 1 ? 'thing' : 'things'} to review` : 'Nothing obvious to flag';
      find('stats').textContent = `${report.wordCount} words checked · Suggestions, not a verdict`;
      find('empty').hidden = report.totalFindings !== 0;
      find('truncated').hidden = !report.truncated;
      for (const f of report.findings) {
        const li = document.createElement('li');
        const label = document.createElement('span'); label.className = 'send-category'; label.textContent = f.category;
        const quote = document.createElement('blockquote'); quote.textContent = f.quote || 'Whole draft';
        const why = document.createElement('p'); why.textContent = f.explanation;
        const action = document.createElement('p'); const strong = document.createElement('strong'); strong.textContent = 'Try: '; action.append(strong, document.createTextNode(f.suggestion));
        li.append(label, quote, why, action);
        if (f.start !== null) {
          const button = document.createElement('button'); button.type = 'button'; button.className = 'send-locate'; button.textContent = 'Find in my draft';
          button.addEventListener('click', () => { find('draft').focus(); find('draft').setSelectionRange(f.start, f.end); }); li.append(button);
        }
        find('findings').append(li);
      }
      // Merge overlapping ranges, keeping all untrusted text in text nodes.
      const ranges = report.findings.filter(f => f.start !== null).map(f => [f.start, f.end]).sort((a,b) => a[0]-b[0]);
      const merged = [];
      for (const range of ranges) {
        const last = merged[merged.length - 1];
        if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]); else merged.push([...range]);
      }
      let cursor = 0;
      for (const [start, end] of merged) {
        find('annotated').append(document.createTextNode(report.input.text.slice(cursor, start)));
        const mark = document.createElement('mark'); mark.textContent = report.input.text.slice(start, end); find('annotated').append(mark); cursor = end;
      }
      find('annotated').append(document.createTextNode(report.input.text.slice(cursor)));
      find('results').hidden = false;
      find('status').textContent = 'Checked. Review the suggestions below, then edit your draft above.';
      find('summary').focus();
    } catch (error) {
      report = null; find('status').textContent = error.message;
      find('draft').focus();
    }
  });
  find('copy').addEventListener('click', async () => {
    if (!report) return;
    const text = [`Before You Send · Rules v${report.version}`, `${report.wordCount} words · ${report.totalFindings} flags${report.truncated ? ' (showing first 200)' : ''}`, 'Heuristic review only. Not AI detection, fact checking, or approval to send.', ...report.findings.map(f => `\n${f.category}: ${f.quote || 'Whole draft'}\n${f.explanation}\nTry: ${f.suggestion}`)].join('\n');
    try { await navigator.clipboard.writeText(text); find('status').textContent = 'Findings copied, including quoted draft text. Review before sharing.'; }
    catch { find('status').textContent = 'Clipboard unavailable. Select and copy the findings below.'; }
  });
})();
