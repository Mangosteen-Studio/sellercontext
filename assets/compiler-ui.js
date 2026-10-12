(function () {
  'use strict';
  if (!window.SellerCompiler) return;
  const compiler = window.SellerCompiler;
  async function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return; } catch {}
    }
    const field = document.createElement('textarea');
    field.value = text; field.style.position = 'fixed'; field.style.opacity = '0';
    document.body.append(field); field.select();
    const ok = document.execCommand('copy'); field.remove();
    if (!ok) throw new Error('Clipboard unavailable');
  }
  document.querySelectorAll('[data-compiler-mode]').forEach(section => {
    const mode = section.dataset.compilerMode;
    const prompt = compiler.getPrompt(mode);
    const status = section.querySelector('[data-compiler-status]');
    const preview = section.querySelector('[data-compiler-preview]');
    preview.textContent = prompt;
    section.querySelector('[data-compiler-copy]').addEventListener('click', async () => {
      try { await copy(prompt); status.textContent = 'Copied. Paste into the AI conversation or project with your sales context.'; }
      catch { status.textContent = 'Clipboard unavailable. Expand the prompt below and select its text to copy.'; section.querySelector('details').open = true; }
    });
    section.querySelectorAll('[data-ai]').forEach(link => {
      const provider = link.dataset.ai;
      link.href = compiler.launchUrl(provider, mode);
      // Navigate synchronously on the click to avoid popup blocking; copying is a backup,
      // never a reason to abandon the visible provider link.
      link.addEventListener('click', () => {
        copy(prompt).then(() => {
          status.textContent = provider === 'Gemini' ? 'Prompt copied. Paste it into Gemini.' : 'AI opened. If the prompt is missing, paste the copied prompt.';
        }).catch(() => {
          status.textContent = 'AI opened, but copying failed. Expand the prompt below and copy it manually.';
          section.querySelector('details').open = true;
        });
      });
    });
  });
  const preview = document.querySelector('#preview');
  if (preview) {
    fetch('./examples/deadaccount-founder/SELLER.md').then(response => {
      if (!response.ok) throw new Error('Example unavailable');
      return response.text();
    }).then(text => { preview.textContent = text; }).catch(() => {
      preview.textContent = 'The example could not be loaded. Use the example download link below.';
    });
  }
  function legacyRoutes() {
    if (window.location.hash === '#before-you-send') window.location.replace('/before-you-send/');
    if (window.location.hash === '#build') {
      window.location.replace('#interview');
    }
  }
  window.addEventListener('hashchange', legacyRoutes);
  legacyRoutes();
})();
