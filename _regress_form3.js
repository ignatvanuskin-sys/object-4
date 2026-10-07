(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const sec = document.getElementById('contacts');
  if (!sec) return { __result: { error: 'no #contacts' } };
  const nameEl = document.getElementById('bf-name');
  const phoneEl = document.getElementById('bf-phone');
  const btn = sec.querySelector('button[type=submit]');
  if (!nameEl || !phoneEl || !btn) return { __result: { error: 'missing controls', nameEl: !!nameEl, phoneEl: !!phoneEl, btn: !!btn } };
  const setVal = (el, val) => {
    const desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
    desc.set.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };
  const rd = (el) => {
    const cs = getComputedStyle(el);
    return { bbc: cs.borderBottomColor, bbw: cs.borderBottomWidth, bbs: cs.borderBottomStyle, outline: cs.outlineColor, shadow: cs.boxShadow.slice(0, 50) };
  };

  // Stage 1: empty
  const nBefore = rd(nameEl);
  const nParentBefore = rd(nameEl.parentElement);
  btn.click();
  await sleep(700);
  const nAfter = rd(nameEl);
  const nParentAfter = rd(nameEl.parentElement);

  // Stage 2: name ok, phone bad
  setVal(nameEl, 'Тест');
  setVal(phoneEl, 'abc');
  const pBefore = rd(phoneEl);
  btn.click();
  await sleep(900);
  const pAfter = rd(phoneEl);
  const st2 = { phoneAriaInvalid: phoneEl.getAttribute('aria-invalid'), activeId: document.activeElement.id };

  // Stage 3: valid
  setVal(phoneEl, '+7 700 111 22 33');
  const st2b = { nameVal: nameEl.value, phoneVal: phoneEl.value };
  btn.click();
  await sleep(2500);
  const bodyTxt = document.body.innerText.replace(/\s+/g, ' ');
  const hit = bodyTxt.match(/.{0,60}(спасибо|успешн|отправлен|свяжемся|принят|готово|ошибк|не удалось).{0,80}/i);
  return {
    __result: {
      s1: { nameAriaInvalidAfter: nameEl.getAttribute('aria-invalid'), nBefore, nAfter, nParentBefore, nParentAfter, activeId: document.activeElement.id },
      s2: st2, pBefore, pAfter, st2b,
      s3: { nameGone: !document.getElementById('bf-name'), successHit: hit ? hit[0] : null, btnStillThere: !!sec.querySelector('button[type=submit]') }
    }
  };
})()
