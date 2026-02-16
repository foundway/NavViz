import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import pinUrl from '@/graphics/Pin.svg?url'

const PIN_TEX_SIZE = 24 * 4

const PATH_LIFT = 0.2
const MARKER_RADIUS = 0.8 * (2 / 3)
const LINE_RADIUS = MARKER_RADIUS / 3
const PIN_SPEED = 0.3
const PIN_SIZE = 2

const START_COLOR = '#ffffff'
const END_COLOR = '#ef4444'

interface PathOverlayProps {
  path: THREE.Vector3[]
  start: THREE.Vector3 | null
  end: THREE.Vector3 | null
}

export function PathOverlay({ path, start, end }: PathOverlayProps) {
  const tubeGeoRef = useRef<THREE.TubeGeometry | null>(null)
  const tubeGeometry = useMemo(() => {
    tubeGeoRef.current?.dispose()
    tubeGeoRef.current = null
    if (path.length < 2) return null
    const points = path.map((p) => new THREE.Vector3(p.x, p.y + PATH_LIFT, p.z))
    const curve = new THREE.CatmullRomCurve3(points)
    const geo = new THREE.TubeGeometry(
      curve,
      Math.max(points.length * 2, 32),
      LINE_RADIUS,
      8,
      false
    )
    tubeGeoRef.current = geo
    return geo
  }, [path])

  useEffect(() => () => tubeGeoRef.current?.dispose(), [])

  const startPos = path.length >= 2 ? path[0] : start
  const endPos = path.length >= 2 ? path[path.length - 1] : end

  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const pinRef = useRef<THREE.Sprite>(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = PIN_TEX_SIZE
      canvas.height = PIN_TEX_SIZE
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, PIN_TEX_SIZE, PIN_TEX_SIZE)
      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.needsUpdate = true
      textureRef.current = tex
      setTexture(tex)
    }
    img.src = pinUrl
    return () => {
      textureRef.current?.dispose()
      textureRef.current = null
    }
  }, [])

  const bottomCenterY = PATH_LIFT
  const pinCenterYOffset = PIN_SIZE / 2

  useFrame((_, delta) => {
    const pin = pinRef.current
    if (!pin) return
    if (path.length >= 2) {
      progressRef.current += delta * PIN_SPEED
      if (progressRef.current >= 1) progressRef.current = 0
      const t = progressRef.current
      const i = t * (path.length - 1)
      const i0 = Math.floor(i)
      const i1 = Math.min(i0 + 1, path.length - 1)
      const localT = i - i0
      const p0 = path[i0]
      const p1 = path[i1]
      pin.position.set(
        p0.x + (p1.x - p0.x) * localT,
        p0.y + bottomCenterY + pinCenterYOffset,
        p0.z + (p1.z - p0.z) * localT
      )
    } else if (start) {
      pin.position.set(start.x, start.y + bottomCenterY + pinCenterYOffset, start.z)
    } else if (end) {
      pin.position.set(end.x, end.y + bottomCenterY + pinCenterYOffset, end.z)
    }
  })

  const showPin = start !== null || end !== null

  return (
    <group>
      {tubeGeometry && (
        <>
          <mesh geometry={tubeGeometry}>
            <meshBasicMaterial color="white" />
          </mesh>
          <mesh geometry={tubeGeometry} renderOrder={0}>
            <meshBasicMaterial
              color="white"
              transparent
              opacity={0.1}
              depthWrite={false}
              depthFunc={THREE.GreaterEqualDepth}
            />
          </mesh>
        </>
      )}
      {startPos && (
        <mesh
          position={[startPos.x, startPos.y + PATH_LIFT, startPos.z]}
          renderOrder={1}
        >
          <sphereGeometry args={[MARKER_RADIUS, 16, 16]} />
          <meshBasicMaterial
            color={START_COLOR}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      )}
      {endPos && (
        <mesh
          position={[endPos.x, endPos.y + PATH_LIFT, endPos.z]}
          renderOrder={1}
        >
          <sphereGeometry args={[MARKER_RADIUS, 16, 16]} />
          <meshBasicMaterial
            color={END_COLOR}
            transparent={false}
            opacity={1}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      )}
      {showPin && texture && (
        <sprite ref={pinRef} scale={[PIN_SIZE, PIN_SIZE, 1]} renderOrder={3}>
          <spriteMaterial
            map={texture}
            depthTest={false}
            depthWrite={false}
            transparent
          />
        </sprite>
      )}
    </group>
  )
}
