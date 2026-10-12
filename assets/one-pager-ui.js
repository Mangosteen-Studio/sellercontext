(function () {
  'use strict';
  const field = document.querySelector('#one-pager-prompt');
  const button = document.querySelector('#copy-one-pager');
  const status = document.querySelector('#prompt-status');
  if (!field || !button || !status) return;
  fetch('/prompts/one-pager.md').then(response => {
    if (!response.ok) throw new Error('Prompt unavailable');
    return response.text();
  }).then(text => { field.value = text; button.disabled = false; }).catch(() => {
    status.textContent = 'The prompt could not load. Use the download link below.';
  });
  button.addEventListener('click', async () => {
    try {
      try { await navigator.clipboard.writeText(field.value); }
      catch {
        document.querySelector('#prompt-details').open = true;
        field.focus(); field.select();
        if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
      }
      status.textContent = 'Copied. Paste into your AI with your SELLER.md. Review the draft before sending.';
    } catch {
      status.textContent = 'Copy is blocked. The prompt is selected below; copy it manually.';
    }
  });
  document.querySelector('#print-example').addEventListener('click', () => window.print());
})();
