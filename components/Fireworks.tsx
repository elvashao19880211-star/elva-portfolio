'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

// 品牌色系：天青 / 淡金 / 墨蓝 + 暖色点缀
const PALETTE = ['#7BC4D0', '#C3A370', '#3A506B', '#E8A87C', '#D98CA3', '#F6C453', '#F5E6C8'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  color: string;
  size: number;
}

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [burst, setBurst] = useState(0);

  const launch = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    const cx = w * (0.15 + Math.random() * 0.7);
    const cy = h * (0.12 + Math.random() * 0.45);
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const count = 60 + Math.floor(Math.random() * 50);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.25;
      const speed = 2.2 + Math.random() * 4.5;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.006 + Math.random() * 0.013,
        color,
        size: 1.2 + Math.random() * 2.4,
      });
    }
  }, []);

  // 主循环
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    const animate = () => {
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      const ps = particlesRef.current;
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.life -= p.decay;
        if (p.life <= 0) {
          ps.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // 首次进入自动迎宾一波
  useEffect(() => {
    const timers = [300, 700, 1100, 1500, 1900].map((d) => setTimeout(launch, d));
    return () => timers.forEach(clearTimeout);
  }, [launch]);

  // 手动触发（点击按钮）
  useEffect(() => {
    if (burst > 0) {
      const timers = [0, 180, 360].map((d) => setTimeout(launch, d));
      return () => timers.forEach(clearTimeout);
    }
  }, [burst, launch]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />
      <button
        onClick={() => setBurst((b) => b + 1)}
        aria-label="放烟花"
        className="absolute bottom-5 right-5 z-30 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white/90 text-xs font-medium hover:bg-white/30 hover:text-white transition-all duration-300 shadow-lg"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c.3 3.5 1.2 6.2 2.6 8.2 1.5 2.2 3.8 3.5 6.4 3.8-2.6.3-4.9 1.6-6.4 3.8-1.4 2-2.3 4.7-2.6 8.2-.3-3.5-1.2-6.2-2.6-8.2C8 15.6 5.7 14.3 3 14c2.6-.3 4.9-1.6 6.4-3.8C10.8 8.2 11.7 5.5 12 2z" />
        </svg>
        放烟花
      </button>
    </>
  );
}
