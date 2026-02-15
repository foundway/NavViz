import { createNoise2D } from 'simplex-noise'

function seededRandom(seed: number) {
  return function () {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
}

export interface NoiseParams {
  magnitude?: number
  frequency?: number
}

export function createHeightFn(
  seed: number,
  worldSize: number,
  params: NoiseParams = {}
) {
  const noise = createNoise2D(seededRandom(seed * 0xffffffff))
  const magnitude = params.magnitude ?? 2.5
  const freq = params.frequency ?? 0.1

  return function getHeight(x: number, z: number): number {
    const nx = (x / worldSize) * 2
    const nz = (z / worldSize) * 2
    const base = 10 * freq
    const h =
      noise(nx * base, nz * base) * magnitude +
      noise(nx * base * 2 + 100, nz * base * 2) * magnitude * 0.5 +
      noise(nx * base * 4, nz * base * 4 + 200) * magnitude * 0.25
    return h
  }
}

export function getHeightBounds(
  getHeight: (x: number, z: number) => number,
  worldSize: number,
  segments: number
): { min: number; max: number } {
  const half = worldSize / 2
  let min = Infinity
  let max = -Infinity
  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j <= segments; j++) {
      const x = -half + (worldSize * i) / segments
      const z = -half + (worldSize * j) / segments
      const h = getHeight(x, z)
      if (h < min) min = h
      if (h > max) max = h
    }
  }
  return { min, max }
}
