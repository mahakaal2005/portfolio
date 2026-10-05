/**
 * Screenshots each project's live deployment for its card.
 *
 *   node scripts/shoot-projects.mjs
 *
 * Card carousels live on imagery, and the alternative to a real screenshot is
 * a placeholder — which is worse than none. The URLs already sit in
 * src/content/projects.ts, so this reads them straight from there.
 *
 * Render's free tier sleeps, so the first request to a cold service can take
 * the better part of a minute; the timeout is set accordingly and a failure
 * for one project never stops the others.
 */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
import path from 'node:path'

const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT = 'public/work'

const source = fs.readFileSync('src/content/projects.ts', 'utf8')
const ids = [...source.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1])
const lives = [...source.matchAll(/live:\s*'([^']*)'/g)].map((m) => m[1])
const targets = ids.map((id, i) => ({ id, url: lives[i] })).filter((t) => t.url)

if (!targets.length) {
  console.error('No live URLs found in src/content/projects.ts')
  process.exit(1)
}

fs.mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--window-size=1440,900'],
})

for (const target of targets) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  try {
    console.log(`→ ${target.id}  ${target.url}`)
    await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 90000 })
    // Give hero animations and lazy images a moment to settle.
    await new Promise((r) => setTimeout(r, 4500))
    const file = path.join(OUT, `${target.id}.jpg`)
    await page.screenshot({ path: file, type: 'jpeg', quality: 82 })
    const kb = Math.round(fs.statSync(file).size / 1024)
    console.log(`  ok  ${file}  ${kb} KB`)
  } catch (error) {
    console.log(`  FAILED  ${error.message.split('\n')[0]}`)
  }
  await page.close()
}

await browser.close()
