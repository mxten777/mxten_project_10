import React, { useEffect, useRef } from 'react';
import { useAchievementStore } from '../stores/achievementStore';

const confettiColors = ['#FFD700', '#FF69B4', '#90EE90', '#00BFFF', '#FF6347'];
const playAchievementSound = () => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.value = 880;
  g.gain.value = 0.15;
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  o.frequency.linearRampToValueAtTime(1760, ctx.currentTime + 0.3);
  g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
  o.stop(ctx.currentTime + 0.5);
};

const AchievementBoard: React.FC = () => {
  const { achievements } = useAchievementStore();
  const prevAchievedRef = useRef<number>(0);
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const achievedCount = achievements.filter(a => a.achieved).length;
    if (achievedCount > prevAchievedRef.current) {
      // 축하 애니메이션
      if (confettiRef.current) {
        confettiRef.current.classList.add('animate-confetti');
        setTimeout(() => confettiRef.current?.classList.remove('animate-confetti'), 1200);
      }
      // 사운드 피드백
      playAchievementSound();
    }
    prevAchievedRef.current = achievedCount;
  }, [achievements]);

  return (
    <div className="w-full p-4 rounded-xl bg-gradient-to-r from-yellow-100/40 to-pink-100/40 border border-yellow-300/30 shadow-lg flex flex-col gap-3 mb-4 relative">
      <div className="font-bold text-lg text-yellow-700 mb-2">업적 현황</div>
      {/* Confetti 애니메이션 오버레이 */}
      <div ref={confettiRef} className="pointer-events-none absolute inset-0 z-10">
        {/* 간단한 confetti 효과 (tailwind animate-spin 등 활용) */}
        <div className="absolute left-1/2 top-2 flex gap-2 -translate-x-1/2">
          {confettiColors.map((c, i) => (
            <div key={i} style={{ background: c }} className="w-3 h-3 rounded-full animate-bounce" />
          ))}
        </div>
      </div>
      {achievements.map(a => (
        <div key={a.id} className={`flex items-center gap-3 p-2 rounded-lg ${a.achieved ? 'bg-green-100/60' : 'bg-gray-100/40'}`}>
          <span className={`font-bold ${a.achieved ? 'text-green-700' : 'text-gray-700'}`}>{a.name}</span>
          <span className="text-sm text-gray-500">{a.description}</span>
          <span className="ml-auto text-xs px-2 py-1 rounded bg-yellow-200/60 text-yellow-800">{a.reward}</span>
          {a.achieved && <span className="ml-2 text-green-500 font-bold">달성!</span>}
        </div>
      ))}
    </div>
  );
};

export default AchievementBoard;
