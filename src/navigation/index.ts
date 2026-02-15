import * as THREE from 'three'
import type { Algorithm } from '@/components/NavigationPanel'
import { buildGraph, getClosestVertexId } from './graph'
import { runAStar } from './astar'
import { runDijkstra } from './dijkstra'
import { runGreedy } from './greedy'
import { runStraightLine } from './straightLine'
import { runPhysicsPath } from './physicsPath'
import { createHeightFn, type NoiseParams } from '@/terrain/heightMap'
import { WORLD_SIZE } from '@/terrain/buildTerrainGeometry'

export type { NoiseParams } from '@/terrain/heightMap'

export function computePath(
  algorithm: Algorithm,
  seed: number,
  segments: number,
  slopePenalty: number,
  startWorld: THREE.Vector3,
  endWorld: THREE.Vector3,
  noiseParams?: NoiseParams
): THREE.Vector3[] {
  const noise = noiseParams ?? {}
  const getHeight = createHeightFn(seed, WORLD_SIZE, noise)
  const { vertices, getNeighbors, getCost } = buildGraph(seed, segments, noise)
  const startId = getClosestVertexId(vertices, startWorld)
  const endId = getClosestVertexId(vertices, endWorld)
  const startPos = vertices[startId].pos.clone()
  const endPos = vertices[endId].pos.clone()

  if (algorithm === 'astar') {
    return runAStar(vertices, getNeighbors, getCost, startId, endId, slopePenalty)
  }
  if (algorithm === 'dijkstra') {
    return runDijkstra(vertices, getNeighbors, getCost, startId, endId, slopePenalty)
  }
  if (algorithm === 'greedy') {
    return runGreedy(vertices, getNeighbors, getCost, startId, endId, slopePenalty)
  }
  if (algorithm === 'straight') {
    return runStraightLine(getHeight, startPos, endPos)
  }
  if (algorithm === 'physics') {
    return runPhysicsPath(getHeight, startPos, endPos, slopePenalty)
  }
  return []
}

export function pathLength(path: THREE.Vector3[]): number {
  let len = 0
  for (let i = 1; i < path.length; i++) {
    len += path[i].distanceTo(path[i - 1])
  }
  return len
}
