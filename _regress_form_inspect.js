(() => {
  const sec = document.getElementById('contacts');
  if (!sec) return { __result: { error: 'no #contacts section' } };
  const inputs = Array.from(sec.querySelectorAll('input, textarea')).map((el, i) => ({
    i, tag: el.tagName.toLowerCase(), type: el.type, name: el.name, id: el.id,
    ph: el.placeholder || '', al: el.getAttribute('aria-label') || '', req: el.required,
    ariaInvalid: el.getAttribute('aria-invalid'),
    borderBottom: getComputedStyle(el).borderBottomColor, border: getComputedStyle(el).borderColor
  }));
  const buttons = Array.from(sec.querySelectorAll('button, [type=submit], input[type=submit]')).map((el, i) => ({
    i, tag: el.tagName.toLowerCase(), type: el.type, text: (el.innerText || el.value || '').trim().slice(0, 40)
  }));
  return { __result: { inputs, buttons } };
})()
