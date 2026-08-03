import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // GSAP/Lenis hooks read ref.current imperatively, which the compiler's
    // ref-during-render analysis rejects. Excluding is cleaner than "use no
    // memo" — that directive doesn't apply to nested functions.
    babel({
      presets: [reactCompilerPreset()],
      exclude: /src[\\/]animations[\\/]/,
    }),
    tailwindcss(),
  ],
})
