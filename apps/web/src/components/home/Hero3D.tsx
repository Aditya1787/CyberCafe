import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Ring, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Laptop, FileCheck, Printer, ShieldCheck, Sparkles, Compass } from 'lucide-react';

// Realistic Laptop Keyboard Component
function LaptopKeyboard() {
  const fnKeys = Array.from({ length: 14 });
  const numKeys = Array.from({ length: 14 });
  const qwerKeys = Array.from({ length: 14 });
  const asdfKeys = Array.from({ length: 13 });
  const zxcvKeys = Array.from({ length: 13 });
  const keyColor = "#1a2233";

  return (
    <group position={[0, -0.155, -0.22]}>
      {/* Sunken keyboard well */}
      <RoundedBox args={[2.36, 0.012, 1.02]} radius={0.02} smoothness={4} position={[0, -0.005, 0]}>
        <meshStandardMaterial color="#080c14" roughness={0.8} />
      </RoundedBox>

      {/* Row 1: Function Keys */}
      <group position={[0, 0.005, -0.41]}>
        {fnKeys.map((_, i) => (
          <RoundedBox
            key={`fn-${i}`}
            args={[0.13, 0.015, 0.08]}
            radius={0.008}
            smoothness={2}
            position={[-1.02 + i * 0.157, 0, 0]}
          >
            <meshStandardMaterial color={keyColor} roughness={0.5} />
          </RoundedBox>
        ))}
      </group>

      {/* Row 2: Numbers */}
      <group position={[0, 0.005, -0.25]}>
        {numKeys.map((_, i) => (
          <RoundedBox
            key={`num-${i}`}
            args={[0.132, 0.015, 0.125]}
            radius={0.008}
            smoothness={2}
            position={[-1.02 + i * 0.157, 0, 0]}
          >
            <meshStandardMaterial color={keyColor} roughness={0.5} />
          </RoundedBox>
        ))}
      </group>

      {/* Row 3: QWERTY */}
      <group position={[0, 0.005, -0.09]}>
        {qwerKeys.map((_, i) => (
          <RoundedBox
            key={`qwerty-${i}`}
            args={[0.132, 0.015, 0.125]}
            radius={0.008}
            smoothness={2}
            position={[-1.02 + i * 0.157, 0, 0]}
          >
            <meshStandardMaterial color={keyColor} roughness={0.5} />
          </RoundedBox>
        ))}
      </group>

      {/* Row 4: ASDF */}
      <group position={[0, 0.005, 0.07]}>
        {asdfKeys.map((_, i) => (
          <RoundedBox
            key={`asdf-${i}`}
            args={[i === 0 || i === 12 ? 0.18 : 0.132, 0.015, 0.125]}
            radius={0.008}
            smoothness={2}
            position={[-1.0 + i * 0.165, 0, 0]}
          >
            <meshStandardMaterial color={keyColor} roughness={0.5} />
          </RoundedBox>
        ))}
      </group>

      {/* Row 5: ZXCV */}
      <group position={[0, 0.005, 0.23]}>
        {zxcvKeys.map((_, i) => (
          <RoundedBox
            key={`zxcv-${i}`}
            args={[i === 0 || i === 12 ? 0.22 : 0.132, 0.015, 0.125]}
            radius={0.008}
            smoothness={2}
            position={[-0.98 + i * 0.163, 0, 0]}
          >
            <meshStandardMaterial color={keyColor} roughness={0.5} />
          </RoundedBox>
        ))}
      </group>

      {/* Row 6: Spacebar and Modifier Row */}
      <group position={[0, 0.005, 0.39]}>
        <RoundedBox args={[0.16, 0.015, 0.125]} radius={0.008} smoothness={2} position={[-0.96, 0, 0]}>
          <meshStandardMaterial color={keyColor} roughness={0.5} />
        </RoundedBox>
        <RoundedBox args={[0.15, 0.015, 0.125]} radius={0.008} smoothness={2} position={[-0.78, 0, 0]}>
          <meshStandardMaterial color={keyColor} roughness={0.5} />
        </RoundedBox>
        <RoundedBox args={[0.17, 0.015, 0.125]} radius={0.008} smoothness={2} position={[-0.59, 0, 0]}>
          <meshStandardMaterial color={keyColor} roughness={0.5} />
        </RoundedBox>

        {/* Spacebar */}
        <RoundedBox args={[0.82, 0.015, 0.125]} radius={0.008} smoothness={2} position={[0, 0, 0]}>
          <meshStandardMaterial color="#222b3d" roughness={0.5} />
        </RoundedBox>

        <RoundedBox args={[0.17, 0.015, 0.125]} radius={0.008} smoothness={2} position={[0.59, 0, 0]}>
          <meshStandardMaterial color={keyColor} roughness={0.5} />
        </RoundedBox>
        <RoundedBox args={[0.15, 0.015, 0.125]} radius={0.008} smoothness={2} position={[0.78, 0, 0]}>
          <meshStandardMaterial color={keyColor} roughness={0.5} />
        </RoundedBox>
        <RoundedBox args={[0.16, 0.015, 0.125]} radius={0.008} smoothness={2} position={[0.96, 0, 0]}>
          <meshStandardMaterial color={keyColor} roughness={0.5} />
        </RoundedBox>
      </group>
    </group>
  );
}

// Realistic Laptop Workstation with Browser Interface on Screen
function RealisticLaptop() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle mouse parallax & gentle breathing
      const targetY = state.pointer.x * 0.35;
      const targetX = -state.pointer.y * 0.25;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetY, 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetX, 0.05);
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.1, 0]}>
      {/* Sleek Aluminum Laptop Base Chassis */}
      <RoundedBox args={[2.75, 0.08, 1.85]} radius={0.035} smoothness={4} position={[0, -0.2, 0]}>
        <meshPhysicalMaterial
          color="#0f1624"
          roughness={0.3}
          metalness={0.7}
          clearcoat={0.3}
        />
      </RoundedBox>

      {/* Realistic Laptop Keyboard */}
      <LaptopKeyboard />

      {/* Sleek Matte Glass Trackpad in Palm Rest (NO BLUE COLOR) */}
      <RoundedBox args={[0.84, 0.012, 0.52]} radius={0.025} smoothness={4} position={[0, -0.156, 0.46]}>
        <meshPhysicalMaterial
          color="#161f30"
          roughness={0.35}
          metalness={0.35}
          clearcoat={0.3}
        />
      </RoundedBox>
      <mesh position={[0, -0.15, 0.46]}>
        <planeGeometry args={[0.85, 0.53]} />
        <meshBasicMaterial color="#2d3748" wireframe={true} transparent opacity={0.25} />
      </mesh>

      {/* Laptop Hinge Cylinder */}
      <mesh position={[0, -0.155, -0.85]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 2.3, 16]} />
        <meshStandardMaterial color="#0b111e" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Laptop Screen Lid & Display (tilted back at natural angle) */}
      <group position={[0, -0.1, -0.85]} rotation={[-0.25, 0, 0]}>
        {/* Sleek Laptop Bezel */}
        <RoundedBox args={[2.58, 1.68, 0.05]} radius={0.03} smoothness={4} position={[0, 0.8, 0]}>
          <meshPhysicalMaterial
            color="#0b111e"
            metalness={0.85}
            roughness={0.2}
          />
        </RoundedBox>

        {/* Display Glass Surface */}
        <mesh position={[0, 0.8, 0.03]}>
          <planeGeometry args={[2.46, 1.56]} />
          <meshBasicMaterial color="#090e18" />
        </mesh>

        {/* Operating System & Browser Portal Interface on Screen */}
        <group position={[0, 0.8, 0.035]}>
          {/* Top Browser Header Bar */}
          <mesh position={[0, 0.68, 0]}>
            <planeGeometry args={[2.44, 0.16]} />
            <meshBasicMaterial color="#111827" />
          </mesh>

          {/* Window control dots: Red, Yellow, Green */}
          <mesh position={[-1.08, 0.68, 0.005]}>
            <circleGeometry args={[0.024, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <mesh position={[-1.01, 0.68, 0.005]}>
            <circleGeometry args={[0.024, 16]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[-0.94, 0.68, 0.005]}>
            <circleGeometry args={[0.024, 16]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>

          {/* Browser Address Bar Pill */}
          <RoundedBox args={[1.15, 0.09, 0.005]} radius={0.02} smoothness={2} position={[0, 0.68, 0.005]}>
            <meshBasicMaterial color="#0b111e" />
          </RoundedBox>
          <Text
            position={[0, 0.68, 0.01]}
            fontSize={0.046}
            color="#7dd3fc"
            anchorX="center"
            anchorY="middle"
          >
            🔒 baba-andeshwar-cafe.in/portal
          </Text>

          {/* Wi-Fi / Battery Status indicator */}
          <Text
            position={[1.0, 0.68, 0.01]}
            fontSize={0.042}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            ONLINE 100%
          </Text>

          {/* Desktop Wallpaper Hero Card Background */}
          <RoundedBox args={[2.26, 1.18, 0.005]} radius={0.04} smoothness={3} position={[0, -0.02, 0.005]}>
            <meshStandardMaterial
              color="#0d182b"
              roughness={0.3}
              metalness={0.2}
            />
          </RoundedBox>

          {/* Inner Accent Header Card inside screen */}
          <RoundedBox args={[2.08, 0.46, 0.006]} radius={0.03} smoothness={3} position={[0, 0.28, 0.01]}>
            <meshStandardMaterial
              color="#13233f"
              roughness={0.4}
              metalness={0.3}
            />
          </RoundedBox>

          {/* Top pill */}
          <Text
            position={[0, 0.43, 0.015]}
            fontSize={0.048}
            color="#38bdf8"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            letterSpacing={0.04}
          >
            OFFICIAL DIGITAL CITIZEN PORTAL
          </Text>

          {/* BABA Andeshwar Heading */}
          <Text
            position={[0, 0.31, 0.015]}
            fontSize={0.14}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            letterSpacing={0.02}
          >
            BABA Andeshwar
          </Text>

          {/* internet cafe Subtitle */}
          <Text
            position={[0, 0.17, 0.015]}
            fontSize={0.11}
            color="#38bdf8"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            internet cafe
          </Text>

          {/* Location & Subtext */}
          <Text
            position={[0, 0.03, 0.015]}
            fontSize={0.065}
            color="#cbd5e1"
            anchorX="center"
            anchorY="middle"
          >
            Hanspuram, Naubasta, Kanpur &bull; Fast Appointments & Walk-ins
          </Text>

          {/* 3 Quick Action Tiles on Laptop Screen */}
          <group position={[0, -0.22, 0.015]}>
            {/* Tile 1: Govt Services */}
            <RoundedBox args={[0.62, 0.28, 0.005]} radius={0.02} smoothness={2} position={[-0.68, 0, 0]}>
              <meshBasicMaterial color="#122036" />
            </RoundedBox>
            <Text position={[-0.68, 0.06, 0.01]} fontSize={0.062} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
              PAN & Aadhaar
            </Text>
            <Text position={[-0.68, -0.06, 0.01]} fontSize={0.045} color="#38bdf8" anchorX="center" anchorY="middle">
              Instant Apply
            </Text>

            {/* Tile 2: Train & Travel */}
            <RoundedBox args={[0.62, 0.28, 0.005]} radius={0.02} smoothness={2} position={[0, 0, 0]}>
              <meshBasicMaterial color="#122036" />
            </RoundedBox>
            <Text position={[0, 0.06, 0.01]} fontSize={0.062} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
              IRCTC Tickets
            </Text>
            <Text position={[0, -0.06, 0.01]} fontSize={0.045} color="#fbbf24" anchorX="center" anchorY="middle">
              Train & Flights
            </Text>

            {/* Tile 3: Print & Xerox */}
            <RoundedBox args={[0.62, 0.28, 0.005]} radius={0.02} smoothness={2} position={[0.68, 0, 0]}>
              <meshBasicMaterial color="#122036" />
            </RoundedBox>
            <Text position={[0.68, 0.06, 0.01]} fontSize={0.062} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
              Color Xerox
            </Text>
            <Text position={[0.68, -0.06, 0.01]} fontSize={0.045} color="#c084fc" anchorX="center" anchorY="middle">
              Photo & Print
            </Text>
          </group>

          {/* Bottom Live System Indicator */}
          <group position={[0, -0.46, 0.015]}>
            <mesh position={[-0.48, 0, 0]}>
              <circleGeometry args={[0.018, 16]} />
              <meshBasicMaterial color="#34d399" />
            </mesh>
            <Text
              position={[0.08, 0, 0]}
              fontSize={0.052}
              color="#34d399"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              Live System Active &bull; Slotted Appointments Open
            </Text>
          </group>
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

// Scene Composition with Soft, Low-Glare Lighting (NO BLUE RINGS)
function MinimalGlassScene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-3, 2, 0]} intensity={0.7} color="#38bdf8" />
      <pointLight position={[3, -2, 1]} intensity={0.5} color="#fbbf24" />

      {/* Central Realistic Laptop with Full Screen UI & Keyboard (NO BLUE TRACKPAD) */}
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
        <RealisticLaptop />
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
