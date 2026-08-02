import React from 'react';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  orientation?: 'vertical' | 'horizontal';
}

export function RadioGroup({ options, value, onChange, name, orientation = 'vertical', className = '', ...props }: RadioGroupProps) {
  return (
    <div className={`flex gap-2 ${orientation === 'horizontal' ? 'flex-row' : 'flex-col'} ${className}`}>
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center gap-3 cursor-pointer p-3 rounded-md border transition-colors ${
            value === option.value
              ? 'border-accent bg-card text-ink'
              : 'border-hairline bg-card text-muted hover:border-hairline-strong'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
              value === option.value ? 'border-accent' : 'border-hairline'
            }`}
          >
            {value === option.value && (
              <div className="w-2 h-2 rounded-full bg-accent" />
            )}
          </div>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            className="hidden"
            {...props}
          />
          <span className="text-body-md font-body">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
