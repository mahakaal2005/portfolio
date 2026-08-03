import { useState } from 'react'
import Preloader from './sections/Preloader'
import Nav from './sections/Nav'
import ProgressBar from './sections/ProgressBar'
import Grain from './sections/Grain'
import Hero from './sections/Hero'
import Manifesto from './sections/Manifesto'
import Marquee from './sections/Marquee'
import Work from './sections/Work'
import Experience from './sections/Experience'
import Contact from './sections/Contact'

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    <>
      <Preloader onComplete={() => setReady(true)} />
      <ProgressBar />
      <Nav />
      <Grain />

      <main>
        <Hero ready={ready} />
        <Manifesto />
        <Marquee />
        <Work />
        <Experience />
        <Contact />
      </main>
    </>
  )
}
