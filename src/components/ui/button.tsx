import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef, type AnchorHTMLAttributes, type ElementType } from 'react'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

interface ButtonAsButton extends ButtonBaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

type ButtonProps = ButtonAsButton | ButtonAsLink

function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
    {
      'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800': variant === 'primary',
      'bg-slate-100 text-slate-800 hover:bg-slate-200': variant === 'secondary',
      'border border-slate-300 text-slate-700 hover:bg-slate-50': variant === 'outline',
      'text-slate-600 hover:bg-slate-100': variant === 'ghost',
    },
    {
      'text-sm px-3 py-1.5 gap-1.5': size === 'sm',
      'text-sm px-4 py-2 gap-2': size === 'md',
      'text-base px-6 py-3 gap-2': size === 'lg',
    },
    className
  )
}

export function Button(props: ButtonProps) {
  if ('href' in props && props.href !== undefined) {
    const { href, variant, size, className, children, onClick } = props
    return (
      <Link href={href} className={buttonClasses(variant, size, className)} onClick={onClick}>
        {children}
      </Link>
    )
  }

  const { variant, size, className, ...rest } = props as ButtonAsButton
  return (
    <button className={buttonClasses(variant, size, className)} {...rest} />
  )
}
