/**
 * Page capture.
 *
 *   npm run dev
 *   npm run capture -- shots            # desktop and mobile, top to bottom
 *
 * Drives a real Chrome, scrolls the page in steps and writes PNGs, reporting
 * any console errors, failed requests or 4xx responses along the way. Useful
 * for checking layout at both widths without alt-tabbing.
 *
 * Env:
 *   CAP_URL   dev server URL (default http://localhost:5173/)
 *   CHROME    path to a Chrome or Edge binary
 */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const OUT = process.argv[2] || 'shots'
const URL = process.env.CAP_URL || 'http://localhost:5173/'
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

fs.mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--window-size=1440,900'],
})

// CAP_W/CAP_H override the desktop viewport — useful for checking that the
// hero fits a short laptop window, which is where it first overflowed.
const VIEWS = [
  {
    name: 'desktop',
    width: parseInt(process.env.CAP_W || '1440', 10),
    height: parseInt(process.env.CAP_H || '900', 10),
    dsf: 1,
    isMobile: false,
    steps: 6,
  },
  { name: 'mobile', width: 420, height: 900, dsf: 2, isMobile: true, steps: 8 },
]

const errors = []

for (const view of VIEWS) {
  const page = await browser.newPage()
  await page.setViewport({
    width: view.width,
    height: view.height,
    deviceScaleFactor: view.dsf,
    isMobile: view.isMobile,
    hasTouch: view.isMobile,
  })

  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[${view.name}] ${m.text()}`.slice(0, 220))
  })
  page.on('pageerror', (e) => errors.push(`[${view.name}] pageerror: ${e.message}`))
  page.on('requestfailed', (r) => errors.push(`[${view.name}] reqfail ${r.url()}`))
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`[${view.name}] http ${r.status()} ${r.url()}`)
  })

  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1200))

  const info = await page.evaluate(() => ({
    docHeight: document.documentElement.scrollHeight,
    innerHeight: window.innerHeight,
    headings: [...document.querySelectorAll('h1, h2')]
      .map((h) => h.textContent?.trim())
      .slice(0, 12),
    links: document.querySelectorAll('a[href]').length,
  }))
  console.log(view.name, JSON.stringify(info, null, 2))

  for (let i = 0; i < view.steps; i++) {
    const p = i / (view.steps - 1)
    await page.evaluate((f) => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: max * f, behavior: 'instant' })
    }, p)
    // Long enough for the IntersectionObserver reveals to settle.
    await new Promise((r) => setTimeout(r, 700))
    await page.screenshot({ path: `${OUT}/${view.name}-${String(i + 1).padStart(2, '0')}.png` })
  }

  await page.close()
}

console.log('--- errors ---')
console.log([...new Set(errors)].slice(0, 25).join('\n') || 'none')

await browser.close()
