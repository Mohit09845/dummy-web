/*
 * One-off image optimization pass. Not wired into the build — run manually
 * with `node scripts/optimize-images.js` whenever new source art lands in
 * public/assets. Uses `sharp`, which ships as a transitive dep of `next`
 * (no new dependency added).
 *
 * next.config.ts sets images.unoptimized: true because output: "export"
 * has no server to run Next's on-demand image optimizer, so raw source
 * files are served as-is. That makes pre-optimizing the files on disk the
 * only lever available in this architecture.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// [source, destination, { fit dimension, quality }]
const JOBS = [
  // Hero KV (LCP element) — square source, resized to comfortably cover any
  // viewport up to 2000px while cutting an 8.3MB/4500px JPEG down drastically.
  ['public/assets/kvs/sunfeast-bf-smoothie-hero.jpg', 'public/assets/kvs/sunfeast-bf-smoothie-hero.webp', { side: 2000, quality: 76 }],
  ['public/assets/kvs/Sunfeast BF Smoothie A+ Content-01.jpg', 'public/assets/kvs/Sunfeast BF Smoothie A+ Content-01.webp', { side: 2000, quality: 76 }],
  ['public/assets/kvs/Picture1.png', 'public/assets/kvs/Picture1.webp', { side: 2000, quality: 78 }],

  // Header/footer logo — displayed at ~176x88 (2x = 352x176).
  ['public/assets/logos/df-logo.png', 'public/assets/logos/df-logo.webp', { side: 700, quality: 90 }],
  // Buy-now modal platform icon — displayed at ~42x42 (2x = 84x84).
  ['public/assets/logos/blinkit.png', 'public/assets/logos/blinkit.webp', { side: 200, quality: 90 }],

  // Packshots — tall product cutouts, largest on-page usage is the product
  // detail carousel at ~260x420 (2x = 520x840). Capping height at 900px
  // gives headroom without keeping 5000px-tall source art.
  ['public/assets/packshots/chocolate-milkshake/fop.png', 'public/assets/packshots/chocolate-milkshake/fop.webp', { side: 900, quality: 82 }],
  ['public/assets/packshots/chocolate-milkshake/bop1.png', 'public/assets/packshots/chocolate-milkshake/bop1.webp', { side: 900, quality: 82 }],
  ['public/assets/packshots/vanilla-milkshake/fop.png', 'public/assets/packshots/vanilla-milkshake/fop.webp', { side: 900, quality: 82 }],
  ['public/assets/packshots/vanilla-milkshake/bop1.png', 'public/assets/packshots/vanilla-milkshake/bop1.webp', { side: 900, quality: 82 }],
  ['public/assets/packshots/mango-smoothie/render.png', 'public/assets/packshots/mango-smoothie/render.webp', { side: 900, quality: 82 }],
  ['public/assets/packshots/mango-smoothie/bop.png', 'public/assets/packshots/mango-smoothie/bop.webp', { side: 900, quality: 82 }],
  ['public/assets/packshots/berry-mango-smoothie/render.png', 'public/assets/packshots/berry-mango-smoothie/render.webp', { side: 900, quality: 82 }],
  ['public/assets/packshots/berry-mango-smoothie/bop.png', 'public/assets/packshots/berry-mango-smoothie/bop.webp', { side: 900, quality: 82 }],
  ['public/assets/packshots/breakfast-smoothie/fop.png', 'public/assets/packshots/breakfast-smoothie/fop.webp', { side: 900, quality: 82 }],
  ['public/assets/packshots/breakfast-smoothie/bop.png', 'public/assets/packshots/breakfast-smoothie/bop.webp', { side: 900, quality: 82 }],
  ['public/assets/packshots/badam-milk/fop.png', 'public/assets/packshots/badam-milk/fop.webp', { side: 900, quality: 82 }],
  ['public/assets/packshots/badam-milk/bop.png', 'public/assets/packshots/badam-milk/bop.webp', { side: 900, quality: 82 }],
  ['public/assets/packshots/lassi/fop.png', 'public/assets/packshots/lassi/fop.webp', { side: 900, quality: 82 }],
  ['public/assets/packshots/lassi/bop.png', 'public/assets/packshots/lassi/bop.webp', { side: 900, quality: 82 }],

  // Drink-quiz section background (behind a dark overlay, so mid quality is plenty).
  ['public/assets/kvs/lifestyle-berry-chill.jpg', 'public/assets/kvs/lifestyle-berry-chill.webp', { side: 1080, quality: 70 }],
];

async function run() {
  let totalBefore = 0;
  let totalAfter = 0;

  for (const [srcRel, destRel, { side, quality }] of JOBS) {
    const src = path.join(ROOT, srcRel);
    const dest = path.join(ROOT, destRel);

    if (!fs.existsSync(src)) {
      // Already converted in a previous run and the oversized original was
      // deleted afterwards — nothing left to (re)generate from.
      console.log(`${srcRel} -> skipped (source no longer present)`);
      continue;
    }

    const before = fs.statSync(src).size;
    const img = sharp(src);
    const meta = await img.metadata();
    const isPortraitOrSquare = meta.height >= meta.width;

    await img
      .resize(
        isPortraitOrSquare ? { height: Math.min(side, meta.height), withoutEnlargement: true } : { width: Math.min(side, meta.width), withoutEnlargement: true },
      )
      .webp({ quality })
      .toFile(dest);

    const after = fs.statSync(dest).size;
    totalBefore += before;
    totalAfter += after;
    console.log(
      `${srcRel} -> ${destRel}  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (${(100 - (after / before) * 100).toFixed(0)}% smaller)`,
    );
  }

  console.log('---');
  console.log(`Total: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
