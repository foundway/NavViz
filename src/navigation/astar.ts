import * as THREE from 'three'
import type { GraphVertex } from './graph'

export function runAStar(
  vertices: GraphVertex[],
  getNeighbors: (id: number) => number[],
  getCost: (from: number, to: number, penalty: number) => number,
  startId: number,
  endId: number,
  slopePenalty: number
): THREE.Vector3[] {
  const openSet = new Set<number>([startId])
  const cameFrom = new Map<number, number>()
  const gScore = new Map<number, number>()
  const fScore = new Map<number, number>()

  vertices.forEach((_, i) => {
    gScore.set(i, Infinity)
    fScore.set(i, Infinity)
  })
  gScore.set(startId, 0)
  fScore.set(startId, heuristic(vertices[startId].pos, vertices[endId].pos))

  while (openSet.size > 0) {
    let current = -1
    let bestF = Infinity
    for (const id of openSet) {
      const f = fScore.get(id) ?? Infinity
      if (f < bestF) {
        bestF = f
        current = id
      }
    }
    if (current === -1) break
    if (current === endId) return reconstructPath(vertices, cameFrom, current)

    openSet.delete(current)

    for (const neighbor of getNeighbors(current)) {
      const cost = getCost(current, neighbor, slopePenalty)
      const tg = (gScore.get(current) ?? Infinity) + cost
      if (tg >= (gScore.get(neighbor) ?? Infinity)) continue
      cameFrom.set(neighbor, current)
      gScore.set(neighbor, tg)
      const h = heuristic(vertices[neighbor].pos, vertices[endId].pos)
      fScore.set(neighbor, tg + h)
      openSet.add(neighbor)
    }
  }
  return []
}

function heuristic(a: THREE.Vector3, b: THREE.Vector3): number {
  return a.distanceTo(b)
}

function reconstructPath(
  vertices: GraphVertex[],
  cameFrom: Map<number, number>,
  current: number
): THREE.Vector3[] {
  const path: THREE.Vector3[] = [vertices[current].pos.clone()]
  while (cameFrom.has(current)) {
    current = cameFrom.get(current)!
    path.push(vertices[current].pos.clone())
  }
  return path.reverse()
}
