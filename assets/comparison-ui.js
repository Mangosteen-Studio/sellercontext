(function () {
  "use strict";
  const engine = window.SellerComparison;
  const section = document.getElementById("compare");
  if (!engine || !section) return;
  const find = (name) => section.querySelector(`[data-comparison="${name}"]`);
  const sample = engine.example;
  find("brief").textContent = sample.brief;
  find("context").textContent = sample.context;
  find("provenance").textContent = sample.provenance;
  for (const variant of ["baseline", "contextual"]) {
    for (const block of sample.outputs[variant].blocks) {
      const element = document.createElement("p");
      element.textContent = block.type === "subject" ? `Subject: ${block.text}` : block.text;
      if (block.type === "subject") element.className = "comparison-subject";
      find(variant).append(element);
    }
  }
  for (const change of sample.changes) {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    const explanation = document.createElement("p");
    const source = document.createElement("span");
    title.textContent = change.title;
    explanation.textContent = change.reason;
    source.textContent = `From SELLER.md → ${change.source}`;
    source.className = "comparison-source";
    item.append(title, explanation, source);
    find("changes").append(item);
  }

  let run = null;
  let uploadVersion = 0;
  function invalidate() {
    run = null;
    find("prompts").hidden = true;
    find("status").textContent = "";
  }
  for (const name of ["own-brief", "own-context"]) {
    find(name).addEventListener("input", () => { uploadVersion += 1; invalidate(); });
  }
  find("file").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const version = ++uploadVersion;
    invalidate();
    try {
      if (file.size > 240000) throw new Error("Choose a Markdown or text file smaller than 240 KB.");
      if (!/\.(md|txt|markdown)$/i.test(file.name)) throw new Error("Choose a .md, .markdown, or .txt file.");
      const context = await file.text();
      if (version !== uploadVersion) return;
      if (!context.trim() || context.includes("\u0000") || context.length > 60000) throw new Error("Choose a non-empty text file under 60,000 characters.");
      find("own-context").value = context;
      find("status").textContent = "SELLER.md loaded locally. Review it below before preparing prompts.";
    } catch (error) {
      if (version === uploadVersion) find("status").textContent = error.message;
    } finally { event.target.value = ""; }
  });
  find("sample").addEventListener("click", () => {
    uploadVersion += 1;
    invalidate();
    find("own-brief").value = sample.brief;
    find("own-context").value = sample.context;
    find("status").textContent = "Example brief and context loaded.";
  });
  find("form").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      run = engine.createRun({ brief: find("own-brief").value, context: find("own-context").value });
      find("baseline-prompt").textContent = run.prompts.baseline;
      find("contextual-prompt").textContent = run.prompts.contextual;
      find("prompts").hidden = false;
      find("status").textContent = "Two prompts ready. Run each in a separate fresh chat using the same model and settings, with memory and connected sources disabled.";
    } catch (error) { find("status").textContent = error.message; }
  });
  for (const variant of ["baseline", "contextual"]) {
    find(`copy-${variant}`).addEventListener("click", async () => {
      if (!run) return;
      try {
        await navigator.clipboard.writeText(run.prompts[variant]);
        find("status").textContent = `${variant === "baseline" ? "Without-context" : "With-context"} prompt copied. Paste it into a fresh AI chat.`;
      } catch {
        find("status").textContent = "Clipboard unavailable. Select and copy the prompt below, or download the comparison pack.";
      }
    });
  }
  find("download").addEventListener("click", () => {
    if (!run) return;
    const blob = new Blob([JSON.stringify(run, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "seller-context-comparison.json";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    find("status").textContent = "Comparison pack downloaded. It includes your brief and SELLER.md; review it before sharing.";
  });
  find("interactive").hidden = false;
})();
