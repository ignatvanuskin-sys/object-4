(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const sec = document.getElementById('contacts');
  const nameEl = document.getElementById('bf-name');
  const btn = sec.querySelector('button[type=submit]');
  const setVal = (el, val) => {
    const proto = window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };
  const read = (el) => {
    const cs = getComputedStyle(el);
    return { bbc: cs.borderBottomColor, bbw: cs.borderBottomWidth, bbs: cs.borderBottomStyle, outline: cs.outlineColor + ' ' + cs.outlineWidth, shadow: cs.boxShadow.slice(0, 60), color: cs.color };
  };
  setVal(nameEl, '');
  const before = { name: read(nameEl), parent: read(nameEl.parentElement) };
  btn.click();
  await sleep(600);
  const after = { name: read(nameEl), parent: read(nameEl.parentElement) };
  // full body text for success/status search
  const bodyTxt = document.body.innerText.replace(/\s+/g, ' ');
  const statusEls = Array.from(document.querySelectorAll('[role=status],[role=alert],[aria-live]')).map(e => ({ role: e.getAttribute('role') || 'live', txt: (e.innerText || '').trim().slice(0, 120) }));
  const successHit = /спасибо|успешн|отправлен|свяжемся|принят|готово|ошибк/i.test(bodyTxt);
  const snippet = bodyTxt.slice(0, 0);
  return { __result: { before, after, nameInvalid: nameEl.getAttribute('aria-invalid'), statusEls, successHit, secLen: (sec.innerText || '').length, secFull: (sec.innerText || '').replace(/\s+/g, ' ').slice(-250) } };
})()
