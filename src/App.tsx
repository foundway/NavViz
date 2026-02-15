import { useState, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { NavigationPanelContent, type Algorithm } from '@/components/NavigationPanel'
import {
  VisualizationPanelContent,
  type TerrainColorMode,
} from '@/components/VisualizationPanel'
import { ViewportOverlay } from '@/components/ViewportOverlay'
import { Scene } from '@/components/Scene'
import { computePath, pathLength as pathLengthFn } from '@/navigation'

export default function App() {
  const [algorithm, setAlgorithm] = useState<Algorithm>('astar')
  const [penalty, setPenalty] = useState(5)
  const [pathLength, setPathLength] = useState(0)
  const [setStartMode, setSetStartMode] = useState(false)
  const [setEndMode, setSetEndMode] = useState(false)
  const [colorMode, setColorMode] = useState<TerrainColorMode>('plain')
  const [terrainSize, setTerrainSize] = useState(64)
  const [terrainSeed, setTerrainSeed] = useState(() => Math.random())
  const [noiseMagnitude, setNoiseMagnitude] = useState(2.5)
  const [noiseFrequency, setNoiseFrequency] = useState(0.1)
  const [startPoint, setStartPoint] = useState<THREE.Vector3 | null>(null)
  const [endPoint, setEndPoint] = useState<THREE.Vector3 | null>(null)

  const path = useMemo(() => {
    if (!startPoint || !endPoint) return []
    return computePath(
      algorithm,
      terrainSeed,
      terrainSize,
      penalty,
      startPoint,
      endPoint,
      { magnitude: noiseMagnitude, frequency: noiseFrequency }
    )
  }, [algorithm, terrainSeed, terrainSize, penalty, startPoint, endPoint, noiseMagnitude, noiseFrequency])

  useEffect(() => {
    setPathLength(pathLengthFn(path))
  }, [path])

  const clickMode = setStartMode ? 'start' : setEndMode ? 'end' : null
  const onSetStart = (point: THREE.Vector3) => {
    setStartPoint(point.clone())
    setSetStartMode(false)
  }
  const onSetEnd = (point: THREE.Vector3) => {
    setEndPoint(point.clone())
    setSetEndMode(false)
  }

  return (
    <div className="flex h-screen flex-col bg-[#1a1a1a]">
      <header className="flex shrink-0 items-center justify-between border-b border-[#2e2e2e] bg-[rgba(30,30,30,0.8)] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <h1 className="text-lg font-bold text-gray-100">NavViz</h1>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 relative">
        <main className="flex-1 min-w-0 relative">
          <Scene
            onPathLengthChange={setPathLength}
            terrainSeed={terrainSeed}
            terrainSize={terrainSize}
            colorMode={colorMode}
            noiseMagnitude={noiseMagnitude}
            noiseFrequency={noiseFrequency}
            startPoint={startPoint}
            endPoint={endPoint}
            path={path}
            clickMode={clickMode}
            onSetStart={onSetStart}
            onSetEnd={onSetEnd}
          />
          <ViewportOverlay
            navigationContent={
              <NavigationPanelContent
                algorithm={algorithm}
                onAlgorithmChange={setAlgorithm}
                penalty={penalty}
                onPenaltyChange={setPenalty}
                pathLength={pathLength}
                onSetStart={() => {
                  setSetStartMode(true)
                  setSetEndMode(false)
                }}
                onSetEnd={() => {
                  setSetEndMode(true)
                  setSetStartMode(false)
                }}
                setStartMode={setStartMode}
                setEndMode={setEndMode}
              />
            }
            visualizationContent={
              <VisualizationPanelContent
                colorMode={colorMode}
                onColorModeChange={setColorMode}
                terrainSize={terrainSize}
                onTerrainSizeChange={setTerrainSize}
                noiseMagnitude={noiseMagnitude}
                onNoiseMagnitudeChange={setNoiseMagnitude}
                noiseFrequency={noiseFrequency}
                onNoiseFrequencyChange={setNoiseFrequency}
                onRegenerateTerrain={() => setTerrainSeed(Math.random())}
              />
            }
          />
        </main>
      </div>
    </div>
  )
}
