// 💥 극한 프리미엄 파티클 & 이펙트 시스템
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// 🌟 홀로그램 쉐이더 머티리얼
const HologramMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.2, 0.0, 1.0),
    amplitude: 0.5,
    frequency: 2.0
  },
  // Vertex Shader
  `
    uniform float time;
    uniform float amplitude;
    uniform float frequency;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec3 pos = position;
      
      // 홀로그램 왜곡 효과
      pos.x += sin(pos.y * frequency + time * 2.0) * amplitude * 0.1;
      pos.y += cos(pos.x * frequency + time * 1.5) * amplitude * 0.1;
      pos.z += sin(pos.x * pos.y * 0.1 + time) * amplitude * 0.05;
      
      vPosition = pos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform vec3 color;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vec3 normal = normalize(vNormal);
      float fresnel = pow(1.0 - dot(normal, vec3(0.0, 0.0, 1.0)), 2.0);
      
      // 홀로그램 스캔라인 효과
      float scanline = sin(vPosition.y * 100.0 + time * 10.0) * 0.04 + 0.96;
      
      // 컬러 그라데이션
      vec3 finalColor = color + vec3(0.3, 0.5, 0.8) * fresnel;
      finalColor *= scanline;
      
      // 투명도 애니메이션
      float alpha = fresnel * 0.8 + sin(time * 3.0) * 0.1;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

// extend({ HologramMaterial }); // Removed as extend is no longer imported

// 🌊 플루이드 파티클 시뮬레이션
class FluidParticleSystem {
  private particles: FluidParticle[] = [];
  private velocityField: THREE.Vector3[][] = [];
  private fieldSize = 50;

  constructor(particleCount: number = 1000) {
    this.initializeParticles(particleCount);
    this.initializeVelocityField();
  }

  private initializeParticles(count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ),
        velocity: new THREE.Vector3(0, 0, 0),
        life: Math.random(),
        maxLife: 3 + Math.random() * 5,
        size: Math.random() * 2 + 1,
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
        mass: Math.random() * 0.5 + 0.5
      });
    }
  }

  private initializeVelocityField() {
    this.velocityField = [];
    for (let x = 0; x < this.fieldSize; x++) {
      this.velocityField[x] = [];
      for (let y = 0; y < this.fieldSize; y++) {
        this.velocityField[x][y] = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        );
      }
    }
  }

  update(deltaTime: number, attractors: THREE.Vector3[] = []) {
    this.particles.forEach((particle) => {
      // 생명주기 업데이트
      particle.life += deltaTime;
      if (particle.life > particle.maxLife) {
        this.respawnParticle(particle);
      }

      // 속도 필드 영향
      const fieldX = Math.floor(((particle.position.x + 10) / 20) * (this.fieldSize - 1));
      const fieldY = Math.floor(((particle.position.y + 10) / 20) * (this.fieldSize - 1));
      
      if (fieldX >= 0 && fieldX < this.fieldSize && fieldY >= 0 && fieldY < this.fieldSize) {
        const fieldForce = this.velocityField[fieldX][fieldY].clone().multiplyScalar(0.1);
        particle.velocity.add(fieldForce);
      }

      // 어트랙터 영향
      attractors.forEach(attractor => {
        const distance = particle.position.distanceTo(attractor);
        if (distance > 0.1) {
          const force = attractor.clone()
            .sub(particle.position)
            .normalize()
            .multiplyScalar(100 / (distance * distance))
            .multiplyScalar(deltaTime);
          particle.velocity.add(force);
        }
      });

      // 물리 업데이트
      particle.velocity.multiplyScalar(0.98); // 댐핑
      particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));

      // 경계 체크
      if (particle.position.length() > 25) {
        this.respawnParticle(particle);
      }
    });
  }

  private respawnParticle(particle: FluidParticle) {
    particle.position.set(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5
    );
    particle.velocity.set(0, 0, 0);
    particle.life = 0;
    particle.color.setHSL(Math.random(), 0.8, 0.6);
  }

  getPositions(): Float32Array {
    const positions = new Float32Array(this.particles.length * 3);
    this.particles.forEach((particle, i) => {
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
    });
    return positions;
  }

  getColors(): Float32Array {
    const colors = new Float32Array(this.particles.length * 3);
    this.particles.forEach((particle, i) => {
      const alpha = 1 - (particle.life / particle.maxLife);
      colors[i * 3] = particle.color.r * alpha;
      colors[i * 3 + 1] = particle.color.g * alpha;
      colors[i * 3 + 2] = particle.color.b * alpha;
    });
    return colors;
  }

  getSizes(): Float32Array {
    const sizes = new Float32Array(this.particles.length);
    this.particles.forEach((particle, i) => {
      const alpha = 1 - (particle.life / particle.maxLife);
      sizes[i] = particle.size * alpha * (0.5 + Math.sin(particle.life * 5) * 0.3);
    });
    return sizes;
  }
}

interface FluidParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
  mass: number;
}

// 🎆 레이저쇼 시스템
class LaserShowSystem {
  private lasers: Laser[] = [];
  private nodes: THREE.Vector3[] = [];

  constructor() {
    this.generateNodes();
  }

  private generateNodes() {
    for (let i = 0; i < 20; i++) {
      this.nodes.push(new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      ));
    }
  }

  update(time: number) {
    this.lasers = [];
    
    // 동적 레이저 연결 생성
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      
      // 노드 위치 애니메이션
      node.x += Math.sin(time * 0.5 + i) * 0.1;
      node.y += Math.cos(time * 0.3 + i) * 0.1;
      node.z += Math.sin(time * 0.7 + i) * 0.05;

      // 가까운 노드들과 레이저 연결
      for (let j = i + 1; j < this.nodes.length; j++) {
        const otherNode = this.nodes[j];
        const distance = node.distanceTo(otherNode);
        
        if (distance < 15) {
          const intensity = 1 - (distance / 15);
          this.lasers.push({
            start: node.clone(),
            end: otherNode.clone(),
            color: new THREE.Color().setHSL(
              (time * 0.1 + i * 0.1) % 1,
              0.8,
              0.5 + intensity * 0.3
            ),
            intensity: intensity * (0.5 + Math.sin(time * 2 + i) * 0.3)
          });
        }
      }
    }
  }

  getLasers(): Laser[] {
    return this.lasers;
  }
}

interface Laser {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: THREE.Color;
  intensity: number;
}

// 🔥 프리미엄 파티클 컴포넌트들
interface PremiumParticlesProps {
  type: 'hologram' | 'explosion' | 'laser_show' | 'fluid' | 'quantum';
  intensity: number;
  color?: THREE.Color;
  position?: THREE.Vector3;
  autoPlay?: boolean;
}

export const PremiumParticles: React.FC<PremiumParticlesProps> = ({
  type,
  intensity,
  color = new THREE.Color(0.2, 0.8, 1.0),
  position = new THREE.Vector3(0, 0, 0),

}) => {
  
  switch (type) {
    case 'hologram':
      return <HologramParticles intensity={intensity} color={color} position={position} />;
    case 'explosion':
      return <ExplosionParticles intensity={intensity} color={color} position={position} />;
    case 'laser_show':
      return <LaserShow intensity={intensity} color={color} />;
    case 'fluid':
      return <FluidParticles intensity={intensity} color={color} />;
    case 'quantum':
      return <QuantumParticles intensity={intensity} color={color} position={position} />;
    default:
      return null;
  }
};

// 🌟 홀로그램 파티클
const HologramParticles: React.FC<{
  intensity: number;
  color: THREE.Color;
  position: THREE.Vector3;
}> = ({ intensity, color, position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 2);
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.elapsedTime;
      materialRef.current.uniforms.amplitude.value = intensity * 0.5;
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = clock.elapsedTime * 0.3;
      meshRef.current.position.copy(position);
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          time: { value: 0 },
          color: { value: color },
          amplitude: { value: 0.5 },
          frequency: { value: 2.0 }
        }}
        vertexShader={`
          uniform float time;
          uniform float amplitude;
          uniform float frequency;
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec3 pos = position;
            
            pos.x += sin(pos.y * frequency + time * 2.0) * amplitude * 0.1;
            pos.y += cos(pos.x * frequency + time * 1.5) * amplitude * 0.1;
            pos.z += sin(pos.x * pos.y * 0.1 + time) * amplitude * 0.05;
            
            vPosition = pos;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          uniform vec3 color;
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vec3 normal = normalize(vNormal);
            float fresnel = pow(1.0 - dot(normal, vec3(0.0, 0.0, 1.0)), 2.0);
            
            float scanline = sin(vPosition.y * 100.0 + time * 10.0) * 0.04 + 0.96;
            
            vec3 finalColor = color + vec3(0.3, 0.5, 0.8) * fresnel;
            finalColor *= scanline;
            
            float alpha = fresnel * 0.8 + sin(time * 3.0) * 0.1;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// 💥 폭발 파티클
const ExplosionParticles: React.FC<{
  intensity: number;
  color: THREE.Color;
  position: THREE.Vector3;
}> = ({ intensity, color, position }) => {
  const particleCount = Math.floor(intensity * 1000);
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // 구형 분포로 파티클 생성
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = Math.random() * 5;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // 속도는 위치에 비례
      velocities[i * 3] = positions[i * 3] * 2;
      velocities[i * 3 + 1] = positions[i * 3 + 1] * 2;
      velocities[i * 3 + 2] = positions[i * 3 + 2] * 2;
    }
    
    return { positions, velocities };
  }, [particleCount]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const geometry = pointsRef.current.geometry;
      const positionAttribute = geometry.getAttribute('position');
      
      for (let i = 0; i < particleCount; i++) {
        const time = clock.elapsedTime;
        const damping = Math.exp(-time * 0.5);
        
        positionAttribute.setX(i, position.x + positions.positions[i * 3] * time * damping);
        positionAttribute.setY(i, position.y + positions.positions[i * 3 + 1] * time * damping);
        positionAttribute.setZ(i, position.z + positions.positions[i * 3 + 2] * time * damping);
      }
      
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          args={[positions.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.1 * intensity}
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 🌊 플루이드 파티클
const FluidParticles: React.FC<{
  intensity: number;
  color: THREE.Color;
}> = ({ intensity }) => {
  const fluidSystem = useMemo(() => new FluidParticleSystem(Math.floor(intensity * 500)), [intensity]);
  const pointsRef = useRef<THREE.Points>(null);
  const attractors = useRef<THREE.Vector3[]>([]);

  useFrame(({ mouse }) => {
    // 마우스를 어트랙터로 사용
    attractors.current = [
      new THREE.Vector3(mouse.x * 10, mouse.y * 10, 0)
    ];
    
    fluidSystem.update(0.016, attractors.current);

    if (pointsRef.current) {
      const geometry = pointsRef.current.geometry;
      
      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(fluidSystem.getPositions(), 3)
      );
      geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(fluidSystem.getColors(), 3)
      );
      geometry.setAttribute(
        'size',
        new THREE.BufferAttribute(fluidSystem.getSizes(), 1)
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <shaderMaterial
        transparent
        blending={THREE.AdditiveBlending}
        vertexColors
        uniforms={{
          pointTexture: { value: new THREE.TextureLoader().load('/textures/spark.png') }
        }}
        vertexShader={`
          attribute float size;
          varying vec3 vColor;
          
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          
          void main() {
            gl_FragColor = vec4(vColor, 1.0);
            gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
          }
        `}
      />
    </points>
  );
};

// 🎆 레이저쇼 컴포넌트
const LaserShow: React.FC<{
  intensity: number;
  color: THREE.Color;
}> = ({ intensity }) => {
  const laserSystem = useMemo(() => new LaserShowSystem(), []);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    laserSystem.update(clock.elapsedTime);
  });

  const lasers = laserSystem.getLasers();

  return (
    <group ref={groupRef}>
      {lasers.map((laser, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([
                laser.start.x, laser.start.y, laser.start.z,
                laser.end.x, laser.end.y, laser.end.z
              ]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={laser.color}
            transparent
            opacity={laser.intensity * intensity}
          />
        </line>
      ))}
    </group>
  );
};

// ⚛️ 양자 파티클
const QuantumParticles: React.FC<{
  intensity: number;
  color: THREE.Color;
  position: THREE.Vector3;
}> = ({ intensity, color, position }) => {
  const particleCount = Math.floor(intensity * 100);
  const pointsRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      phases[i] = Math.random() * Math.PI * 2;
    }
    
    return { positions, phases };
  }, [particleCount]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const geometry = pointsRef.current.geometry;
      const positionAttribute = geometry.getAttribute('position');
      
      for (let i = 0; i < particleCount; i++) {
        const time = clock.elapsedTime;
        const phase = particles.phases[i];
        
        // 양자 간섭 패턴
        const x = particles.positions[i * 3] + Math.sin(time * 2 + phase) * 2;
        const y = particles.positions[i * 3 + 1] + Math.cos(time * 1.5 + phase) * 2;
        const z = particles.positions[i * 3 + 2] + Math.sin(time * 3 + phase) * 1;
        
        positionAttribute.setX(i, position.x + x);
        positionAttribute.setY(i, position.y + y);
        positionAttribute.setZ(i, position.z + z);
      }
      
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.2 * intensity}
        sizeAttenuation
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 🎬 승리 시퀀스 컴포넌트
interface VictorySequenceProps {
  isPlaying: boolean;
  winAmount: number;
  onComplete?: () => void;
}

export const VictorySequence: React.FC<VictorySequenceProps> = ({
  isPlaying,
  winAmount,
  onComplete
}) => {
  const [currentEffect, setCurrentEffect] = useState(0);
  
  const effects = useMemo(() => [
    { type: 'explosion' as const, duration: 2000, intensity: 0.8 },
    { type: 'laser_show' as const, duration: 3000, intensity: 1.0 },
    { type: 'hologram' as const, duration: 2000, intensity: 0.6 },
    { type: 'quantum' as const, duration: 1500, intensity: 0.9 }
  ], []);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentEffect < effects.length - 1) {
        setCurrentEffect(currentEffect + 1);
      } else {
        setCurrentEffect(0);
        onComplete?.();
      }
    }, effects[currentEffect].duration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentEffect, effects, onComplete]);

  if (!isPlaying) return null;

  const currentEffectConfig = effects[currentEffect];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <PremiumParticles
          type={currentEffectConfig.type}
          intensity={currentEffectConfig.intensity * (winAmount / 10000)}
          color={new THREE.Color(
            Math.random(),
            0.5 + Math.random() * 0.5,
            0.5 + Math.random() * 0.5
          )}
        />
      </Canvas>
      
      {/* 승리 텍스트 오버레이 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
      >
        <motion.div
          className="text-6xl font-black text-white text-center"
          animate={{
            textShadow: [
              '0 0 20px rgba(255,215,0,0.8)',
              '0 0 40px rgba(255,215,0,0.6)',
              '0 0 60px rgba(255,215,0,0.4)',
              '0 0 20px rgba(255,215,0,0.8)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div>🎉 BIG WIN! 🎉</div>
          <div className="text-4xl mt-4 text-yellow-400">
            +{winAmount.toLocaleString()}원
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default {
  PremiumParticles,
  VictorySequence,
  FluidParticleSystem,
  LaserShowSystem,
  HologramMaterial
};