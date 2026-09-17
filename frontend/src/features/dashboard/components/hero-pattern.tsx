"use client";

import { WavyBackground } from "@/components/ui/wavy-background";

export function HeroPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {/* Ambient background glow orbs */}
      <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 blur-[120px] animate-pulse" />
      <div className="absolute top-10 right-10 h-80 w-80 rounded-full bg-indigo-500/15 dark:bg-indigo-500/20 blur-[130px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-60 left-1/3 h-72 w-72 rounded-full bg-purple-500/10 dark:bg-purple-500/15 blur-[140px] animate-pulse [animation-delay:4s]" />

      {/* Subtle radial & linear grid / mesh backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)]" />

      {/* High-performance generative animated waves & shimmer particles */}
      <WavyBackground
        colors={[
          "#06b6d4", // Cyan
          "#0ea5e9", // Sky
          "#6366f1", // Indigo
          "#8b5cf6", // Violet
          "#d946ef", // Fuchsia
          "#14b8a6", // Teal
        ]}
        blur={4}
        speed="slow"
        waveOpacity={0.4}
        waveWidth={2.2}
        waveCount={6}
        waveYOffset={220}
        showParticles={true}
        interactive={true}
        containerClassName="h-[520px] opacity-85 dark:opacity-95"
      />

      {/* Fade masks for clean seamless dissipation into UI content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />
    </div>
  );
}
