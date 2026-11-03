const variants = {
  // status tags on property cards
  available: 'bg-green text-white',
  sold: 'bg-ink text-white',
  rented: 'bg-ink-soft text-white',
  // neutral label, e.g. property type
  neutral: 'bg-paper-2 text-ink border border-line',
  featured: 'bg-accent text-white',
};

export default function Badge({ variant = 'neutral', className = '', ...props }) {
  return (
    <span
      className={`inline-flex items-center rounded-[3px] px-2 py-0.5 text-xs font-medium tracking-wide uppercase ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
