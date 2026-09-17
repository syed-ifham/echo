"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

export interface WavyBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast" | "medium";
  waveOpacity?: number;
  waveYOffset?: number;
  showParticles?: boolean;
  interactive?: boolean;
  waveCount?: number;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  color: string;
  phase: number;
}

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors = [
    "#06b6d4", // Cyan
    "#3b82f6", // Blue
    "#8b5cf6", // Violet
    "#a855f7", // Purple
    "#ec4899", // Pink
    "#10b981", // Emerald
  ],
  waveWidth = 2.5,
  backgroundFill = "transparent",
  blur = 0,
  speed = "slow",
  waveOpacity = 0.65,
  waveYOffset,
  showParticles = true,
  interactive = true,
  waveCount = 5,
  ...props
}: WavyBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const noise = createNoise3D();
    let animationId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;
    let isVisible = true;

    // Particle pool for ambient floating shimmer
    const particles: Particle[] = [];
    const particleCount = showParticles ? 28 : 0;

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.6,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.25 - 0.1,
          alpha: Math.random() * 0.5 + 0.2,
          baseAlpha: Math.random() * 0.5 + 0.2,
          color: colors[i % colors.length],
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles();
    };

    resize();

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    const getSpeedDelta = () => {
      switch (speed) {
        case "slow":
          return 0.0035;
        case "fast":
          return 0.009;
        case "medium":
        default:
          return 0.006;
      }
    };

    const render = () => {
      if (!isVisible) {
        animationId = requestAnimationFrame(render);
        return;
      }

      time += getSpeedDelta();

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Clear frame cleanly
      ctx.clearRect(0, 0, width, height);

      if (backgroundFill && backgroundFill !== "transparent") {
        ctx.fillStyle = backgroundFill;
        ctx.fillRect(0, 0, width, height);
      }

      const defaultYOffset = height * 0.45;
      const effectiveYOffset = waveYOffset ?? defaultYOffset;

      // Draw subtle ambient particles
      if (showParticles && particles.length > 0) {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.phase += 0.02;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          const currentAlpha = p.baseAlpha + Math.sin(p.phase) * 0.25;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha * waveOpacity));
          ctx.fill();
        }
      }

      // Draw flowing multi-frequency wave ribbons with gradients
      const step = 14;
      const pointsCount = Math.ceil(width / step) + 2;

      for (let i = 0; i < waveCount; i++) {
        const color = colors[i % colors.length];
        const nextColor = colors[(i + 1) % colors.length];

        const layerIndex = i + 1;
        const freq = 0.0018 + i * 0.0004;
        const amplitude = 32 + (i % 3) * 14;
        const layerPhase = (i * Math.PI) / waveCount;
        const layerY = effectiveYOffset + (i - waveCount / 2) * 22;

        const points: { x: number; y: number }[] = [];

        for (let j = 0; j <= pointsCount; j++) {
          const x = j * step;
          const noiseVal = noise(x * freq, layerIndex * 0.45, time * 0.8 + layerPhase);
          const sineVal = Math.sin(x * 0.004 + time * 1.2 + layerPhase) * 12;
          const secondarySine = Math.cos(x * 0.007 - time * 0.6 + i) * 8;

          let y = layerY + noiseVal * amplitude + sineVal + secondarySine;

          // Mouse proximity wave ripple effect
          if (interactive && mouseRef.current.x > 0) {
            const dx = x - mouseRef.current.x;
            const dy = y - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 220;
            if (dist < maxDist) {
              const force = (1 - dist / maxDist) * 35 * Math.sin(dist * 0.05 - time * 4);
              y += force;
            }
          }

          points.push({ x, y });
        }

        if (points.length < 2) continue;

        // Create volumetric gradient fill beneath the wave
        const fillGradient = ctx.createLinearGradient(0, layerY - 60, 0, height);
        fillGradient.addColorStop(0, color);
        fillGradient.addColorStop(0.5, nextColor);
        fillGradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let j = 0; j < points.length - 1; j++) {
          const p0 = points[j];
          const p1 = points[j + 1];
          const midX = (p0.x + p1.x) / 2;
          const midY = (p0.y + p1.y) / 2;
          ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
        }

        const last = points[points.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        ctx.fillStyle = fillGradient;
        ctx.globalAlpha = waveOpacity * 0.07;
        ctx.fill();

        // Stroke gradient ribbon
        const strokeGradient = ctx.createLinearGradient(0, 0, width, 0);
        strokeGradient.addColorStop(0, "transparent");
        strokeGradient.addColorStop(0.15, color);
        strokeGradient.addColorStop(0.5, nextColor);
        strokeGradient.addColorStop(0.85, color);
        strokeGradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let j = 0; j < points.length - 1; j++) {
          const p0 = points[j];
          const p1 = points[j + 1];
          const midX = (p0.x + p1.x) / 2;
          const midY = (p0.y + p1.y) / 2;
          ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
        }

        ctx.lineTo(last.x, last.y);

        ctx.strokeStyle = strokeGradient;
        ctx.lineWidth = waveWidth + (i % 2 === 0 ? 0.8 : 0);
        ctx.globalAlpha = waveOpacity * (0.55 + (i / waveCount) * 0.45);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Subtle glow effect
        if (blur > 0) {
          ctx.shadowBlur = blur * 4;
          ctx.shadowColor = color;
        } else {
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [backgroundFill, blur, colors, interactive, showParticles, speed, waveCount, waveOpacity, waveWidth, waveYOffset]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden",
        containerClassName
      )}
    >
      <canvas
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        ref={canvasRef}
      />
      {children && (
        <div className={cn("relative z-10 w-full", className)} {...props}>
          {children}
        </div>
      )}
    </div>
  );
};
