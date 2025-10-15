// 🎰 프리미엄 3D 환경 및 렌더링 시스템
import * as THREE from 'three';
// Post-processing and physics imports removed for compatibility
import { 
  Environment, 
  PresentationControls, 
  Float, 
  Text3D, 
  MeshReflectorMaterial,
  Sparkles,
  Stars,
  Sky,
  AccumulativeShadows,
  RandomizedLight
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { useRef, useState, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';

// 🌟 프리미엄 소재 시스템
class PremiumMaterials {
  static holographicMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0,
    transmission: 0.95,
    thickness: 0.1,
    ior: 1.4,
    iridescence: 1,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [100, 800],
    clearcoat: 1,
    clearcoatRoughness: 0
  });

  static glassMorphism = new THREE.MeshPhysicalMaterial({
    roughness: 0.1,
    transmission: 0.9,
    thickness: 0.05,
    ior: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    normalScale: new THREE.Vector2(0.15, 0.15)
  });

  static neonMaterial = new THREE.MeshStandardMaterial({
    emissive: new THREE.Color('#ff00ff'),
    emissiveIntensity: 2,
    transparent: true,
    opacity: 0.8
  });

  static crystalMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0,
    transmission: 1,
    thickness: 0.5,
    ior: 2.417, // Diamond IOR
    clearcoat: 1,
    clearcoatRoughness: 0
  });
}

// 🎆 프리미엄 3D 슬롯 릴 (물리 기반)
interface PremiumSlot3DReelProps {
  symbol: string;
  position: [number, number, number];
  isSpinning: boolean;
  isWinning: boolean;
  spinSpeed: number;
  materialType: 'holographic' | 'glass' | 'neon' | 'crystal';
}

const PremiumSlot3DReel: React.FC<PremiumSlot3DReelProps> = ({ 
  symbol, 
  position, 
  isSpinning, 
  isWinning,
  spinSpeed,
  materialType = 'glass'
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // 🌈 동적 머티리얼 선택
  const material = useMemo(() => {
    switch (materialType) {
      case 'holographic': return PremiumMaterials.holographicMaterial;
      case 'neon': return PremiumMaterials.neonMaterial;
      case 'crystal': return PremiumMaterials.crystalMaterial;
      default: return PremiumMaterials.glassMorphism;
    }
  }, [materialType]);

  // 🎪 고급 애니메이션 시스템
  useFrame((state, delta) => {
    if (meshRef.current) {
      // 스핀 애니메이션
      if (isSpinning) {
        meshRef.current.rotation.y += delta * spinSpeed;
        meshRef.current.rotation.x += Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
      
      // 승리 애니메이션
      if (isWinning) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 5) * 0.1);
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      }
      
      // 호버 효과
      if (hovered) {
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.1;
      }
    }

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.2}>
        <group>
          {/* 메인 슬롯 큐브 */}
          <mesh
            ref={meshRef}
            material={material}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[2, 2, 2]} />
            
            {/* 네온 테두리 */}
            <lineSegments>
              <edgesGeometry attach="geometry" />
              <lineBasicMaterial 
                color={isWinning ? '#ffd700' : '#00ffff'} 
                transparent
                opacity={0.8}
              />
            </lineSegments>
          </mesh>
          
          {/* 홀로그램 심볼 오버레이 */}
          <Text3D
            font="/fonts/Inter_Bold.json"
            size={0.8}
            height={0.05}
            position={[0, 0, 1.1]}
            material={new THREE.MeshBasicMaterial({ 
              color: isWinning ? '#ffd700' : '#ffffff',
              transparent: true,
              opacity: 0.9
            })}
          >
            {symbol}
          </Text3D>
          
          {/* 파티클 효과 */}
          {isWinning && (
            <Sparkles
              count={50}
              scale={3}
              size={6}
              speed={1.5}
              color="#ffd700"
              opacity={0.6}
            />
          )}
        </group>
      </Float>
    </group>
  );
};

// 🌌 프리미엄 3D 환경
const PremiumEnvironment: React.FC<{ theme: 'space' | 'casino' | 'cyber' | 'crystal' }> = ({ 
  theme = 'cyber' 
}) => {
  const environmentRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (environmentRef.current) {
      environmentRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const environmentSettings = useMemo(() => {
    switch (theme) {
      case 'space':
        return { preset: 'night', background: '#000511' };
      case 'casino':
        return { preset: 'studio', background: '#2a0845' };
      case 'crystal':
        return { preset: 'dawn', background: '#e6f3ff' };
      default: // cyber
        return { preset: 'city', background: '#0a0a0f' };
    }
  }, [theme]);

  return (
    <group ref={environmentRef}>
      {/* 동적 환경 */}
      <Environment preset={environmentSettings.preset as "city" | "dawn" | "night" | "studio"} />
      
      {/* 배경 그라데이션 */}
      <color attach="background" args={[environmentSettings.background]} />
      
      {/* 테마별 특수 효과 */}
      {theme === 'space' && (
        <>
          <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade />
          <Sky 
            distance={450000} 
            sunPosition={[0, 1, 0]} 
            inclination={0.49} 
            azimuth={0.25} 
          />
        </>
      )}
      
      {theme === 'cyber' && (
        <>
          {/* 네온 그리드 바닥 */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={2048}
              mixBlur={1}
              mixStrength={50}
              roughness={1}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#050505"
              metalness={0.5}
            />
          </mesh>
          
          {/* 네온 튜브들 */}
          {Array.from({ length: 20 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 40,
              Math.random() * 20 - 10,
              (Math.random() - 0.5) * 40
            ]}>
              <cylinderGeometry args={[0.1, 0.1, Math.random() * 10 + 5]} />
              <meshStandardMaterial 
                emissive="#00ffff" 
                emissiveIntensity={1.5}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
        </>
      )}
      
      {/* 고급 조명 시스템 */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* 다이나믹 스포트라이트 */}
      <spotLight
        position={[10, 20, 10]}
        angle={0.15}
        penumbra={1}
        intensity={2}
        color="#ff6b6b"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      <spotLight
        position={[-10, 20, -10]}
        angle={0.15}
        penumbra={1}
        intensity={2}
        color="#4ecdc4"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      <spotLight
        position={[0, 30, 0]}
        angle={0.3}
        penumbra={1}
        intensity={3}
        color="#ffd93d"
        castShadow
        shadow-mapSize={[4096, 4096]}
      />
      
      {/* 컬러풀한 포인트 라이트 */}
      {Array.from({ length: 8 }, (_, i) => (
        <pointLight
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 15,
            5 + Math.sin(i) * 3,
            Math.sin((i / 8) * Math.PI * 2) * 15
          ]}
          intensity={1.5}
          distance={25}
          color={`hsl(${(i / 8) * 360}, 80%, 60%)`}
        />
      ))}
    </group>
  );
};

// 🎊 메인 프리미엄 3D 슬롯머신
interface PremiumSlot3DProps {
  symbols: string[];
  isSpinning: boolean;
  winningLines: number[][];
  theme?: 'space' | 'casino' | 'cyber' | 'crystal';
}

export const PremiumSlot3D: React.FC<PremiumSlot3DProps> = ({
  symbols,
  isSpinning,
  winningLines,
  theme = 'cyber'
}) => {
  // 3x3 그리드 위치 계산
  const positions = useMemo<[number, number, number][]>(() => {
    const positions: [number, number, number][] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        positions.push([
          (col - 1) * 3.5,
          (1 - row) * 3.5,
          0
        ]);
      }
    }
    return positions;
  }, []);

  const isWinningCell = (index: number) => {
    return winningLines.some(line => line.includes(index));
  };

  const getMaterialType = (index: number): PremiumSlot3DReelProps['materialType'] => {
    if (isWinningCell(index)) return 'crystal';
    const types: PremiumSlot3DReelProps['materialType'][] = ['holographic', 'glass', 'neon'];
    return types[index % types.length];
  };

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border-4 border-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 shadow-2xl">
      <Canvas
        shadows="soft"
        camera={{ 
          position: [0, 0, 15], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* 프리미엄 환경 */}
          <PremiumEnvironment theme={theme} />
          
          {/* 고급 그림자 시스템 */}
          <AccumulativeShadows 
            temporal 
            frames={60} 
            alphaTest={0.9} 
            scale={20} 
            position={[0, -5, 0]}
            color="#9d4b4b" 
            opacity={0.8}
          >
            <RandomizedLight 
              amount={4} 
              radius={9} 
              intensity={0.8} 
              ambient={0.25} 
              position={[5, 5, -10]} 
            />
            <RandomizedLight 
              amount={4} 
              radius={5} 
              intensity={0.5} 
              ambient={0.55} 
              position={[-5, 5, -9]} 
            />
          </AccumulativeShadows>

          {/* 프리미엄 3D 슬롯 릴들 */}
          {symbols.map((symbol, index) => (
            <PremiumSlot3DReel
              key={index}
              symbol={symbol}
              position={positions[index]}
              isSpinning={isSpinning}
              isWinning={isWinningCell(index)}
              spinSpeed={5 + (index * 0.3) + Math.random() * 2}
              materialType={getMaterialType(index)}
            />
          ))}
          
          {/* 슬롯머신 프레임 */}
          <mesh position={[0, 0, -2]} receiveShadow>
            <boxGeometry args={[12, 12, 1]} />
            <meshStandardMaterial
              color="#222222"
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* 카메라 컨트롤 */}
          <PresentationControls
            enabled={true}
            global={false}
            cursor={true}
            snap={false}
            speed={2}
            zoom={0.8}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          />
        </Suspense>
      </Canvas>
      
      {/* 프리미엄 오버레이 UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 홀로그래픽 보더 */}
        <div className="absolute inset-0 rounded-3xl border-4 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-50 blur-sm"></div>
        
        {/* 코너 라이트 효과 */}
        {[0, 1, 2, 3].map(corner => (
          <div 
            key={corner}
            className={`absolute w-20 h-20 ${
              corner === 0 ? 'top-4 left-4' :
              corner === 1 ? 'top-4 right-4' :
              corner === 2 ? 'bottom-4 left-4' : 'bottom-4 right-4'
            } bg-gradient-radial from-white/40 to-transparent rounded-full blur-xl animate-pulse`}
          />
        ))}
        
        {/* 승리 시 전체 화면 효과 */}
        {winningLines.length > 0 && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-3xl"
            animate={{
              opacity: [0, 0.8, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PremiumSlot3D;