import * as THREE from 'three'
import type { TerrainColorMode } from '@/components/VisualizationPanel'
import { createHeightFn, getHeightBounds } from './heightMap'

const WORLD_SIZE = 50

export interface TerrainOptions {
  seed: number
  segments: number
  colorMode: TerrainColorMode
  noiseMagnitude?: number
  noiseFrequency?: number
}

function buildTopSurface(
  getHeight: (x: number, z: number) => number,
  segments: number,
  colorMode: TerrainColorMode,
  yMin: number,
  yMax: number
) {
  const half = WORLD_SIZE / 2
  const gridW = segments + 1
  const positions: number[] = []
  const normals: number[] = []
  const colors: number[] = []
  const color = new THREE.Color()
  const range = Math.max(yMax - yMin, 0.01)

  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j <= segments; j++) {
      const x = -half + (WORLD_SIZE * j) / segments
      const z = -half + (WORLD_SIZE * i) / segments
      const y = getHeight(x, z)
      positions.push(x, y, z)
      normals.push(0, 1, 0)
      const t = (y - yMin) / range
      if (colorMode === 'plain') {
        color.setHSL(0.3, 0.3, 0.2 + t * 0.25)
      } else if (colorMode === 'heightmap') {
        const g = Math.max(0, Math.min(1, t))
        color.setRGB(g, g, g)
      } else {
        color.setHSL(0.65 - t * 0.65, 1, 0.5)
      }
      colors.push(color.r, color.g, color.b)
    }
  }

  const indices: number[] = []
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const a = i * gridW + j
      const b = (i + 1) * gridW + j
      const c = (i + 1) * gridW + (j + 1)
      const d = i * gridW + (j + 1)
      indices.push(a, b, d, b, c, d)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

const SIDE_COLOR = new THREE.Color(0xDFAB80)

function buildSides(
  getHeight: (x: number, z: number) => number,
  segments: number,
  yMin: number
) {
  const half = WORLD_SIZE / 2
  const positions: number[] = []
  const normals: number[] = []
  const colors: number[] = []
  const indices: number[] = []
  let idx = 0
  const r = SIDE_COLOR.r
  const g = SIDE_COLOR.g
  const b = SIDE_COLOR.b

  function addQuad(
    x0: number, z0: number, y0: number,
    x1: number, z1: number, y1: number,
    nx: number, nz: number
  ) {
    const i = idx
    positions.push(x0, y0, z0, x1, y1, z1, x1, yMin, z1, x0, yMin, z0)
    normals.push(nx, 0, nz, nx, 0, nz, nx, 0, nz, nx, 0, nz)
    for (let v = 0; v < 4; v++) colors.push(r, g, b)
    indices.push(i, i + 1, i + 2, i, i + 2, i + 3)
    idx += 4
  }

  for (let k = 0; k < segments; k++) {
    const t0 = k / segments
    const t1 = (k + 1) / segments
    const xL = -half + WORLD_SIZE * t0
    const xR = -half + WORLD_SIZE * t1
    const zL = -half + WORLD_SIZE * t0
    const zR = -half + WORLD_SIZE * t1

    addQuad(xL, -half, getHeight(xL, -half), xR, -half, getHeight(xR, -half), 0, -1)
    addQuad(xR, half, getHeight(xR, half), xL, half, getHeight(xL, half), 0, 1)
    addQuad(-half, zL, getHeight(-half, zL), -half, zR, getHeight(-half, zR), -1, 0)
    addQuad(half, zR, getHeight(half, zR), half, zL, getHeight(half, zL), 1, 0)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.setIndex(indices)
  return geo
}

function buildBottom(yFloor: number) {
  const half = WORLD_SIZE / 2
  const positions = [
    -half, yFloor, -half,
    half, yFloor, -half,
    half, yFloor, half,
    -half, yFloor, half,
  ]
  const normals = [
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
  ]
  const r = SIDE_COLOR.r
  const g = SIDE_COLOR.g
  const b = SIDE_COLOR.b
  const colors = [r, g, b, r, g, b, r, g, b, r, g, b]
  const indices = [0, 1, 2, 0, 2, 3]
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.setIndex(indices)
  return geo
}

export function buildTerrainGeometry(options: TerrainOptions): THREE.BufferGeometry {
  const { seed, segments, colorMode, noiseMagnitude, noiseFrequency } = options
  const getHeight = createHeightFn(seed, WORLD_SIZE, {
    magnitude: noiseMagnitude,
    frequency: noiseFrequency,
  })
  const { min: yMin, max: yMax } = getHeightBounds(getHeight, WORLD_SIZE, segments)
  const yFloor = yMin - 2

  const topGeo = buildTopSurface(getHeight, segments, colorMode, yMin, yMax)
  const sideGeo = buildSides(getHeight, segments, yFloor)
  const bottomGeo = buildBottom(yFloor)

  const merged = mergeBufferGeometries([topGeo, sideGeo, bottomGeo])
  topGeo.dispose()
  sideGeo.dispose()
  bottomGeo.dispose()
  return merged
}

function mergeBufferGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const merged = new THREE.BufferGeometry()
  const positions: number[] = []
  const normals: number[] = []
  const colors: number[] = []
  const indices: number[] = []
  let offset = 0

  for (const geo of geometries) {
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute
    const normAttr = geo.getAttribute('normal') as THREE.BufferAttribute
    const colorAttr = geo.getAttribute('color') as THREE.BufferAttribute | undefined
    const idxAttr = geo.index

    const defaultColor = [0.2, 0.25, 0.3]
    for (let i = 0; i < posAttr.count; i++) {
      positions.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i))
      normals.push(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i))
      if (colorAttr) colors.push(colorAttr.getX(i), colorAttr.getY(i), colorAttr.getZ(i))
      else colors.push(...defaultColor)
    }
    if (idxAttr) {
      for (let i = 0; i < idxAttr.count; i++) indices.push(idxAttr.getX(i) + offset)
    }
    offset += posAttr.count
  }

  merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  merged.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  if (colors.length) merged.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  if (indices.length) merged.setIndex(indices)
  return merged
}

export { WORLD_SIZE }
