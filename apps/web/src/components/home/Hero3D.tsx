import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Ring, Text } from '@react-three/drei';
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
      {/* Sleek Minimalist Workstation Base */}
      <RoundedBox args={[2.7, 0.08, 1.8]} radius={0.03} smoothness={4} position={[0, -0.2, 0]}>
        <meshPhysicalMaterial
          color="#0b111e"
          roughness={0.3}
          metalness={0.7}
          clearcoat={0.5}
        />
      </RoundedBox>

      {/* Trackpad glowing glass strip */}
      <mesh position={[0, -0.15, 0.45]}>
        <planeGeometry args={[0.7, 0.45]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Floating Display Screen (tilted at ~105 deg) */}
      <group position={[0, -0.1, -0.8]} rotation={[-0.25, 0, 0]}>
        {/* Sleek bezel */}
        <RoundedBox args={[2.55, 1.65, 0.05]} radius={0.03} smoothness={4} position={[0, 0.8, 0]}>
          <meshPhysicalMaterial
            color="#0b111e"
            metalness={0.8}
            roughness={0.25}
          />
        </RoundedBox>

        {/* Display Panel */}
        <mesh position={[0, 0.8, 0.03]}>
          <planeGeometry args={[2.42, 1.52]} />
          <meshPhysicalMaterial
            color="#0f172a"
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>

        {/* Text on Computer Screen: BABA Andeshwar internet cafe */}
        <group position={[0, 0.8, 0.045]}>
          <Text
            position={[0, 0.32, 0]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            letterSpacing={0.02}
          >
            BABA Andeshwar
          </Text>
          <Text
            position={[0, 0.12, 0]}
            fontSize={0.13}
            color="#38bdf8"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            internet cafe
          </Text>
          <Text
            position={[0, -0.12, 0]}
            fontSize={0.08}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            Hanspuram, Naubasta, Kanpur
          </Text>
          <Text
            position={[0, -0.32, 0]}
            fontSize={0.072}
            color="#34d399"
            anchorX="center"
            anchorY="middle"
          >
            ● Live Digital Services Hub
          </Text>
        </group>
      </group>
    </group>
  );
}

// Floating Service Paper in the Back with Written Services
function FloatingServicePaper({
  position,
  rotation,
  scale = 1,
  accentColor = '#0284c7',
  serviceName,
  serviceDetail,
  badgeNumber,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  accentColor?: string;
  serviceName: string;
  serviceDetail: string;
  badgeNumber: string;
}) {
  const badgeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (badgeRef.current) {
      badgeRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.05;
      badgeRef.current.rotation.z =
        rotation[2] + Math.cos(state.clock.elapsedTime * 0.8) * 0.03;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={badgeRef} position={position} rotation={rotation} scale={scale}>
        {/* Paper Document Body */}
        <RoundedBox args={[1.2, 1.5, 0.03]} radius={0.04} smoothness={4}>
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.4}
            metalness={0.05}
          />
        </RoundedBox>

        {/* Top Header Strip with Service Number */}
        <mesh position={[0, 0.54, 0.02]}>
          <planeGeometry args={[0.95, 0.18]} />
          <meshStandardMaterial color={accentColor} roughness={0.3} />
        </mesh>
        <Text
          position={[0, 0.54, 0.03]}
          fontSize={0.075}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {badgeNumber}
        </Text>

        {/* Written Service Title */}
        <Text
          position={[0, 0.22, 0.025]}
          fontSize={0.11}
          maxWidth={1.05}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          textAlign="center"
        >
          {serviceName}
        </Text>

        {/* Written Service Details */}
        <Text
          position={[0, -0.04, 0.025]}
          fontSize={0.08}
          maxWidth={1.05}
          color="#334155"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
        >
          {serviceDetail}
        </Text>

        {/* Document Divider & Verified Tag */}
        <mesh position={[0, -0.28, 0.02]}>
          <planeGeometry args={[0.7, 0.02]} />
          <meshBasicMaterial color="#cbd5e1" />
        </mesh>
        <Text
          position={[0, -0.42, 0.025]}
          fontSize={0.068}
          color={accentColor}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Verified Service
        </Text>
      </group>
    </Float>
  );
}

// Concentric Orbiting Rings with Soft Muted Lighting
function OrbitingRings() {
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef1.current) {
      ringRef1.current.rotation.z = state.clock.elapsedTime * 0.15;
      ringRef1.current.rotation.x = 1.1 + Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -state.clock.elapsedTime * 0.12;
      ringRef2.current.rotation.y = 0.5 + Math.cos(state.clock.elapsedTime * 0.1) * 0.08;
    }
  });

  return (
    <>
      <mesh ref={ringRef1} position={[0, 0.1, -0.2]}>
        <torusGeometry args={[2.2, 0.012, 16, 100]} />
        <meshStandardMaterial
          color="#0284c7"
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>

      <mesh ref={ringRef2} position={[0, 0.1, -0.3]}>
        <torusGeometry args={[2.7, 0.01, 16, 100]} />
        <meshStandardMaterial
          color="#d97706"
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
    </>
  );
}

// Particle Constellation
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);

  const count = 50;
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
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
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
        size={0.03}
        color="#7dd3fc"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// Scene Composition with Soft, Low-Glare Lighting
function MinimalGlassScene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-3, 2, 0]} intensity={0.7} color="#38bdf8" />
      <pointLight position={[3, -2, 1]} intensity={0.5} color="#fbbf24" />

      {/* Orbiting Tech Rings */}
      <OrbitingRings />

      {/* Central Workstation with BABA Andeshwar internet cafe written on screen */}
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
        <GlassCentralKiosk />
      </Float>

      {/* 4 Written Service Papers in the Back */}
      {/* 1. PAN & Aadhaar (Left Top) */}
      <FloatingServicePaper
        position={[-1.9, 0.85, 0.3]}
        rotation={[0.12, 0.35, -0.08]}
        accentColor="#0284c7"
        badgeNumber="SERVICE 1"
        serviceName="PAN & Aadhaar"
        serviceDetail="New Apply, Update & PVC Cards"
      />

      {/* 2. UP e-District & Govt Schemes (Right Top) */}
      <FloatingServicePaper
        position={[1.9, 0.9, -0.2]}
        rotation={[0.1, -0.3, 0.1]}
        accentColor="#16a34a"
        badgeNumber="SERVICE 2"
        serviceName="Govt Schemes"
        serviceDetail="Ayushman Bharat, Income & Caste"
      />

      {/* 3. IRCTC Railway Tickets (Right Bottom) */}
      <FloatingServicePaper
        position={[1.75, -0.75, 0.5]}
        rotation={[-0.12, -0.25, -0.06]}
        accentColor="#ea580c"
        badgeNumber="SERVICE 3"
        serviceName="Train Tickets"
        serviceDetail="IRCTC Booking, Air & Bus Travels"
      />

      {/* 4. Printing & Xerox Hub (Left Bottom) */}
      <FloatingServicePaper
        position={[-1.8, -0.8, -0.3]}
        rotation={[0.18, 0.32, 0.1]}
        accentColor="#9333ea"
        badgeNumber="SERVICE 4"
        serviceName="Printing & Xerox"
        serviceDetail="Photo Print, Color Copy & Binding"
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
      
      {/* Background glow highlights - soft & low glare */}
      <div className="absolute top-0 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-sky-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-teal-500/5 rounded-full blur-[80px] pointer-events-none" />

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
