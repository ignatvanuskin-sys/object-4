import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("_source_photos");
await fs.mkdir(OUT, { recursive: true });

const gallery = {
  "g01_building_vp": "https://i2.photo.2gis.com/photo-gallery/aa40928e-1dd8-4a95-844e-abde06a57dfe.jpg",
  "g02_kira_a": "https://i7.photo.2gis.com/photo-gallery/787de2de-87ba-41d5-b7eb-54cc5ae3529c.jpg",
  "g03_kira_b": "https://i8.photo.2gis.com/photo-gallery/925837ca-1ada-4650-a794-490f7cc1c1e2.jpg",
  "g04_kira_c": "https://i9.photo.2gis.com/photo-gallery/6a29c623-a52b-483d-98a1-11cbe97ed1e5.jpg",
  "g05_kira_d": "https://i0.photo.2gis.com/photo-gallery/4ea911bd-2832-41b6-9512-39c6a82a155a.jpg",
  "g06_vp_a": "https://i8.photo.2gis.com/photo-gallery/2de203fc-2eb5-4874-ac41-5bd1a2a5b23b.jpg",
  "g07_vp_b": "https://i2.photo.2gis.com/photo-gallery/a7cc4672-e2ce-4e76-a9d8-96efefa9dff4.jpg",
  "g08_vp_c": "https://i6.photo.2gis.com/photo-gallery/3f08f62b-eb52-45fe-9b81-f500705a79c3.jpg",
  "g09_vp_d": "https://i8.photo.2gis.com/photo-gallery/5eb41657-5bb6-44f5-b295-640e5384d2e6.jpg",
  "g10_minka": "https://i9.photo.2gis.com/photo-gallery/efeb32d3-05b8-4b2d-82ea-ae25b033b019.jpg",
  "g11_arina": "https://i5.photo.2gis.com/photo-gallery/47206e58-083b-483f-81b7-cb4c631c1aa1.jpg",
  "g12_angelina": "https://i6.photo.2gis.com/photo-gallery/4506d803-b761-46ac-9105-cac1815f93d8.jpg",
};

const reviews = {
  "r01_ksenia_a": "https://cachizer3.2gis.com/reviews-photos/1de96c6d-3871-4878-88e7-4a87f7b0bd8c.jpg",
  "r02_ksenia_b": "https://cachizer3.2gis.com/reviews-photos/b665ca81-64ae-40ae-a56d-68092613da75.jpg",
  "r03_margarita": "https://cachizer1.2gis.com/reviews-photos/d0ce90d8-962c-4b70-bdef-903a227f2ee4.jpg",
  "r04_dasha": "https://cachizer1.2gis.com/reviews-photos/aecd9309-ca76-46a7-9575-4dd932cf702a.jpg",
  "r05_arina": "https://cachizer1.2gis.com/reviews-photos/8d36a84e-0bb6-4a4c-acdf-bfd80d40aafc.jpg",
  "r06_arina_k": "https://cachizer1.2gis.com/reviews-photos/d0f1a07a-c693-4a78-b181-f487fb586f63.jpg",
  "r07_angelina": "https://cachizer3.2gis.com/reviews-photos/d988e1b0-a745-4f64-8576-bb48fc2b0fbb.jpg",
  "r08_minka": "https://cachizer2.2gis.com/reviews-photos/5c74759b-091f-4f3e-9cf9-41f8bc286226.jpg",
};

const price = {
  "p01_dom_proklyatyh": "https://i4.photo.2gis.com/photo-gallery/438f3a4b-ca9a-478f-95a9-eb68fa79a89c.jpg",
  "p02_pila_a": "https://i4.photo.2gis.com/photo-gallery/9c6f038d-1388-4d86-a0de-51d2e9427c3a.jpg",
  "p03_pila_b": "https://i7.photo.2gis.com/photo-gallery/2c994804-30f3-4b48-b096-d7857e9430d6.jpg",
};

const all = { ...gallery, ...reviews, ...price };

const report = [];
for (const [name, url] of Object.entries(all)) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        Referer: "https://2gis.kz/",
        Accept: "image/avif,image/webp,image/jpeg,image/*,*/*;q=0.8",
      },
    });
    if (!res.ok) {
      report.push(`${name}\tFAIL\t${res.status} ${url}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const file = path.join(OUT, `${name}.jpg`);
    await fs.writeFile(file, buf);
    report.push(`${name}\tOK\t${buf.length}\t${url}`);
  } catch (e) {
    report.push(`${name}\tERR\t${e.message}\t${url}`);
  }
}

await fs.writeFile(path.join(OUT, "_report.txt"), report.join("\n"), "utf8");
console.log(report.join("\n"));
