const base =
  'inline-flex items-center justify-center gap-2 rounded-card font-sans font-medium ' +
  'transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-2',
  // Darker than WhatsApp's brand green so white label text passes AA contrast.
  whatsapp: 'bg-[#0E7C3F] text-white hover:bg-[#0A6232]',
  secondary: 'border border-ink/30 text-ink hover:border-ink hover:bg-paper-2',
  ghost: 'text-green hover:bg-green/10',
};

const sizes = {
  lg: 'h-12 px-6 text-base font-semibold',
  md: 'h-11 px-5 text-[15px]',
  sm: 'h-9 px-3.5 text-sm',
};

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <Tag
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
