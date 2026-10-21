import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-[background-color,border-color,color,transform] active:translate-y-px disabled:pointer-events-none disabled:opacity-45 select-none';
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:brightness-110',
  secondary: 'border border-line-2 bg-surface text-ink hover:border-ink-2',
  ghost: 'text-ink-2 hover:bg-sunken hover:text-ink',
  danger: 'bg-bad text-surface hover:brightness-110'
};
const sizes: Record<Size, string> = { sm: 'h-9 px-3 text-sm', md: 'h-11 px-4 text-[15px]', lg: 'h-13 px-6 text-base' };

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', extra = '') => `${base} ${variants[variant]} ${sizes[size]} ${extra}`;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; size?: Size; icon?: ReactNode }

export function Button({ variant = 'primary', size = 'md', icon, className = '', children, type = 'button', ...rest }: Props) {
  return <button type={type} className={buttonClass(variant, size, className)} {...rest}>{icon}{children}</button>;
}

export function ButtonLink({ variant = 'primary', size = 'md', icon, className = '', children, ...rest }: LinkProps & { variant?: Variant; size?: Size; icon?: ReactNode }) {
  return <Link className={buttonClass(variant, size, className)} {...rest}>{icon}{children}</Link>;
}
