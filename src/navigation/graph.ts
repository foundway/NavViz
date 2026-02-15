import * as THREE from 'three'
import { createHeightFn, type NoiseParams } from '@/terrain/heightMap'
import { WORLD_SIZE } from '@/terrain/buildTerrainGeometry'

export interface GraphVertex {
  id: number
  pos: THREE.Vector3
}

export function buildGraph(
  seed: number,
  segments: number,
  noiseParams?: NoiseParams
): {
  vertices: GraphVertex[]
  getNeighbors: (id: number) => number[]
  getCost: (fromId: number, toId: number, slopePenalty: number) => number
} {
  const getHeight = createHeightFn(seed, WORLD_SIZE, noiseParams)
  const half = WORLD_SIZE / 2
  const gridW = segments + 1
  const vertices: GraphVertex[] = []

  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j <= segments; j++) {
      const x = -half + (WORLD_SIZE * j) / segments
      const z = -half + (WORLD_SIZE * i) / segments
      const y = getHeight(x, z)
      vertices.push({ id: vertices.length, pos: new THREE.Vector3(x, y, z) })
    }
  }

  function getNeighbors(id: number): number[] {
    const row = Math.floor(id / gridW)
    const col = id % gridW
    const out: number[] = []
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const nr = row + dr
        const nc = col + dc
        if (nr >= 0 && nr < gridW && nc >= 0 && nc < gridW) out.push(nr * gridW + nc)
      }
    }
    return out
  }

  function getCost(fromId: number, toId: number, slopePenalty: number): number {
    const a = vertices[fromId].pos
    const b = vertices[toId].pos
    const dist = a.distanceTo(b)
    const slope = Math.abs(a.y - b.y)
    return dist + slope * slopePenalty
  }

  return { vertices, getNeighbors, getCost }
}

export function getClosestVertexId(
  vertices: GraphVertex[],
  point: THREE.Vector3
): number {
  let bestId = 0
  let bestDist = Infinity
  for (const v of vertices) {
    const d = v.pos.distanceTo(point)
    if (d < bestDist) {
      bestDist = d
      bestId = v.id
    }
  }
  return bestId
}
