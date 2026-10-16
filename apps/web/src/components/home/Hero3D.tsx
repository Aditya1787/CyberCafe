import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { Laptop, FileCheck, Printer, ShieldCheck, Sparkles, Compass } from 'lucide-react';

// Floating Glass Core (Workstation / Cyber Kiosk)
function GlassCentralKiosk() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle mouse parallax & gentle breathing
      const targetY = state.pointer.x * 0.4;
      const targetX = -state.pointer.y * 0.3;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetY, 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetX, 0.05);
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.1, 0]}>
      {/* Sleek Minimalist Glass Workstation Base */}
      <RoundedBox args={[2.6, 0.08, 1.7]} radius={0.03} smoothness={4} position={[0, -0.2, 0]}>
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* Trackpad glowing glass strip */}
      <mesh position={[0, -0.15, 0.45]}>
        <planeGeometry args={[0.7, 0.45]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Floating Holographic Display Screen (tilted at ~105 deg) */}
      <group position={[0, -0.1, -0.8]} rotation={[-0.25, 0, 0]}>
        {/* Sleek Aluminum bezel */}
        <RoundedBox args={[2.5, 1.6, 0.05]} radius={0.03} smoothness={4} position={[0, 0.8, 0]}>
          <meshPhysicalMaterial
            color="#0f172a"
            metalness={0.9}
            roughness={0.15}
          />
        </RoundedBox>

        {/* Translucent Glass Display Panel */}
        <mesh position={[0, 0.8, 0.03]}>
          <planeGeometry args={[2.35, 1.45]} />
          <meshPhysicalMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.6}
            roughness={0.1}
            transmission={0.4}
            thickness={0.2}
          />
        </mesh>

        {/* Minimalist Digital UI Grid lines */}
        <mesh position={[0, 0.8, 0.04]}>
          <planeGeometry args={[2.2, 1.3]} />
          <meshBasicMaterial color="#38bdf8" wireframe={true} transparent opacity={0.25} />
        </mesh>
      </group>
    </group>
  );
}

// Minimalist Floating Glass Service Card
function FloatingGlassBadge({
  position,
  color,
  rotation,
  scale = 1,
  accentColor = '#38bdf8'
}: {
  position: [number, number, number];
  color: string;
  rotation: [number, number, number];
  scale?: number;
  accentColor?: string;
}) {
  const badgeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (badgeRef.current) {
      badgeRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.06;
      badgeRef.current.rotation.z =
        rotation[2] + Math.cos(state.clock.elapsedTime * 0.8) * 0.04;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={badgeRef} position={position} rotation={rotation} scale={scale}>
        {/* Frosted Glass Body */}
        <RoundedBox args={[1.05, 1.4, 0.04]} radius={0.05} smoothness={4}>
          <meshPhysicalMaterial
            color={color}
            roughness={0.1}
            metalness={0.1}
            transmission={0.8}
            thickness={0.5}
            transparent
            opacity={0.85}
          />
        </RoundedBox>

        {/* Top Minimal Accent Chip */}
        <mesh position={[0, 0.5, 0.025]}>
          <planeGeometry args={[0.7, 0.12]} />
          <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Inner Document Graphic Lines */}
        <mesh position={[0, 0.15, 0.025]}>
          <planeGeometry args={[0.75, 0.04]} />
          <meshBasicMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[0, -0.05, 0.025]}>
          <planeGeometry args={[0.65, 0.04]} />
          <meshBasicMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[-0.1, -0.25, 0.025]}>
          <planeGeometry args={[0.45, 0.04]} />
          <meshBasicMaterial color="#94a3b8" />
        </mesh>
      </group>
    </Float>
  );
}

// Concentric Orbiting Neon Glass Rings
function OrbitingRings() {
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef1.current) {
      ringRef1.current.rotation.z = state.clock.elapsedTime * 0.2;
      ringRef1.current.rotation.x = 1.1 + Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -state.clock.elapsedTime * 0.15;
      ringRef2.current.rotation.y = 0.5 + Math.cos(state.clock.elapsedTime * 0.12) * 0.1;
    }
  });

  return (
    <>
      <mesh ref={ringRef1} position={[0, 0.1, -0.2]}>
        <torusGeometry args={[2.2, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      <mesh ref={ringRef2} position={[0, 0.1, -0.3]}>
        <torusGeometry args={[2.7, 0.012, 16, 100]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
    </>
  );
}

// Particle Constellation
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);

  const count = 70;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#bae6fd"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Scene Composition
function MinimalGlassScene() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[6, 8, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-4, 3, -1]} intensity={2.0} color="#38bdf8" />
      <pointLight position={[4, -3, 2]} intensity={1.5} color="#fbbf24" />
      <pointLight position={[0, 4, 3]} intensity={1.0} color="#a855f7" />

      {/* Orbiting Tech Rings */}
      <OrbitingRings />

      {/* Central Glass Kiosk */}
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.3}>
        <GlassCentralKiosk />
      </Float>

      {/* 4 Floating Glass Service Badges */}
      {/* 1. PAN & Aadhaar (Left Top) */}
      <FloatingGlassBadge
        position={[-1.85, 0.85, 0.4]}
        rotation={[0.15, 0.35, -0.1]}
        color="#f8fafc"
        accentColor="#0284c7"
      />

      {/* 2. UP eDistrict & Schemes (Right Top) */}
      <FloatingGlassBadge
        position={[1.85, 0.9, -0.2]}
        rotation={[0.1, -0.3, 0.12]}
        color="#f0fdf4"
        accentColor="#16a34a"
      />

      {/* 3. IRCTC Railway Tickets (Right Bottom) */}
      <FloatingGlassBadge
        position={[1.65, -0.75, 0.6]}
        rotation={[-0.15, -0.25, -0.08]}
        color="#fffbeb"
        accentColor="#f59e0b"
      />

      {/* 4. Urgent Xerox & Print Hub (Left Bottom) */}
      <FloatingGlassBadge
        position={[-1.75, -0.8, -0.3]}
        rotation={[0.2, 0.35, 0.12]}
        color="#faf5ff"
        accentColor="#9333ea"
      />

      {/* Constellation */}
      <ParticleField />
    </>
  );
}

// Static Fallback Component
export const Hero3DFallback: React.FC = () => {
  return (
    <div className="relative w-full h-[380px] sm:h-[460px] rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-8 flex flex-col items-center justify-center text-white overflow-hidden shadow-2xl">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center gap-5 text-center">
        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
          <Laptop className="w-10 h-10 text-sky-400" />
        </div>
        <div className="space-y-1 max-w-xs">
          <span className="text-[11px] uppercase tracking-widest text-sky-400 font-semibold">
            Interactive Digital Hub
          </span>
          <h4 className="text-base sm:text-lg font-bold text-white">Baba Anandeshwar Internet Cafe</h4>
          <p className="text-xs text-slate-300">
            Hanspuram, Naubasta, Kanpur &bull; Fast Appointments & Walk-ins
          </p>
        </div>
      </div>
    </div>
  );
};

export const Hero3D: React.FC = () => {
  return (
    <div className="w-full h-[310px] sm:h-[420px] md:h-[480px] relative rounded-3xl overflow-hidden neo-card-dark border border-white/10 group select-none">
      
      {/* Background glow highlights */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-sky-500/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-teal-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Top minimal status bar */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/10 text-[11px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Live Station</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] text-slate-300">
          <Compass className="w-3 h-3 text-sky-400" />
          <span>Interactive 3D</span>
        </div>
      </div>

      {/* 3D Canvas with phone touch scroll support */}
      <Suspense fallback={<Hero3DFallback />}>
        <Canvas
          camera={{ position: [0, 0, 4.8], fov: 46 }}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ touchAction: 'pan-y' }}
          gl={{ antialias: true, alpha: true }}
          onError={() => {
            console.warn('WebGL initialization error, falling back to static visual illustration');
          }}
        >
          <MinimalGlassScene />
        </Canvas>
      </Suspense>

      {/* Bottom info pill */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-20 flex items-center justify-between text-slate-300 text-[10px] sm:text-[11px] px-3.5 py-2 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/10 pointer-events-none">
        <span className="flex items-center gap-1.5 text-white font-medium truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>PAN, Aadhaar, IRCTC, Scholarships</span>
        </span>
        <span className="hidden sm:inline text-slate-400 flex-shrink-0">Kanpur &bull; Naubasta</span>
      </div>
    </div>
  );
};
