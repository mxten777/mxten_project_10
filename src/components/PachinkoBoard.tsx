import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useGameStore } from '../stores/gameStore';
import { useAuthStore } from '../stores/authStore';
import { saveGameRun } from '../utils/firestoreGame';

const BOARD_WIDTH = 400;
const BOARD_HEIGHT = 600;
const PIN_RADIUS = 7;
const BALL_RADIUS = 10;
const POCKET_RADIUS = 20;

const pinMap = [
  // y, x offset, count
  { y: 100, offset: 40, count: 7 },
  { y: 160, offset: 20, count: 8 },
  { y: 220, offset: 40, count: 7 },
  { y: 280, offset: 20, count: 8 },
  { y: 340, offset: 40, count: 7 },
];

const pockets = [
  { x: 40, y: 580 },
  { x: 120, y: 580 },
  { x: 200, y: 580 },
  { x: 280, y: 580 },
  { x: 360, y: 580 },
];

const PachinkoBoard: React.FC = () => {
  const { score, combo, setScore, setCombo } = useGameStore();
  const { uid } = useAuthStore();
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const ballRef = useRef<Matter.Body | null>(null);

  useEffect(() => {
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;

    const engine = Engine.create();
    engineRef.current = engine;

    // 보드 경계
    const walls = [
      Bodies.rectangle(BOARD_WIDTH / 2, -10, BOARD_WIDTH, 20, { isStatic: true }),
      Bodies.rectangle(BOARD_WIDTH / 2, BOARD_HEIGHT + 10, BOARD_WIDTH, 20, { isStatic: true }),
      Bodies.rectangle(-10, BOARD_HEIGHT / 2, 20, BOARD_HEIGHT, { isStatic: true }),
      Bodies.rectangle(BOARD_WIDTH + 10, BOARD_HEIGHT / 2, 20, BOARD_HEIGHT, { isStatic: true }),
    ];

    // 핀 생성
    const pins: Matter.Body[] = [];
    pinMap.forEach(row => {
      for (let i = 0; i < row.count; i++) {
        pins.push(
          Bodies.circle(row.offset + i * 50, row.y, PIN_RADIUS, {
            isStatic: true,
            render: { fillStyle: '#888' },
          })
        );
      }
    });

    // 포켓 생성
    const pocketBodies = pockets.map(pocket =>
      Bodies.circle(pocket.x, pocket.y, POCKET_RADIUS, {
        isStatic: true,
        isSensor: true,
        render: { fillStyle: '#FFD700' },
        label: 'pocket',
      })
    );

    // 볼 생성 (초기 위치)
    const ball = Bodies.circle(BOARD_WIDTH / 2, 40, BALL_RADIUS, {
      restitution: 0.7,
      label: 'ball',
      render: { fillStyle: '#3498db' },
    });
    ballRef.current = ball;

    World.add(engine.world, [...walls, ...pins, ...pocketBodies, ball]);

    // Matter.js 렌더러
    const render = Render.create({
      element: sceneRef.current!,
      engine,
      options: {
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        wireframes: false,
        background: '#e0f2fe',
      },
    });
    renderRef.current = render;
    Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // 볼이 포켓에 닿으면 점수/콤보 증가 및 기록 저장
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach(async pair => {
        if (
          (pair.bodyA.label === 'ball' && pair.bodyB.label === 'pocket') ||
          (pair.bodyB.label === 'ball' && pair.bodyA.label === 'pocket')
        ) {
          // 점수/콤보 증가 (임시: 포켓마다 100점, 콤보 +1)
          setScore(score + 100);
          setCombo(combo + 1);
          // 기록 저장 (uid 있을 때만)
          if (uid) {
            await saveGameRun({
              uid,
              score: score + 100,
              ballsUsed: 1, // MVP: 1회 플레이마다 1로 고정
              combos: combo + 1,
              createdAt: new Date(),
            });
          }
          // 볼 리셋
          Matter.Body.setPosition(ball, { x: BOARD_WIDTH / 2, y: 40 });
          Matter.Body.setVelocity(ball, { x: 0, y: 0 });
        }
      });
    });

    return () => {
      Render.stop(render);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  // 클릭 시 볼 드롭(좌우 이동)
  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect || !ballRef.current) return;
    const x = e.clientX - rect.left;
    Matter.Body.setPosition(ballRef.current, { x, y: 40 });
    Matter.Body.setVelocity(ballRef.current, { x: 0, y: 0 });
  };

  return (
    <div
      ref={sceneRef}
      className="w-full h-full bg-green-100 rounded-lg shadow relative cursor-pointer"
      style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
      onClick={handleBoardClick}
    >
      {/* Matter.js 캔버스가 이 div에 렌더링됨 */}
    </div>
  );
};

export default PachinkoBoard;
