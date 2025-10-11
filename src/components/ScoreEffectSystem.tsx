import React, { useState, useEffect } from 'react';

interface FloatingNumberProps {
  value: number;
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}

const FloatingNumber: React.FC<FloatingNumberProps> = ({ value, x, y, color, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed pointer-events-none z-50 font-bold text-2xl animate-float-up ${color}`}
      style={{ left: x, top: y }}
    >
      +{value.toLocaleString()}
    </div>
  );
};

interface ScoreEffectSystemProps {
  children: React.ReactNode;
}

const ScoreEffectSystem: React.FC<ScoreEffectSystemProps> = ({ children }) => {
  const [effects, setEffects] = useState<Array<{
    id: number;
    value: number;
    x: number;
    y: number;
    color: string;
  }>>([]);

  const addEffect = (value: number, x?: number, y?: number) => {
    const newEffect = {
      id: Date.now(),
      value,
      x: x || Math.random() * window.innerWidth,
      y: y || window.innerHeight / 2,
      color: value > 1000 ? 'text-yellow-400 neon-text' : value > 500 ? 'text-blue-400' : 'text-green-400'
    };
    
    setEffects(prev => [...prev, newEffect]);
  };

  const removeEffect = (id: number) => {
    setEffects(prev => prev.filter(effect => effect.id !== id));
  };

  // 전역 이벤트 리스너로 점수 증가 감지
  useEffect(() => {
    const handleScoreIncrease = (event: CustomEvent) => {
      addEffect(event.detail.value, event.detail.x, event.detail.y);
    };

    window.addEventListener('scoreIncrease', handleScoreIncrease as EventListener);
    return () => window.removeEventListener('scoreIncrease', handleScoreIncrease as EventListener);
  }, []);

  return (
    <>
      {children}
      {effects.map(effect => (
        <FloatingNumber
          key={effect.id}
          value={effect.value}
          x={effect.x}
          y={effect.y}
          color={effect.color}
          onComplete={() => removeEffect(effect.id)}
        />
      ))}
    </>
  );
};

export default ScoreEffectSystem;