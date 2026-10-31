import * as THREE from "three"
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber"
import {
  Physics,
  RigidBody,
  CuboidCollider,
  type RapierRigidBody,
  type RigidBodyProps,
} from "@react-three/rapier"
import { useGLTF, Clone } from "@react-three/drei"
import { useEffect, useMemo, useRef, type ReactNode } from "react"
import { dragState } from "../states/dragState"

const MODEL_URL = "/models/letters/title.glb"
useGLTF.preload(MODEL_URL)

type Piece = {
  id: string
  object: THREE.Object3D
  position: [number, number, number]
  quaternion: [number, number, number, number]
  halfSize: [number, number, number]
  center: [number, number, number]
}

// One RigidBody per top-level node (= one letter, made of block + face meshes)
function Letters() {
  const { scene } = useGLTF(MODEL_URL)

  const pieces = useMemo<Piece[]>(() => {
    scene.updateWorldMatrix(true, true)

    return scene.children.map(node => {
      const position = node.getWorldPosition(new THREE.Vector3())
      const quaternion = node.getWorldQuaternion(new THREE.Quaternion())

      // Copy placed at the body's origin, so the transform isn't applied twice
      const local = node.clone()
      local.position.set(0, 0, 0)
      local.quaternion.identity()

      // One box around the whole letter (block + face), in body-local space
      const box = new THREE.Box3().setFromObject(local)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())

      return {
        id: node.uuid,
        object: local,
        position: position.toArray() as [number, number, number],
        quaternion: quaternion.toArray() as [number, number, number, number],
        halfSize: [size.x / 2, size.y / 2, size.z / 2],
        center: center.toArray() as [number, number, number],
      }
    })
  }, [scene])

  return (
    <>
      {pieces.map(p => (
        <RigidBody
          key={p.id}
          colliders={false}
          position={p.position}
          quaternion={p.quaternion}
          restitution={0.2}
          friction={0.8}
        >
          <CuboidCollider args={p.halfSize} position={p.center} />
          <Clone object={p.object} castShadow receiveShadow />
        </RigidBody>
      ))}
    </>
  )
}

const LIFT = .01          // how far above its resting height a grabbed object floats
const FOLLOW = 15       // how tightly the object chases the pointer
const MAX_SPEED = 25    // velocity cap, prevents tunnelling through colliders
const BOUNDS = { x: 6, z: 4 } // keep the drag target inside the invisible walls

type DraggableProps = RigidBodyProps & { children: ReactNode }

// A dynamic body that can be grabbed with the pointer. It keeps colliding with
// everything while dragged (it pushes letters), and keeps its velocity on release.
function Draggable({ children, ...props }: DraggableProps) {
  const body = useRef<RapierRigidBody>(null)
  const dragging = useRef(false)
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const offset = useMemo(() => new THREE.Vector3(), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])

  // Reset cursor and flag if the scene unmounts mid-drag
  useEffect(() => () => {
    document.body.style.cursor = ""
    dragState.active = false
  }, [])

  useFrame(() => {
    const rb = body.current
    if (!rb || !dragging.current) return
    const p = rb.translation()
    const v = new THREE.Vector3(
      (target.x - p.x) * FOLLOW,
      (target.y - p.y) * FOLLOW,
      (target.z - p.z) * FOLLOW,
    ).clampLength(0, MAX_SPEED)
    rb.setLinvel(v, true)
    rb.setAngvel({ x: 0, y: 0, z: 0 }, true)
  })

  function onPointerDown(e: ThreeEvent<PointerEvent>) {
    const rb = body.current
    if (!rb) return
    e.stopPropagation()
    // keep receiving move/up events even if the pointer leaves the object
    ;(e.target as unknown as Element).setPointerCapture(e.pointerId)

    const t = rb.translation()
    offset.set(t.x - e.point.x, t.y - e.point.y, t.z - e.point.z)
    plane.set(new THREE.Vector3(0, 1, 0), -(e.point.y + LIFT))
    target.set(t.x, t.y + LIFT, t.z)

    rb.setGravityScale(0, true)
    dragging.current = true
    dragState.active = true
    document.body.style.cursor = "grabbing"
  }

  function onPointerMove(e: ThreeEvent<PointerEvent>) {
    if (!dragging.current) return
    if (e.ray.intersectPlane(plane, hit)) {
      target.copy(hit).add(offset)
      target.x = THREE.MathUtils.clamp(target.x, -BOUNDS.x, BOUNDS.x)
      target.z = THREE.MathUtils.clamp(target.z, -BOUNDS.z, BOUNDS.z)
    }
  }

  function endDrag() {
    if (!dragging.current) return
    dragging.current = false
    body.current?.setGravityScale(1, true)
    document.body.style.cursor = "grab"
    // The touch Observer can still fire right after pointerup, so clear late
    window.setTimeout(() => { dragState.active = false }, 150)
  }

  return (
    <RigidBody ref={body} {...props}>
      <group
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onLostPointerCapture={endDrag}
        onPointerOver={() => { if (!dragging.current) document.body.style.cursor = "grab" }}
        onPointerOut={() => { if (!dragging.current) document.body.style.cursor = "" }}
      >
        {children}
      </group>
    </RigidBody>
  )
}

function Scene() {
  return (
    <Physics gravity={[0, -9.81, 0]}>
      {/* floor */}
      <RigidBody type="fixed">
        <CuboidCollider args={[20, 0.5, 20]} position={[0, -0.5, 0]} />
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#1b1b1f" />
        </mesh>
      </RigidBody>

      {/* invisible walls so nothing leaves the view */}
      <RigidBody type="fixed">
        <CuboidCollider args={[0.5, 5, 10]} position={[-7, 5, 0]} />
        <CuboidCollider args={[0.5, 5, 10]} position={[7, 5, 0]} />
        <CuboidCollider args={[10, 5, 0.5]} position={[0, 5, -5]} />
        <CuboidCollider args={[10, 5, 0.5]} position={[0, 5, 5]} />
      </RigidBody>
      
      <Letters />

      {/* cube */}
      <Draggable colliders="cuboid" position={[2, 12, 0]} restitution={0.2}>
        <mesh castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#e8e8e8" />
        </mesh>
      </Draggable>

      {/* sphere */}
      <Draggable colliders="ball" position={[-2, 5, 0]} restitution={0.5}>
        <mesh castShadow>
          <sphereGeometry args={[0.6]} />
          <meshStandardMaterial color="#e8e8e8" />
        </mesh>
      </Draggable>
    </Physics>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      style={{ touchAction: "none" }}
      camera={{ position: [0, 9, 9], fov: 45 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <Scene />
    </Canvas>
  )
}