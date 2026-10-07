(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const sec = document.getElementById('contacts');
  const nameEl = document.getElementById('bf-name');
  const phoneEl = document.getElementById('bf-phone');
  const btn = sec.querySelector('button[type=submit]');
  const setVal = (el, val) => {
    const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    setter.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };
  const act = () => ({ id: document.activeElement.id, tag: document.activeElement.tagName.toLowerCase() });

  // Stage 1: empty submit
  const nameBefore = getComputedStyle(nameEl).borderBottomColor;
  btn.click();
  await sleep(800);
  const s1 = {
    nameAriaInvalid: nameEl.getAttribute('aria-invalid'),
    nameBefore, nameAfter: getComputedStyle(nameEl).borderBottomColor,
    active: act()
  };

  // Stage 2: name valid, phone invalid
  setVal(nameEl, 'Тест');
  setVal(phoneEl, 'abc');
  const phoneBefore = getComputedStyle(phoneEl).borderBottomColor;
  btn.click();
  await sleep(900);
  const s2 = {
    phoneAriaInvalid: phoneEl.getAttribute('aria-invalid'),
    phoneBefore, phoneAfter: getComputedStyle(phoneEl).borderBottomColor,
    active: act(), phoneValue: phoneEl.value
  };

  // Stage 3: valid
  setVal(phoneEl, '+7 700 111 22 33');
  btn.click();
  await sleep(2000);
  const secTxt = (sec.innerText || '').replace(/\s+/g, ' ').slice(0, 300);
  const s3 = {
    success: /спасибо|успешн|отправлен|свяжемся|заявка принята|принят|готово/i.test(secTxt),
    nameInvalid: nameEl.getAttribute('aria-invalid'),
    phoneInvalid: phoneEl.getAttribute('aria-invalid'),
    secTxt
  };

  return { __result: { stage1_empty: s1, stage2_phoneInvalid: s2, stage3_valid: s3 } };
})()
