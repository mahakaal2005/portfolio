/**
 * Reads the computed typography and colour of a live page.
 *
 *   node scripts/extract-design.mjs https://example.com
 *
 * Framer and similar builders render everything client-side, so fetching the
 * HTML tells you nothing about the design. This loads the page in a real
 * browser and reports what the engine actually resolved — font families by
 * usage, the colour histogram, and the largest headings with their exact
 * styling.
 */
import puppeteer from 'puppeteer-core'

const URL = process.argv[2]
if (!URL) {
  console.error('usage: node scripts/extract-design.mjs <url>')
  process.exit(1)
}

const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--window-size=1440,900'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 })
await new Promise((r) => setTimeout(r, 5000))

// Scroll the whole page so lazy sections mount and register their styles.
await page.evaluate(async () => {
  const step = window.innerHeight
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 260))
  }
  window.scrollTo(0, 0)
})
await new Promise((r) => setTimeout(r, 1500))

const report = await page.evaluate(() => {
  const tally = (map, key) => map.set(key, (map.get(key) ?? 0) + 1)
  const fonts = new Map()
  const colors = new Map()
  const backgrounds = new Map()
  const headings = []

  for (const el of document.querySelectorAll('body *')) {
    const text = el.textContent?.trim() ?? ''
    const s = getComputedStyle(el)
    const size = parseFloat(s.fontSize)

    // Only count elements that actually render text.
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
    if (own && text) {
      tally(fonts, `${s.fontFamily.split(',')[0].replace(/["']/g, '')}  ${s.fontWeight}`)
      tally(colors, s.color)
      if (size >= 34) {
        headings.push({
          text: text.slice(0, 46),
          size: Math.round(size),
          weight: s.fontWeight,
          family: s.fontFamily.split(',')[0].replace(/["']/g, ''),
          color: s.color,
          letterSpacing: s.letterSpacing,
          lineHeight: s.lineHeight,
        })
      }
    }

    const bg = s.backgroundColor
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && el.getBoundingClientRect().width > 60) tally(backgrounds, bg)

    const r = s.borderRadius
    if (r && r !== '0px') tally(backgrounds, `radius ${r}`)
  }

  const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n)
  return {
    fonts: top(fonts, 12),
    textColors: top(colors, 10),
    surfaces: top(backgrounds, 16),
    headings: headings.sort((a, b) => b.size - a.size).slice(0, 12),
  }
})

console.log(JSON.stringify(report, null, 2))
await browser.close()
