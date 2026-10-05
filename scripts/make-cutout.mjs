/**
 * Turns a "transparent-looking" PNG into an actually transparent one.
 *
 *   node scripts/make-cutout.mjs public/cartoon.png public/cutout.png
 *
 * Avatar exports are often screenshots of a transparency preview: the file has
 * an alpha channel, but every pixel is opaque and the checkerboard is painted
 * into the image. Dropped onto a dark page it renders as a grey grid.
 *
 * A checkerboard is a regular two-tone neutral pattern, so it can be removed
 * reliably — but only by flooding inward from the borders, never by matching
 * colour globally. The subject here wears a white t-shirt whose pixels are
 * indistinguishable from the light checkerboard squares; it survives because it
 * is enclosed by the jacket and the flood never reaches it.
 */
import fs from 'node:fs'
import { PNG } from 'pngjs'

const [, , IN = 'public/cartoon.png', OUT = 'public/cutout.png'] = process.argv

const png = PNG.sync.read(fs.readFileSync(IN))
const { width: w, height: h, data } = png
const idx = (x, y) => (y * w + x) * 4

/**
 * Any light neutral pixel.
 *
 * Matching the two square tones exactly does not work: the pixels *between*
 * squares are anti-aliased to intermediate greys, and treating those as
 * non-background breaks the flood into disconnected pockets — which showed up
 * as rectangular patches of checkerboard surviving in the middle of the frame.
 * Accepting the whole light-neutral range bridges the boundaries.
 *
 * It stays safe on two counts: the flood only ever travels inward from the
 * border, and the neutrality threshold is tight enough to exclude shaded
 * whites in the subject.
 */
function isBoard(i) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  // Measured, not guessed: the checkerboard samples at a channel spread of
  // 0-2 and the anti-aliased square boundaries stay neutral, while the white
  // t-shirt sits at 8-13 because it is shaded and slightly warm. Six splits
  // them cleanly — at 14 the flood found a path through the collar and ate
  // most of the shirt.
  return max - min <= 6 && r >= 186
}

const clear = new Uint8Array(w * h)
const queue = []

const seed = (x, y) => {
  const p = y * w + x
  if (clear[p]) return
  if (!isBoard(idx(x, y))) return
  clear[p] = 1
  queue.push(p)
}

for (let x = 0; x < w; x++) {
  seed(x, 0)
  seed(x, h - 1)
}
for (let y = 0; y < h; y++) {
  seed(0, y)
  seed(w - 1, y)
}

while (queue.length) {
  const p = queue.pop()
  const x = p % w
  const y = (p - x) / w
  if (x > 0) seed(x - 1, y)
  if (x < w - 1) seed(x + 1, y)
  if (y > 0) seed(x, y - 1)
  if (y < h - 1) seed(x, y + 1)
}

let cleared = 0
for (let p = 0; p < w * h; p++) {
  if (clear[p]) {
    data[p * 4 + 3] = 0
    cleared++
  }
}

/*
 * De-fringe.
 *
 * Pixels on the silhouette are a blend of subject and checkerboard, so cutting
 * strictly on colour leaves a pale halo. One pass drops any light neutral pixel
 * that still touches transparency, which removes the halo without eating into
 * the figure.
 */
let fringe = 0
const snapshot = Uint8Array.from(clear)
for (let y = 1; y < h - 1; y++) {
  for (let x = 1; x < w - 1; x++) {
    const p = y * w + x
    if (snapshot[p]) continue
    const i = idx(x, y)
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const neutralLight = Math.abs(r - g) < 8 && Math.abs(g - b) < 8 && r > 185
    if (!neutralLight) continue
    if (snapshot[p - 1] || snapshot[p + 1] || snapshot[p - w] || snapshot[p + w]) {
      data[i + 3] = 0
      fringe++
    }
  }
}

fs.writeFileSync(OUT, PNG.sync.write(png))

const pct = ((cleared / (w * h)) * 100).toFixed(1)
console.log(`${IN} → ${OUT}`)
console.log(`  ${w}x${h}`)
console.log(`  cleared ${cleared} px (${pct}% of frame), de-fringed ${fringe}`)
console.log(`  ${Math.round(fs.statSync(OUT).size / 1024)} KB`)
