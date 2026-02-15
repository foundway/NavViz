import * as THREE from 'three'

export function runStraightLine(
  getHeight: (x: number, z: number) => number,
  start: THREE.Vector3,
  end: THREE.Vector3,
  steps = 80
): THREE.Vector3[] {
  const path: THREE.Vector3[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = start.x + (end.x - start.x) * t
    const z = start.z + (end.z - start.z) * t
    const y = getHeight(x, z)
    path.push(new THREE.Vector3(x, y, z))
  }
  return path
}
