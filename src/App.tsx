import { FlatPortfolio } from '@/ui/FlatPortfolio'

/**
 * The site.
 *
 * The 3D scroll film that used to sit behind a capability probe here has been
 * removed. What remains is the presentation that was already doing the heavier
 * lifting for a recruiter: fast, typographic, everything readable in one pass.
 *
 * There is deliberately no mode switch, no WebGL probe and no lazy boundary any
 * more — one path, so there is nothing to choose between and nothing to load
 * conditionally.
 */
export default function App() {
  return <FlatPortfolio />
}
