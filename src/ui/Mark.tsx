/**
 * The logo mark.
 */
export function Mark({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <img
        src="/portrait.png"
        alt="Logo"
        className="w-full h-full"
        aria-hidden="true"
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}
