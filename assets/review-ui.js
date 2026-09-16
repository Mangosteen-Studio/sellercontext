(function () {
  "use strict";
  const section = document.getElementById("review");
  const engine = window.SellerReview;
  if (!section || !engine) return;
  const find = name => section.querySelector(`[data-review="${name}"]`);
  let review = null;
  let source = "own";
  function invalidate() {
    review = null;
    find("result").hidden = true;
    find("acknowledge").checked = false;
    find("status").textContent = "Review inputs changed. Record the review again to confirm this version.";
  }
  find("form").addEventListener("input", invalidate);
  find("form").addEventListener("change", invalidate);
  find("reuse").addEventListener("change", () => {
    find("rule-fields").hidden = !find("reuse").checked;
    find("rule-fields").disabled = !find("reuse").checked;
    if (find("reuse").checked && !find("context").value.trim()) find("context-details").open = true;
  });

  function load(nextSource) {
    find("form").reset();
    invalidate();
    source = nextSource;
    find("rule-fields").hidden = true;
    find("rule-fields").disabled = true;
    find("editor").open = true;
    if (source === "own") {
      find("original").value = "";
      find("brief").value = document.querySelector('[data-comparison="own-brief"]').value;
      find("context").value = document.querySelector('[data-comparison="own-context"]').value;
      find("source").textContent = "Your AI draft. Buyer brief and SELLER.md were copied from your current comparison inputs; review those details if this draft came from a different task.";
    } else {
      const sample = window.SellerComparison.example;
      const variant = source === "example-baseline" ? "baseline" : "contextual";
      find("original").value = sample.outputs[variant].blocks.map(block => block.type === "subject" ? `Subject: ${block.text}` : block.text).join("\n\n");
      find("brief").value = sample.brief;
      find("context").value = sample.context;
      find("source").textContent = `${variant === "baseline" ? "Without-context" : "With-context"} example. Fictional and hand-written; this is a practice review. Loading another source replaces the current review form.`;
    }
    find("status").textContent = "Draft selected. Add your edits or reasoning, then choose the next step.";
    find("original").focus();
  }
  for (const name of ["example-baseline", "example-contextual", "own"]) find(name).addEventListener("click", () => load(name));

  function render() {
    find("result").hidden = false;
    const ready = review.decision === "ready";
    find("outcome").textContent = engine.decisions[review.decision];
    find("reason-summary").textContent = `Your reasoning: ${review.reason}`;
    find("copy-draft").hidden = !ready;
    find("copy-next").hidden = ready;
    find("copy-next").textContent = review.decision === "hold" ? "Copy clarification prompt" : "Copy revision prompt";
    find("preview-label").textContent = ready ? "See the version you approved" : review.decision === "hold" ? "See the clarification prompt" : "See the revision prompt";
    find("preview").textContent = ready ? engine.approvedDraft(review) : engine.nextPrompt(review);
    find("proposal").hidden = !review.proposal;
    if (review.proposal) {
      const proposal = review.proposal;
      find("proposal-text").textContent = `Rule\n${proposal.rule}\n\nApplies when\n${proposal.appliesWhen}\n\nExceptions and questions\n${proposal.exceptions}`;
      find("proposal-status").textContent = {
        proposed: "Proposed only. This rule has not been added to SELLER.md.",
        approved: "Approved by you. The updated file is ready to download; your agent workspace has not been changed.",
        rejected: "Kept in this review only. Your SELLER.md is unchanged."
      }[proposal.status];
      find("approval-controls").hidden = proposal.status !== "proposed";
      find("context-export").hidden = proposal.status !== "approved";
      find("updated-context").textContent = proposal.status === "approved" ? engine.updatedContext(review) : "";
    }
  }
  find("form").addEventListener("submit", event => {
    event.preventDefault();
    try {
      review = engine.createReview({
        source, original: find("original").value, revised: find("revised").value,
        brief: find("brief").value, context: find("context").value,
        reason: find("reason").value, decision: find("decision").value,
        checks: Object.fromEntries(["facts", "judgment", "nextStep"].map(key => [key, find(key).checked])),
        proposeRule: find("reuse").checked, rule: find("rule").value,
        appliesWhen: find("appliesWhen").value, exceptions: find("exceptions").value
      });
      find("acknowledge").checked = false;
      render();
      find("status").textContent = "Review recorded for this session. Nothing has been sent or changed in your agent workspace.";
    } catch (error) {
      review = null;
      find("result").hidden = true;
      if (error.message.includes("SELLER.md")) find("context-details").open = true;
      find("status").textContent = error.message;
    }
  });
  for (const [button, decision] of [["approve", "approved"], ["reject", "rejected"]]) {
    find(button).addEventListener("click", () => {
      if (!review) return;
      try {
        review = engine.decideProposal(review, decision, find("acknowledge").checked);
        render();
        find("status").textContent = decision === "approved" ? "Rule approved. Download the updated SELLER.md to use it in future tasks." : "Feedback stays in this review only.";
      } catch (error) { find("status").textContent = error.message; }
    });
  }
  async function copy(value) {
    try {
      await navigator.clipboard.writeText(value);
      find("status").textContent = "Copied. Review the text before sharing it with a buyer or AI.";
    } catch { find("status").textContent = "Clipboard unavailable. Select the text in the preview, or download the review."; }
  }
  find("copy-draft").addEventListener("click", () => { if (review) copy(engine.approvedDraft(review)); });
  find("copy-next").addEventListener("click", () => { if (review) copy(engine.nextPrompt(review)); });
  function download(name, value, type) {
    const url = URL.createObjectURL(new Blob([value], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  find("download").addEventListener("click", () => {
    if (!review) return;
    download("seller-context-review.json", JSON.stringify(review, null, 2), "application/json");
    find("status").textContent = "Review downloaded, including the original, edits, reasoning, brief, and context. Check it before sharing.";
  });
  find("download-context").addEventListener("click", () => {
    if (!review) return;
    try {
      download("SELLER.md", engine.updatedContext(review), "text/markdown;charset=utf-8");
      find("status").textContent = "Updated SELLER.md downloaded. Replace the context file in your agent workspace to apply the approved rule.";
    } catch (error) { find("status").textContent = error.message; }
  });
})();
