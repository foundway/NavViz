import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { TerrainMesh } from './TerrainMesh'
import { PathOverlay } from './PathOverlay'
import type { TerrainColorMode } from './VisualizationPanel'

const GRID_SIZE = 1000
const GRID_CELLS = 20
const GRID_COLOR = 0x404040

function FloorGrid() {
  const geometry = useMemo(() => {
    const positions: number[] = []
    const half = GRID_SIZE / 2
    const step = GRID_SIZE / GRID_CELLS
    for (let i = 0; i <= GRID_CELLS; i++) {
      const z = -half + i * step
      positions.push(-half, 0, z, half, 0, z)
    }
    for (let i = 0; i <= GRID_CELLS; i++) {
      const x = -half + i * step
      positions.push(x, 0, -half, x, 0, half)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [])
  return (
    <lineSegments renderOrder={0}>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color={GRID_COLOR} depthTest={false} depthWrite={false} />
    </lineSegments>
  )
}

interface SceneProps {
  onPathLengthChange?: (len: number) => void
  terrainSeed?: number
  terrainSize?: number
  colorMode?: TerrainColorMode
  noiseMagnitude?: number
  noiseFrequency?: number
  startPoint?: THREE.Vector3 | null
  endPoint?: THREE.Vector3 | null
  path?: THREE.Vector3[]
  clickMode?: 'start' | 'end' | null
  onSetStart?: (point: THREE.Vector3) => void
  onSetEnd?: (point: THREE.Vector3) => void
}

function SceneContent({
  onPathLengthChange,
  terrainSeed = Math.random(),
  terrainSize = 64,
  colorMode = 'plain',
  noiseMagnitude = 1,
  noiseFrequency = 0.1,
  startPoint = null,
  endPoint = null,
  path = [],
  clickMode = null,
  onSetStart,
  onSetEnd,
}: SceneProps) {
  useEffect(() => {
    onPathLengthChange?.(0)
  }, [onPathLengthChange])

  const onTerrainClick = (e: { point: THREE.Vector3 }) => {
    if (clickMode === 'start') onSetStart?.(e.point.clone())
    else if (clickMode === 'end') onSetEnd?.(e.point.clone())
  }

  const dirLightTarget = useRef(new THREE.Object3D())
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[20, 80, 20]}
        intensity={0.5}
        target={dirLightTarget.current}
      />
      <primitive object={dirLightTarget.current} />
      <OrbitControls makeDefault />
      <FloorGrid />
      <TerrainMesh
        seed={terrainSeed}
        segments={terrainSize}
        colorMode={colorMode}
        noiseMagnitude={noiseMagnitude}
        noiseFrequency={noiseFrequency}
        onClick={clickMode ? onTerrainClick : undefined}
      />
      <PathOverlay path={path} start={startPoint} end={endPoint} />
    </>
  )
}

export function Scene(props: SceneProps) {
  return (
    <div className="h-full w-full relative bg-[#525252]">
      <Canvas
        camera={{ position: [45, 45, 45], fov: 50 }}
        gl={{ antialias: true }}
      >
        <SceneContent {...props} />
      </Canvas>
    </div>
  )
}
