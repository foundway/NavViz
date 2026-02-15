import * as THREE from 'three'
import type { GraphVertex } from './graph'

export function runDijkstra(
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

  vertices.forEach((_, i) => gScore.set(i, Infinity))
  gScore.set(startId, 0)

  while (openSet.size > 0) {
    let current = -1
    let bestG = Infinity
    for (const id of openSet) {
      const g = gScore.get(id) ?? Infinity
      if (g < bestG) {
        bestG = g
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
      openSet.add(neighbor)
    }
  }
  return []
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
