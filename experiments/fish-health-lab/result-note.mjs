// A quiet line under every result (Jez, Nov 7 2026: add a notice, "not blatant and overpowering").
// Shop hosts (window.FHL_SHOP, e.g. thehiddenreef.net) also link their terms page.
export function RESULT_NOTE(win = globalThis) {
  return `<p class="result-note">Best-guess hobby information, not a diagnosis. Always follow the medicine label, and ask the store or an aquatic vet if you’re unsure.${win.FHL_SHOP ? ' <a href="/terms/">Terms of use</a>' : ''}</p>`;
}
