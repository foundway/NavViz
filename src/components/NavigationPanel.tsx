import { ChevronDown, MapPin, Route } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export type Algorithm = 'astar' | 'dijkstra' | 'greedy' | 'straight' | 'physics'

export interface NavigationPanelProps {
  algorithm: Algorithm
  onAlgorithmChange: (a: Algorithm) => void
  penalty: number
  onPenaltyChange: (p: number) => void
  pathLength: number
  onSetStart: () => void
  onSetEnd: () => void
  setStartMode: boolean
  setEndMode: boolean
}

const ALGORITHM_OPTIONS: { value: Algorithm; label: string }[] = [
  { value: 'astar', label: 'A* (Shortest + Cost)' },
  { value: 'dijkstra', label: 'Dijkstra (Uniform Search)' },
  { value: 'greedy', label: 'Greedy Best-First' },
  { value: 'straight', label: 'Straight Line (Surface)' },
  { value: 'physics', label: 'Physics (Simulated Path)' },
]

const overlayRow = 'flex items-center gap-2 min-h-[28px] text-[12px]'
const overlayLabel = 'shrink-0 text-[#cccccc] w-[100px]'
const overlayControl = 'flex-1 min-w-0 flex items-center justify-start text-left min-h-[24px]'
const overlayValueBox =
  'shrink-0 min-w-[44px] h-[22px] rounded-[2px] border border-[#313131] px-2 py-0.5 text-left text-[12px] tabular-nums text-[#cccccc] bg-[#424242]'

export function NavigationPanelContent({
  algorithm,
  onAlgorithmChange,
  penalty,
  onPenaltyChange,
  pathLength,
  onSetStart,
  onSetEnd,
  setStartMode,
  setEndMode,
}: NavigationPanelProps) {
  return (
    <div className="flex flex-col gap-0">
      <div className={overlayRow}>
        <label className={overlayLabel}>Algorithm</label>
        <div className={overlayControl}>
          <Select
            value={algorithm}
            onChange={(e) => onAlgorithmChange(e.target.value as Algorithm)}
            className="overlay-select m-0 w-full min-h-[22px] h-[22px] rounded-sm border border-[#313131] bg-[#464646] px-1.5 py-0.5 text-left text-[12px] text-[#cccccc] outline-none focus:border-[#3F99F7] justify-start items-start"
          >
            {ALGORITHM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className={overlayRow}>
        <label className={overlayLabel}>Penalty Factor</label>
        <div className={overlayControl + ' gap-2'}>
          <Slider
            min={0}
            max={20}
            step={1}
            value={[penalty]}
            onValueChange={([v]) => onPenaltyChange(v)}
            className="overlay-slider min-w-0 flex-1 h-[22px]"
          />
          <span className={overlayValueBox}>{penalty}×</span>
        </div>
      </div>
      <div className={overlayRow}>
        <span className={overlayLabel} />
        <div className={overlayControl + ' gap-1'}>
          <Button
            variant="overlay"
            size="xs"
            className={cn('flex-1', setStartMode && 'bg-[#3F99F7] text-white border-[#3F99F7]')}
            onClick={onSetStart}
          >
            <MapPin className="h-3 w-3" />
            Set start
          </Button>
          <Button
            variant="overlay"
            size="xs"
            className={cn('flex-1', setEndMode && 'bg-[#3F99F7] text-white border-[#3F99F7]')}
            onClick={onSetEnd}
          >
            <MapPin className="h-3 w-3" />
            Set end
          </Button>
        </div>
      </div>
      <div className={overlayRow + ' border-t border-[#2e2e2e] pt-1 mt-1'}>
        <label className={overlayLabel}>Path length</label>
        <span className={overlayControl + ' justify-end text-[#cccccc] tabular-nums'}>{pathLength.toFixed(1)} m</span>
      </div>
    </div>
  )
}

export function NavigationPanel({
  algorithm,
  onAlgorithmChange,
  penalty,
  onPenaltyChange,
  pathLength,
  onSetStart,
  onSetEnd,
  setStartMode,
  setEndMode,
}: NavigationPanelProps) {
  const [open, setOpen] = useState(true)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            'flex w-full items-center justify-between rounded-t-lg border border-b-0 border-gray-700 bg-gray-900/95 px-4 py-3 text-left text-sm font-semibold text-gray-200 hover:bg-gray-800',
            open && 'rounded-b-none'
          )}
        >
          <span className="flex items-center gap-2">
            <Route className="h-4 w-4 text-blue-400" />
            Navigation
          </span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="rounded-b-lg border border-gray-700 border-t-0 bg-gray-900/95 p-4">
          <NavigationPanelContent
            algorithm={algorithm}
            onAlgorithmChange={onAlgorithmChange}
            penalty={penalty}
            onPenaltyChange={onPenaltyChange}
            pathLength={pathLength}
            onSetStart={onSetStart}
            onSetEnd={onSetEnd}
            setStartMode={setStartMode}
            setEndMode={setEndMode}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
