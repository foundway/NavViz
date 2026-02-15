import * as THREE from 'three'

const GRADIENT_DELTA = 0.1
const GRAVITY_STRENGTH = 0.12
const STEERING_STRENGTH = 0.15
const INERTIA = 0.88
const MAX_SPEED = 0.45
const MAX_STEPS = 200
const ARRIVAL_DIST = 1

function getGradient(
  getHeight: (x: number, z: number) => number,
  x: number,
  z: number
): THREE.Vector2 {
  const d = GRADIENT_DELTA
  const gx = (getHeight(x + d, z) - getHeight(x - d, z)) / (2 * d)
  const gz = (getHeight(x, z + d) - getHeight(x, z - d)) / (2 * d)
  return new THREE.Vector2(gx, gz)
}

export function runPhysicsPath(
  getHeight: (x: number, z: number) => number,
  start: THREE.Vector3,
  end: THREE.Vector3,
  slopePenalty: number
): THREE.Vector3[] {
  const path: THREE.Vector3[] = [start.clone()]
  const pos = start.clone()
  const vel = new THREE.Vector2(0, 0)

  for (let i = 0; i < MAX_STEPS; i++) {
    const grad = getGradient(getHeight, pos.x, pos.z)
    const toTargetX = end.x - pos.x
    const toTargetZ = end.z - pos.z
    const distHz = Math.sqrt(toTargetX * toTargetX + toTargetZ * toTargetZ) || 1
    const steerX = (toTargetX / distHz) * STEERING_STRENGTH
    const steerZ = (toTargetZ / distHz) * STEERING_STRENGTH

    const gravityX = -grad.x * GRAVITY_STRENGTH
    const gravityZ = -grad.y * GRAVITY_STRENGTH

    vel.x = vel.x * INERTIA + gravityX + steerX
    vel.y = vel.y * INERTIA + gravityZ + steerZ

    const uphill = vel.x * grad.x + vel.y * grad.y
    if (uphill > 0) {
      const resist = 1 / (1 + slopePenalty * 0.15 * uphill)
      vel.x *= resist
      vel.y *= resist
    }

    const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y) || 1e-6
    if (speed > MAX_SPEED) {
      vel.x *= MAX_SPEED / speed
      vel.y *= MAX_SPEED / speed
    }

    pos.x += vel.x
    pos.z += vel.y
    pos.y = getHeight(pos.x, pos.z)
    path.push(pos.clone())

    if (pos.distanceTo(end) < ARRIVAL_DIST) break
  }
  return path
}
