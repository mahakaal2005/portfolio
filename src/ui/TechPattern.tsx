export function TechPattern() {
  return (
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 1200 800">
        <defs>
          <pattern id="tech-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="5" y="5" width="10" height="10" fill="currentColor" opacity="0.3" />
            <rect x="20" y="15" width="8" height="8" fill="currentColor" opacity="0.2" />
            <rect x="35" y="25" width="12" height="12" fill="currentColor" opacity="0.15" />
            <line x1="0" y1="0" x2="40" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="1200" height="800" fill="url(#tech-pattern)" />
      </svg>
    </div>
  )
}
