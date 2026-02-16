import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  onChange?: (e: { target: { value: string } }) => void
}

function getOptionsFromChildren(children: React.ReactNode): { value: string; label: string }[] {
  return React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<{ value?: string | number; children?: React.ReactNode }> =>
        React.isValidElement(child) && (child.type as string) === 'option'
    )
    .map((child) => ({
      value: String(child.props.value ?? ''),
      label: typeof child.props.children === 'string' ? child.props.children : String(child.props.children ?? ''),
    }))
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ className, value, onChange, children, ...props }, ref) => {
    const options = React.useMemo(() => getOptionsFromChildren(children), [children])
    const strValue = value !== undefined && value !== null ? String(value) : undefined

    return (
      <SelectPrimitive.Root
        value={strValue}
        onValueChange={(v) => onChange?.({ target: { value: v } })}
        {...props}
      >
        <SelectPrimitive.Trigger
          ref={ref as React.RefObject<HTMLButtonElement>}
          className={cn(
            'flex h-[22px] w-full items-center justify-between gap-2 rounded border border-gray-600 bg-gray-800 px-1.5 py-1 text-xs text-gray-100 outline-none transition-colors focus:border-blue-500 min-h-[22px] [&>span]:flex [&>span]:flex-1 [&>span]:truncate [&>span]:text-left',
            className
          )}
        >
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-70" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            className={cn(
              'z-50 overflow-hidden bg-[#1a1a1a] shadow-md',
              'border-0 py-[4px] rounded-[4px]'
            )}
          >
            <SelectPrimitive.Viewport className="px-0">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    'relative flex cursor-default select-none items-center py-1.5 pl-2 pr-8 text-[12px] outline-none',
                    'text-[#cccccc] data-[highlighted]:bg-[#3F99F7] data-[highlighted]:text-white'
                  )}
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    )
  }
)
Select.displayName = 'Select'

export { Select }
