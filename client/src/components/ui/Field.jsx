const inputClasses =
  'w-full h-11 px-3.5 rounded-card border border-line bg-white text-[15px] text-ink ' +
  'placeholder:text-ink-soft/70 hover:border-ink/40 transition-colors duration-150';

export function Label({ className = '', ...props }) {
  return (
    <label
      className={`block mb-1.5 text-sm font-medium text-ink ${className}`}
      {...props}
    />
  );
}

export function Input({ className = '', ...props }) {
  return <input className={`${inputClasses} ${className}`} {...props} />;
}

export function Select({ className = '', children, ...props }) {
  return (
    <select className={`${inputClasses} appearance-none ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className = '', rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={`${inputClasses} h-auto py-2.5 ${className}`}
      {...props}
    />
  );
}
