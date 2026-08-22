import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const TIER_COLORS = { S: '#FFDD00', A: '#00E065', B: '#2E6BFF', C: '#FF8A00', D: '#FF3B30' };

const LABELLED = [
  { name: 'DLF The Ultima', rating: '9.2 ★', tier: 'S', pos: [-3.2, 0], height: 4.2 },
  { name: 'IREO Skyon', rating: '8.6 ★', tier: 'A', pos: [2.8, 1.2], height: 3.4 },
  { name: 'Sobha City', rating: '8.9 ★', tier: 'S', pos: [5.4, -1.6], height: 2.9 }
];

function Building({ position, height, color }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[1, height, 1]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* window strips */}
      {Array.from({ length: Math.floor(height) }, (_, i) => (
        <mesh key={i} position={[0, 0.55 + i * 0.95, 0.501]}>
          <planeGeometry args={[0.7, 0.18]} />
          <meshBasicMaterial color="#111111" transparent opacity={0.35} />
        </mesh>
      ))}
      {/* rooftop water tank */}
      <mesh position={[0.25, height + 0.15, 0.25]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshLambertMaterial color="#111111" />
      </mesh>
    </group>
  );
}

function Tree({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.5]} />
        <meshLambertMaterial color="#5b3a1e" />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <coneGeometry args={[0.35, 0.8, 6]} />
        <meshLambertMaterial color="#1f9d55" />
      </mesh>
    </group>
  );
}

function Car({ color, lane, offset, speed }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = ((clock.elapsedTime * speed + offset) % 24) - 12;
    ref.current.position.x = t;
  });
  return (
    <group ref={ref} position={[0, 0.16, lane]}>
      <mesh>
        <boxGeometry args={[0.45, 0.18, 0.24]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[-0.05, 0.16, 0]}>
        <boxGeometry args={[0.22, 0.14, 0.2]} />
        <meshLambertMaterial color="#111111" />
      </mesh>
    </group>
  );
}

function Label({ society, worldY, worldX, worldZ }) {
  return (
    <Html center position={[worldX, worldY, worldZ]} zIndexRange={[10, 0]} distanceFactor={12}>
      <div className="pointer-events-none select-none border-2 border-black bg-white px-2 py-1 text-center shadow-[3px_3px_0_#111]">
        <div className="font-display text-[11px] uppercase leading-tight">{society.name}</div>
        <div className="text-[11px] font-bold">{society.rating}</div>
        <div
          className="mx-auto mt-0.5 inline-block border-2 border-black px-1 text-[10px] font-black"
          style={{ background: TIER_COLORS[society.tier] }}
        >
          {society.tier} TIER
        </div>
      </div>
    </Html>
  );
}

function Badge({ children, worldX, worldY, bg = '#FFDD00' }) {
  return (
    <Html center position={[worldX, worldY, 0]} distanceFactor={14}>
      <div
        className="pointer-events-none select-none whitespace-nowrap border-2 border-black px-2 py-0.5 font-display text-[12px] shadow-[3px_3px_0_#111]"
        style={{ background: bg }}
      >
        {children}
      </div>
    </Html>
  );
}

function Rig({ enabled }) {
  useFrame(({ camera, pointer }) => {
    if (!enabled) return;
    camera.position.x += (pointer.x * 2.2 - camera.position.x) * 0.03;
    camera.position.y += (5 + pointer.y * 1.2 - camera.position.y) * 0.03;
    camera.lookAt(0, 1.5, 0);
  });
  return null;
}

function Scene({ lowPower }) {
  const buildings = useMemo(() => {
    const rng = (() => {
      let s = 42;
      return () => ((s = (s * 16807) % 2147483647) / 2147483647);
    })();
    const cols = ['#e8e2d2', '#d9d2bf', '#cfc7b2', '#efe9da'];
    const list = [];
    const count = lowPower ? 26 : 44;
    for (let i = 0; i < count; i++) {
      const x = (rng() - 0.5) * 22;
      const z = (rng() - 0.5) * 12 - 2;
      // keep the central roads clear
      if (Math.abs(z - 2) < 1.2 || Math.abs(x) < 1.2) continue;
      list.push({
        x,
        z,
        h: 0.8 + rng() * (x > 3 || x < -3 ? 3.4 : 2),
        c: cols[Math.floor(rng() * cols.length)]
      });
    }
    return list;
  }, [lowPower]);

  return (
    <group>
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshLambertMaterial color="#F4F0E6" />
      </mesh>

      {/* roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 2]}>
        <planeGeometry args={[40, 2]} />
        <meshLambertMaterial color="#333333" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.002, 0]}>
        <planeGeometry args={[30, 1.6]} />
        <meshLambertMaterial color="#333333" />
      </mesh>

      {buildings.map((b, i) => (
        <Building key={i} position={[b.x, 0, b.z]} height={b.h} color={b.c} />
      ))}

      {!lowPower &&
        [
          [-8, 4.5],
          [7, -3],
          [-5, -4],
          [9, 4],
          [-10, -1]
        ].map(([x, z], i) => <Tree key={i} position={[x, 0, z]} />)}

      <Car color="#FF3B30" lane={2.6} offset={0} speed={2.2} />
      <Car color="#2E6BFF" lane={1.4} offset={9} speed={1.8} />
      {!lowPower && <Car color="#00E065" lane={2.6} offset={17} speed={2} />}

      {LABELLED.map((s) => (
        <Label key={s.name} society={s} worldX={s.pos[0]} worldZ={s.pos[1]} worldY={s.height + 1.1} />
      ))}

      <Badge worldX={-6} worldY={6.2} bg="#FFDD00">#1 DLF The Ultima · S TIER</Badge>
      <Badge worldX={6.5} worldY={5.4} bg="#ffffff">1,842 RATINGS</Badge>
      <Badge worldX={0} worldY={-3.4} bg="#00E065">137 SOCIETIES RATED</Badge>
    </group>
  );
}

export default function Skyline3D({ lowPower = false }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 5, 13], fov: 42 }}
      gl={{ antialias: !lowPower, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 10, 4]} intensity={0.9} />
      <Rig enabled={!lowPower} />
      <Scene lowPower={lowPower} />
    </Canvas>
  );
}
