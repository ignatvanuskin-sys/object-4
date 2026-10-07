(() => {
  const sec = document.getElementById('atmosphere');
  if (!sec) return { __result: { error: 'no #atmosphere' } };
  sec.scrollIntoView({ behavior: 'instant', block: 'start' });
  const imgs = Array.from(sec.querySelectorAll('img')).map((im, i) => ({
    i, src: (im.currentSrc || im.src || '').slice(0, 120), nw: im.naturalWidth, nh: im.naturalHeight, cw: Math.round(im.getBoundingClientRect().width), ch: Math.round(im.getBoundingClientRect().height)
  }));
  const canvases = sec.querySelectorAll('canvas').length;
  const vids = Array.from(sec.querySelectorAll('video')).map(v => v.currentSrc || v.src);
  const txt = (sec.innerText || '');
  return { __result: { imgCount: imgs.length, imgs, canvases, vids, has2gisText: /2gis|2гис/i.test(txt) } };
})()
