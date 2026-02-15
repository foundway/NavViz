import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-button-default text-white hover:bg-button-default-hover',
        secondary: 'bg-gray-700 text-gray-200 hover:bg-gray-600',
        outline: 'border border-gray-600 bg-transparent hover:bg-gray-800',
        overlay:
          'h-[22px] min-h-[22px] rounded-[2px] border border-[#313131] bg-[#464646] text-[#cccccc] hover:bg-[#3F99F7] hover:text-white focus-visible:ring-[#3F99F7]',
      },
      size: {
        default: 'px-1.5 py-1',
        sm: 'px-2 py-1.5',
        xs: 'px-1.5 py-1',
        lg: 'px-4 py-2 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
)
Button.displayName = 'Button'

export { Button, buttonVariants }
