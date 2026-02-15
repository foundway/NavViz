import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import pinSvg from '@/graphics/Pin.svg?raw'

const PIN_SPEED = 0.3
const PIN_SIZE = 2
const PATH_LIFT = 0.2
const PIN_SVG_BOTTOM_CENTER_X = 12
const PIN_SVG_BOTTOM_CENTER_Y = 22
const PIN_SVG_SIZE = 24

interface PinPart {
  geometry: THREE.BufferGeometry
  color: THREE.Color
}

function buildPinParts(): PinPart[] {
  const loader = new SVGLoader()
  const data = loader.parse(pinSvg)
  const scale = PIN_SIZE / PIN_SVG_SIZE
  const matrix = new THREE.Matrix4()
    .makeTranslation(-PIN_SVG_BOTTOM_CENTER_X, -PIN_SVG_BOTTOM_CENTER_Y, 0)
    .multiply(new THREE.Matrix4().makeScale(1, -1, 1))
    .multiply(new THREE.Matrix4().makeScale(scale, scale, 1))
  const parts: PinPart[] = []
  for (const path of data.paths) {
    const shapes = SVGLoader.createShapes(path)
    for (const shape of shapes) {
      const geo = new THREE.ShapeGeometry(shape)
      geo.applyMatrix4(matrix)
      parts.push({ geometry: geo, color: path.color.clone() })
    }
  }
  return parts
}

export function LocationPin({ path, start, end }: LocationPinProps) {
  const parts = useMemo(() => buildPinParts(), [])
  const progressRef = useRef(0)
  const positionRef = useRef(new THREE.Vector3(0, 0, 0))
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    return () => parts.forEach((p) => p.geometry.dispose())
  }, [parts])

  useEffect(() => {
    progressRef.current = 0
    if (path.length >= 2 && groupRef.current) {
      const p = path[0]
      groupRef.current.position.set(p.x, p.y + PATH_LIFT, p.z)
    }
  }, [path, start, end])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.quaternion.copy(state.camera.quaternion)
    if (path.length >= 2) {
      progressRef.current += state.clock.getDelta() * PIN_SPEED
      if (progressRef.current >= 1) progressRef.current = 0
      const t = progressRef.current
      const index = t * (path.length - 1)
      const i0 = Math.floor(index)
      const i1 = Math.min(i0 + 1, path.length - 1)
      const localT = index - i0
      const p0 = path[i0]
      const p1 = path[i1]
      positionRef.current.set(
        p0.x + (p1.x - p0.x) * localT,
        p0.y + (p1.y - p0.y) * localT + PATH_LIFT,
        p0.z + (p1.z - p0.z) * localT
      )
    } else if (start) {
      positionRef.current.set(start.x, start.y + PATH_LIFT, start.z)
    } else if (end) {
      positionRef.current.set(end.x, end.y + PATH_LIFT, end.z)
    } else {
      positionRef.current.set(0, PATH_LIFT, 0)
    }
    groupRef.current.position.copy(positionRef.current)
  })

  if (!start && !end) return null

  return (
    <group ref={groupRef} renderOrder={1}>
      {parts.map((part, i) => (
        <mesh key={i} geometry={part.geometry}>
          <meshBasicMaterial
            color={part.color}
            depthTest={false}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

interface LocationPinProps {
  path: THREE.Vector3[]
  start: THREE.Vector3 | null
  end: THREE.Vector3 | null
}
