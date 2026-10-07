(async () => {
  const url = 'https://object-4.vercel.app/nesushchestvuyushchaya-stranica';
  let status = null, statusText = '';
  try {
    const r = await fetch(url, { method: 'GET', cache: 'no-store' });
    status = r.status; statusText = r.statusText;
  } catch (e) { status = 'ERR:' + e.message; }
  const title = document.title || '';
  const h = document.querySelector('h1, h2, [role=heading]');
  const heading = h ? (h.innerText || h.textContent || '').trim().slice(0, 120) : '';
  const lang = document.documentElement.lang || '';
  const body = document.body ? document.body.innerText : '';
  const links = Array.from(document.querySelectorAll('a')).map(a => ({ t: (a.innerText || '').trim().slice(0, 40), h: a.getAttribute('href') }));
  const hasHome = links.some(l => l.h === '/' || /главн/i.test(l.t));
  const phoneMatch = body.match(/(\+?\d[\d\s\-()]{8,})/);
  const cyr = (body.match(/[а-яА-ЯёЁ]/g) || []).length;
  const lat = (body.match(/[a-zA-Z]/g) || []).length;
  return { __result: { status, statusText, title, heading, lang, cyr, lat, hasHome, phone: phoneMatch ? phoneMatch[1].trim() : null, links } };
})()
