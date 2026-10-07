const html = await (await fetch("https://object-4.vercel.app/?a=" + Date.now())).text();

const anchors = [...html.matchAll(/id="loc-[a-z-]+"/g)].map((m) => m[0]);
console.log("fragment targets in HTML:", anchors.length);
anchors.forEach((a) => console.log("   ", a));

console.log('\nid="loc-pila" present:', html.includes('id="loc-pila"'));
console.log('id="loc-dom-proklyatyh" present:', html.includes('id="loc-dom-proklyatyh"'));
console.log(
  "\nA real element with that id means the platform performs the fragment jump itself —",
);
console.log("no JS timing involved, so this is verifiable without measuring an animation.");
