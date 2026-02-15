import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { buildTerrainGeometry, type TerrainOptions } from '@/terrain/buildTerrainGeometry'

interface TerrainMeshProps extends TerrainOptions {
  onClick?: (e: { point: THREE.Vector3 }) => void
}

export function TerrainMesh({
  seed,
  segments,
  colorMode,
  noiseMagnitude,
  noiseFrequency,
  onClick,
}: TerrainMeshProps) {
  const geometry = useMemo(
    () =>
      buildTerrainGeometry({
        seed,
        segments,
        colorMode,
        noiseMagnitude,
        noiseFrequency,
      }),
    [seed, segments, colorMode, noiseMagnitude, noiseFrequency]
  )
  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh geometry={geometry} receiveShadow onClick={onClick}>
      <meshPhongMaterial
        vertexColors
        side={THREE.DoubleSide}
        shininess={0}
      />
    </mesh>
  )
}
