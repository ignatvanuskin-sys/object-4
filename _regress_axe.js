(async () => {
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve(true);
      s.onerror = () => reject(new Error('failed to load ' + src));
      document.head.appendChild(s);
    });
  }
  if (!window.axe) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js');
  }
  const results = await window.axe.run(document, { resultTypes: ['violations'] });
  const out = results.violations.map(v => ({
    impact: v.impact,
    id: v.id,
    nodes: v.nodes.length,
    targets: v.nodes.slice(0, 6).map(n => (n.target || []).join(' '))
  }));
  return { __result: { violationCount: results.violations.length, violations: out } };
})()
