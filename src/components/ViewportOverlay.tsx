import { useState } from 'react'
import { ChevronDown, Route, Mountain } from 'lucide-react'

const OVERLAY_BG = 'rgba(53, 53, 53, 1)'
const OVERLAY_HEADER_BG = '#353535'
const OVERLAY_TEXT = '#cccccc'
const OVERLAY_PANEL_BG = '#353535'
const OVERLAY_BORDER = 'rgba(255,255,255,0.06)'
const OVERLAY_MENU_BORDER_TOP = 'rgba(46, 46, 46, 1)'
const OVERLAY_PANEL_RADIUS = '2px'

interface ExpandableMenuProps {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
  expanded: boolean
  onToggle: () => void
}

function ExpandableMenu({ label, icon, children, expanded, onToggle }: ExpandableMenuProps) {
  return (
    <div className="relative flex flex-col" style={{ marginTop: 0, marginBottom: 0 }}>
      {expanded ? (
        <div
          className="flex flex-col rounded overflow-hidden shadow-lg"
          style={{
            backgroundColor: OVERLAY_HEADER_BG,
            borderBottom: `1px solid ${OVERLAY_BORDER}`,
          }}
        >
          <button
            type="button"
            className="flex items-center gap-1 px-1.5 py-1 w-full text-left text-xs transition-colors"
            style={{ color: OVERLAY_TEXT, fontSize: 12 }}
            onClick={onToggle}
          >
            <span className="flex items-center gap-1 flex-1 min-w-0">
              {icon}
              <span className="font-medium truncate">{label}</span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 rotate-180" />
          </button>
          <div
            className="overlay-menu px-2 py-2 min-w-[200px] max-h-[70vh] overflow-y-auto"
            style={{
              backgroundColor: OVERLAY_PANEL_BG,
              color: OVERLAY_TEXT,
              borderTop: `1px solid ${OVERLAY_MENU_BORDER_TOP}`,
              fontSize: 12,
              borderBottomLeftRadius: OVERLAY_PANEL_RADIUS,
              borderBottomRightRadius: OVERLAY_PANEL_RADIUS,
            }}
          >
            {children}
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="flex items-center gap-1 px-1.5 py-1 rounded text-xs transition-colors"
          style={{ backgroundColor: OVERLAY_BG, color: OVERLAY_TEXT, fontSize: 12 }}
          onClick={onToggle}
        >
          {icon}
          <span className="font-medium">{label}</span>
        </button>
      )}
    </div>
  )
}

export interface ViewportOverlayProps {
  navigationContent: React.ReactNode
  visualizationContent: React.ReactNode
}

export function ViewportOverlay({ navigationContent, visualizationContent }: ViewportOverlayProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggle = (key: string) => setExpanded((prev) => (prev === key ? null : key))

  return (
    <div className="absolute top-4 right-4 flex gap-1 items-start justify-start z-10 pointer-events-auto">
      <ExpandableMenu
        label="Navigation"
        icon={<Route className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />}
        expanded={expanded === 'local'}
        onToggle={() => toggle('local')}
      >
        {navigationContent}
      </ExpandableMenu>
      <ExpandableMenu
        label="Terrain"
        icon={<Mountain className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />}
        expanded={expanded === 'pivot'}
        onToggle={() => toggle('pivot')}
      >
        {visualizationContent}
      </ExpandableMenu>
    </div>
  )
}
