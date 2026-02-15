import { ChevronDown, Palette, Shuffle } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export type TerrainColorMode = 'plain' | 'heightmap' | 'heatmap'

export interface VisualizationPanelProps {
  colorMode: TerrainColorMode
  onColorModeChange: (m: TerrainColorMode) => void
  terrainSize: number
  onTerrainSizeChange: (s: number) => void
  noiseMagnitude: number
  onNoiseMagnitudeChange: (v: number) => void
  noiseFrequency: number
  onNoiseFrequencyChange: (v: number) => void
  onRegenerateTerrain: () => void
}

const COLOR_OPTIONS: { value: TerrainColorMode; label: string }[] = [
  { value: 'plain', label: 'Plain shaded' },
  { value: 'heightmap', label: 'Black & white height map' },
  { value: 'heatmap', label: 'Heat map (red high, blue low)' },
]

const SIZE_OPTIONS = [32, 64, 128]

const overlayRow = 'flex items-center gap-2 min-h-[28px] text-[12px]'
const overlayLabel = 'shrink-0 text-[#cccccc] w-[100px]'
const overlayControl = 'flex-1 min-w-0 flex items-center justify-start text-left min-h-[24px]'
const overlayValueBox =
  'shrink-0 min-w-[44px] h-[22px] rounded-[2px] border border-[#313131] px-2 py-0.5 text-left text-[12px] tabular-nums text-[#cccccc] bg-[#424242]'
const overlaySelect =
  'm-0 w-full min-h-[22px] rounded-sm border border-[#313131] bg-[#464646] px-1.5 py-0.5 text-left text-[12px] text-[#cccccc] outline-none focus:border-[#3F99F7] justify-start items-start'

export function VisualizationPanelContent({
  colorMode,
  onColorModeChange,
  terrainSize,
  onTerrainSizeChange,
  noiseMagnitude,
  onNoiseMagnitudeChange,
  noiseFrequency,
  onNoiseFrequencyChange,
  onRegenerateTerrain,
}: VisualizationPanelProps) {
  return (
    <div className="flex flex-col gap-0">
      <div className={overlayRow}>
        <label className={overlayLabel}>Coloring</label>
        <div className={overlayControl}>
          <Select
            value={colorMode}
            onChange={(e) => onColorModeChange(e.target.value as TerrainColorMode)}
            className={overlaySelect}
          >
            {COLOR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className={overlayRow}>
        <label className={overlayLabel}>Terrain size</label>
        <div className={overlayControl}>
          <Select
            value={terrainSize}
            onChange={(e) => onTerrainSizeChange(Number(e.target.value))}
            className={overlaySelect}
          >
            {SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}×{s}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className={overlayRow}>
        <label className={overlayLabel}>Noise magnitude</label>
        <div className={overlayControl + ' gap-2'}>
          <Slider
            min={0.5}
            max={5}
            step={0.1}
            value={[noiseMagnitude]}
            onValueChange={([v]) => onNoiseMagnitudeChange(v)}
            className="overlay-slider min-w-0 flex-1 h-[22px]"
          />
          <span className={overlayValueBox}>{noiseMagnitude.toFixed(1)}</span>
        </div>
      </div>
      <div className={overlayRow}>
        <label className={overlayLabel}>Noise frequency</label>
        <div className={overlayControl + ' gap-2'}>
          <Slider
            min={0.03}
            max={0.3}
            step={0.01}
            value={[noiseFrequency]}
            onValueChange={([v]) => onNoiseFrequencyChange(v)}
            className="overlay-slider min-w-0 flex-1 h-[22px]"
          />
          <span className={overlayValueBox}>{noiseFrequency.toFixed(2)}</span>
        </div>
      </div>
      <div className={overlayRow}>
        <span className={overlayLabel} />
        <div className={overlayControl}>
          <Button variant="overlay" size="xs" className="w-full" onClick={onRegenerateTerrain}>
            <Shuffle className="h-3 w-3" />
            Regenerate terrain
          </Button>
        </div>
      </div>
    </div>
  )
}

export function VisualizationPanel({
  colorMode,
  onColorModeChange,
  terrainSize,
  onTerrainSizeChange,
  noiseMagnitude,
  onNoiseMagnitudeChange,
  noiseFrequency,
  onNoiseFrequencyChange,
  onRegenerateTerrain,
}: VisualizationPanelProps) {
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
            <Palette className="h-4 w-4 text-blue-400" />
            Visualization
          </span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="rounded-b-lg border border-gray-700 border-t-0 bg-gray-900/95 p-4">
          <VisualizationPanelContent
            colorMode={colorMode}
            onColorModeChange={onColorModeChange}
            terrainSize={terrainSize}
            onTerrainSizeChange={onTerrainSizeChange}
            noiseMagnitude={noiseMagnitude}
            onNoiseMagnitudeChange={onNoiseMagnitudeChange}
            noiseFrequency={noiseFrequency}
            onNoiseFrequencyChange={onNoiseFrequencyChange}
            onRegenerateTerrain={onRegenerateTerrain}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
