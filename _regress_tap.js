(() => {
  const sel = 'a[href], button, input, select, textarea, [role="button"], [role="link"], [role="menuitem"], [tabindex]';
  const els = Array.from(document.querySelectorAll(sel));
  const small = [];
  let visible = 0;
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none' || parseFloat(style.opacity) === 0) continue;
    visible++;
    if (r.height < 44 || r.width < 44) {
      let text = (el.innerText || el.value || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().replace(/\s+/g, ' ').slice(0, 70);
      small.push({ tag: el.tagName.toLowerCase(), text, w: Math.round(r.width), h: Math.round(r.height) });
    }
  }
  return { __result: { totalMatches: els.length, visible: visible, smallCount: small.length, small } };
})()
