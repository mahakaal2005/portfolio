/**
 * Opens a project case study and captures it.
 *
 *   node scripts/capture-detail.mjs shots
 *
 * The detail view only exists after a click, so the normal scroll-and-shoot
 * capture never sees it. This drives the interaction: scroll to the work grid,
 * click the first "View Project", wait for the slide-up to settle, then shoot
 * the top and the middle of the case study.
 */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const OUT = process.argv[2] || 'shots-detail'
const URL = process.env.CAP_URL || 'http://localhost:5188/'
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'

fs.mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--window-size=1440,900'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })

const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('console: ' + m.text())
})

await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 1500))

// Bring the work grid into view so its reveal animation has run.
await page.evaluate(() => document.querySelector('#work')?.scrollIntoView())
await new Promise((r) => setTimeout(r, 1200))

const clicked = await page.evaluate(() => {
  const buttons = [...document.querySelectorAll('#work button')]
  const target = buttons.find((b) => b.textContent?.includes('View Project'))
  if (!target) return false
  target.click()
  return true
})
console.log('clicked View Project:', clicked)

await new Promise((r) => setTimeout(r, 1400))
await page.screenshot({ path: `${OUT}/detail-top.png` })

const info = await page.evaluate(() => {
  const dialog = document.querySelector('[role="dialog"]')
  return {
    dialogPresent: Boolean(dialog),
    bodyOverflow: document.body.style.overflow,
    headings: [...(dialog?.querySelectorAll('h2, h3') ?? [])].map((h) => h.textContent?.trim()),
  }
})
console.log(JSON.stringify(info, null, 2))

await page.evaluate(() => document.querySelector('[role="dialog"]')?.scrollTo(0, 1400))
await new Promise((r) => setTimeout(r, 700))
await page.screenshot({ path: `${OUT}/detail-mid.png` })

await page.evaluate(() => document.querySelector('[role="dialog"]')?.scrollTo(0, 3000))
await new Promise((r) => setTimeout(r, 700))
await page.screenshot({ path: `${OUT}/detail-low.png` })

console.log('--- errors ---')
console.log([...new Set(errors)].slice(0, 10).join('\n') || 'none')

await browser.close()
