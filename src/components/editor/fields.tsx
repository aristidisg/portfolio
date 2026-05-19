'use client';

import type { ProjectLink } from '@/lib/types';

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="field-label">
        {label} {required && <span className="text-accent-warm">*</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field"
        required={required}
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="field resize-y"
      />
    </label>
  );
}

export function Select<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="field"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-paper-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-accent"
      />
      {label}
    </label>
  );
}

export function CSVField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label} <span className="text-paper-3 normal-case tracking-normal">(comma-separated)</span></span>
      <input
        type="text"
        value={value.join(', ')}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
        placeholder={placeholder}
        className="field"
      />
    </label>
  );
}

export function LinksField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ProjectLink[];
  onChange: (v: ProjectLink[]) => void;
}) {
  const update = (i: number, patch: Partial<ProjectLink>) => {
    const next = value.map((l, idx) => (idx === i ? { ...l, ...patch } : l));
    onChange(next);
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, { label: '', url: '' }]);

  return (
    <div>
      <p className="field-label">{label}</p>
      <div className="space-y-2">
        {value.map((link, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={link.label}
              onChange={(e) => update(i, { label: e.target.value })}
              placeholder="Label"
              className="field flex-1"
            />
            <input
              type="url"
              value={link.url}
              onChange={(e) => update(i, { url: e.target.value })}
              placeholder="https://"
              className="field flex-[2]"
            />
            <button
              onClick={() => remove(i)}
              className="btn-ghost !py-1.5 !px-3 !text-[10px] shrink-0"
              type="button"
              aria-label="Remove link"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button onClick={add} type="button" className="btn-ghost mt-2 !py-1.5 !px-3 !text-[10px]">
        + Add link
      </button>
    </div>
  );
}
