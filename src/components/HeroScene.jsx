import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 200;

/* ── Drifting particles + mouse repulsion ── */
function Particles({ mouse }) {
  const mesh = useRef();
  const { size } = useThree();

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      velocities.push({
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.002,
      });
    }
    return { positions, velocities };
  }, []);

  useFrame((state) => {
    const geo = mesh.current.geometry;
    const pos = geo.attributes.position.array;
    const t = state.clock.elapsedTime;
    const mx = (mouse.current.x / size.width  - 0.5) * 14;
    const my = -(mouse.current.y / size.height - 0.5) * 8;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      pos[ix]     += velocities[i].x;
      pos[ix + 1] += velocities[i].y + Math.sin(t * 0.25 + i) * 0.0004;

      const dx = pos[ix] - mx;
      const dy = pos[ix + 1] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2.5 && dist > 0.01) {
        pos[ix]     += (dx / dist) * 0.014;
        pos[ix + 1] += (dy / dist) * 0.009;
      }

      if (pos[ix]     >  8.5) pos[ix]     = -8.5;
      if (pos[ix]     < -8.5) pos[ix]     =  8.5;
      if (pos[ix + 1] >  5.0) pos[ix + 1] = -5.0;
      if (pos[ix + 1] < -5.0) pos[ix + 1] =  5.0;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#b8c4d4" transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── Static web of connecting lines ── */
function Lines() {
  const staticPositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < 60; i++) {
      const ax = (Math.random() - 0.5) * 16;
      const ay = (Math.random() - 0.5) * 9;
      const bx = ax + (Math.random() - 0.5) * 4;
      const by = ay + (Math.random() - 0.5) * 3;
      pos.push(ax, ay, -1, bx, by, -1);
    }
    return new Float32Array(pos);
  }, []);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[staticPositions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#2a3a4c" transparent opacity={0.2} depthWrite={false} />
    </lineSegments>
  );
}

/* ── Slowly rotating wireframe shapes ── */
function FloatingShape({ position, geometry, speed, axis }) {
  const mesh = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (axis === "y") {
      mesh.current.rotation.y = t;
      mesh.current.rotation.x = t * 0.4;
    } else {
      mesh.current.rotation.z = t;
      mesh.current.rotation.x = t * 0.3;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      {geometry}
      <meshBasicMaterial color="#4a6080" wireframe transparent opacity={0.25} depthWrite={false} />
    </mesh>
  );
}

function FloatingShapes() {
  const shapes = useMemo(() => [
    { position: [-5.5,  2.2, -2], geometry: <icosahedronGeometry args={[0.55, 1]} />, speed: 0.18, axis: "y" },
    { position: [ 5.2, -1.8, -3], geometry: <octahedronGeometry args={[0.65]} />,     speed: 0.13, axis: "x" },
    { position: [ 3.8,  2.8, -2], geometry: <tetrahedronGeometry args={[0.5]} />,     speed: 0.22, axis: "y" },
    { position: [-4.2, -2.5, -1.5], geometry: <icosahedronGeometry args={[0.4, 0]} />, speed: 0.16, axis: "x" },
    { position: [ 0.8,  3.2, -3.5], geometry: <octahedronGeometry args={[0.45]} />,   speed: 0.1,  axis: "y" },
    { position: [-2.8,  0.5, -2.5], geometry: <tetrahedronGeometry args={[0.38]} />,  speed: 0.2,  axis: "x" },
  ], []);

  return (
    <>
      {shapes.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}
    </>
  );
}

/* ── Slowly sweeping ring ── */
function SweepRing() {
  const mesh = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.07;
    mesh.current.rotation.z = t;
    mesh.current.rotation.x = Math.sin(t * 0.4) * 0.5 + 0.8;
  });

  return (
    <mesh ref={mesh} position={[1.2, -0.5, -4]}>
      <torusGeometry args={[2.2, 0.008, 3, 80]} />
      <meshBasicMaterial color="#3a5570" transparent opacity={0.18} depthWrite={false} />
    </mesh>
  );
}

/* ── Second ring, offset ── */
function SweepRing2() {
  const mesh = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.05;
    mesh.current.rotation.z = -t * 1.3;
    mesh.current.rotation.y = Math.cos(t * 0.5) * 0.6 + 0.4;
  });

  return (
    <mesh ref={mesh} position={[-1.5, 0.8, -5]}>
      <torusGeometry args={[1.6, 0.006, 3, 60]} />
      <meshBasicMaterial color="#2a4560" transparent opacity={0.14} depthWrite={false} />
    </mesh>
  );
}

/* ── Sparse floating dots at depth ── */
function DeepDots() {
  const positions = useMemo(() => {
    const pos = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = -5 - Math.random() * 4;
    }
    return pos;
  }, []);

  const mesh = useRef();
  useFrame((state) => {
    mesh.current.rotation.z = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#6080a0" transparent opacity={0.2} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── Camera drifts toward the cursor and rises with scroll ── */
function CameraRig({ mouse }) {
  const { camera, size } = useThree();

  useFrame(() => {
    const tx = (mouse.current.x / size.width - 0.5) * 0.6;
    const ty = -(mouse.current.y / size.height - 0.5) * 0.35;
    const scroll = window.scrollY * 0.0006;

    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (ty + scroll - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function GlobalScene() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent", pointerEvents: "none" }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]}
      >
        <CameraRig mouse={mouse} />
        <DeepDots />
        <SweepRing />
        <SweepRing2 />
        <FloatingShapes />
        <Lines />
        <Particles mouse={mouse} />
      </Canvas>
    </div>
  );
}
