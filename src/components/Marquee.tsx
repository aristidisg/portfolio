export function Marquee({
  items,
  speed = 'normal',
  className = '',
}: {
  items: string[];
  speed?: 'normal' | 'slow';
  className?: string;
}) {
  if (items.length === 0) return null;
  const doubled = [...items, ...items];
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <div
        className={`flex whitespace-nowrap ${
          speed === 'slow' ? 'animate-marquee-slow' : 'animate-marquee'
        }`}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-6 px-6 font-display text-5xl md:text-7xl font-semibold uppercase tracking-tight text-paper-0/40"
          >
            {item}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
