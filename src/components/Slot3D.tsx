import { Canvas } from '@react-three/fiber';
import { OrbitControls, MeshWobbleMaterial, Sparkles, Environment } from '@react-three/drei';
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// 🎰 3D 슬롯 릴 컴포넌트
interface Slot3DReelProps {
  symbol: string;
  position: [number, number, number];
  isSpinning: boolean;
  isWinning: boolean;
  spinSpeed: number;
}

const Slot3DReel: React.FC<Slot3DReelProps> = ({ 
  symbol, 
  position, 
  isSpinning, 
  isWinning,
  spinSpeed 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // 스핀 애니메이션
  useFrame((state, delta) => {
    if (meshRef.current && isSpinning) {
      meshRef.current.rotation.y += delta * spinSpeed;
    }
    
    // 승리 시 글로우 효과
    if (groupRef.current && isWinning) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1;
      groupRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.05);
    }
  });

  // 심볼별 색상
  const getSymbolColor = (symbol: string) => {
    const colorMap: { [key: string]: string } = {
      '🍒': '#ff4444', '🍋': '#ffff44', '🍊': '#ff8844', '🍇': '#8844ff',
      '🔔': '#ffd700', '⭐': '#ffff00', '💎': '#44ddff', '🎯': '#ff44dd',
      '7️⃣': '#ff0000', '🎰': '#silver', '👑': '#gold', '💰': '#32cd32',
      '🌟': '#ffff00', '💥': '#ff6600'
    };
    return colorMap[symbol] || '#ffffff';
  };

  return (
    <group ref={groupRef} position={position}>
      {/* 메인 릴 실린더 */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[1, 1, 0.3, 32]} />
        <meshStandardMaterial 
          color={getSymbolColor(symbol)}
          metalness={0.7}
          roughness={0.2}
          emissive={isWinning ? getSymbolColor(symbol) : '#000000'}
          emissiveIntensity={isWinning ? 0.3 : 0}
        />
      </mesh>

      {/* 3D 평면 심볼 (임시) */}
      <mesh position={[0, 0, 0.8]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial 
          color="white"
          emissive={isWinning ? '#ffffff' : '#000000'}
          emissiveIntensity={isWinning ? 0.3 : 0}
        />
      </mesh>

      {/* 승리 시 스파클 효과 */}
      {isWinning && (
        <Sparkles
          count={50}
          scale={2}
          size={3}
          speed={1}
          color={getSymbolColor(symbol)}
        />
      )}
    </group>
  );
};

// 🌟 3D 슬롯머신 메인 컴포넌트
interface Slot3DProps {
  symbols: string[];
  isSpinning: boolean;
  winningLines: number[][];
}

const Slot3DScene: React.FC<Slot3DProps> = ({ symbols, isSpinning, winningLines }) => {
  // 3x3 그리드 포지션 계산
  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        pos.push([
          (col - 1) * 2.5,  // X축 간격
          (1 - row) * 2.5,  // Y축 간격 (위에서 아래로)
          0                 // Z축
        ]);
      }
    }
    return pos;
  }, []);

  // 승리 라인 체크
  const isWinningCell = (index: number) => {
    return winningLines.some(line => line.includes(index));
  };

  return (
    <>
      {/* 환경 조명 */}
      <Environment preset="city" />
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow 
      />
      
      {/* 포인트 라이트 (네온 효과) */}
      <pointLight 
        position={[0, 0, 5]} 
        intensity={1} 
        color="#ff00ff"
        distance={20}
      />
      <pointLight 
        position={[-5, 5, 3]} 
        intensity={0.8} 
        color="#00ffff"
        distance={15}
      />

      {/* 3D 슬롯 릴들 */}
      {symbols.map((symbol, index) => (
        <Slot3DReel
          key={index}
          symbol={symbol}
          position={positions[index]}
          isSpinning={isSpinning}
          isWinning={isWinningCell(index)}
          spinSpeed={5 + index * 0.5} // 각 릴마다 다른 속도
        />
      ))}

      {/* 배경 파티클 */}
      <Sparkles
        count={100}
        scale={10}
        size={2}
        speed={0.3}
        color="#ffffff"
        opacity={0.3}
      />

      {/* 슬롯머신 프레임 */}
      <mesh position={[0, 0, -1]}>
        <boxGeometry args={[8, 8, 0.5]} />
        <meshStandardMaterial 
          color="#222222"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* 네온 테두리 */}
      <mesh position={[0, 0, -0.7]}>
        <ringGeometry args={[3.8, 4.2, 32]} />
        <MeshWobbleMaterial 
          color="#ff00ff"
          factor={0.1}
          speed={2}
          emissive="#ff00ff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </>
  );
};

// 🎰 메인 3D 슬롯머신 컴포넌트
interface Slot3DContainerProps {
  symbols: string[];
  isSpinning: boolean;
  winningLines: number[][];
}

export const Slot3DContainer: React.FC<Slot3DContainerProps> = ({
  symbols,
  isSpinning,
  winningLines
}) => {
  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border-2 border-purple-500 shadow-2xl">
      <Canvas
        camera={{ 
          position: [0, 0, 10], 
          fov: 50 
        }}
        gl={{ 
          antialias: true,
          alpha: true
        }}
        shadows
      >
        {/* 카메라 컨트롤 */}
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={8}
          maxDistance={15}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
        
        {/* 3D 씬 */}
        <Slot3DScene 
          symbols={symbols}
          isSpinning={isSpinning}
          winningLines={winningLines}
        />
      </Canvas>
    </div>
  );
};

// 🌟 홀로그램 효과 컴포넌트
export const HologramEffect: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      if (material.opacity !== undefined) {
        material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      }
    }
  });

  if (!isActive) return null;

  return (
    <mesh ref={meshRef} position={[0, 0, 2]}>
      <torusGeometry args={[2, 0.3, 16, 100]} />
      <meshBasicMaterial 
        color="#00ffff"
        transparent
        opacity={0.5}
        wireframe
      />
    </mesh>
  );
};

// 🎯 잭팟 레이저쇼 컴포넌트
export const LaserShow: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 2;
    }
  });

  if (!isActive) return null;

  return (
    <group ref={groupRef}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 5,
            Math.sin((i / 8) * Math.PI * 2) * 5,
            0
          ]}
          rotation={[0, 0, (i / 8) * Math.PI * 2]}
        >
          <cylinderGeometry args={[0.05, 0.05, 10, 8]} />
          <meshBasicMaterial 
            color={`hsl(${i * 45}, 100%, 50%)`}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};