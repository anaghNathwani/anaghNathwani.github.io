import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 180;

function Particles({ mouse }) {
  const mesh = useRef();
  const { size } = useThree();

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
      vel.push({
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.002,
      });
    }
    return [pos, vel];
  }, []);

  useFrame((state) => {
    const geo = mesh.current.geometry;
    const pos = geo.attributes.position.array;
    const t = state.clock.elapsedTime;

    const mx = (mouse.current.x / size.width  - 0.5) * 10;
    const my = -(mouse.current.y / size.height - 0.5) * 5;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;

      pos[ix]     += velocities[i].x;
      pos[ix + 1] += velocities[i].y + Math.sin(t * 0.3 + i) * 0.0005;

      const dx = pos[ix] - mx;
      const dy = pos[ix + 1] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2.5 && dist > 0.01) {
        pos[ix]     += (dx / dist) * 0.015;
        pos[ix + 1] += (dy / dist) * 0.01;
      }

      if (pos[ix]     >  6.5) pos[ix]     = -6.5;
      if (pos[ix]     < -6.5) pos[ix]     =  6.5;
      if (pos[ix + 1] >  3.5) pos[ix + 1] = -3.5;
      if (pos[ix + 1] < -3.5) pos[ix + 1] =  3.5;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#c9912a"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Lines() {
  const staticPositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < 50; i++) {
      const ax = (Math.random() - 0.5) * 12;
      const ay = (Math.random() - 0.5) * 6;
      const bx = ax + (Math.random() - 0.5) * 3.5;
      const by = ay + (Math.random() - 0.5) * 2;
      pos.push(ax, ay, -0.5, bx, by, -0.5);
    }
    return new Float32Array(pos);
  }, []);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[staticPositions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#8a6118" transparent opacity={0.1} depthWrite={false} />
    </lineSegments>
  );
}

export default function HeroScene() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]}
      >
        <Lines />
        <Particles mouse={mouse} />
      </Canvas>
    </div>
  );
}
