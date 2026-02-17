import { useState, useEffect, useCallback } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  color: string;
  type: "confetti" | "firework" | "block";
  size: number;
  rotation: number;
  speed: number;
};

const CONFETTI_COLORS = [
  "hsl(100, 38%, 35%)",
  "hsl(185, 70%, 55%)",
  "hsl(45, 80%, 55%)",
  "hsl(0, 70%, 50%)",
  "hsl(270, 60%, 55%)",
  "hsl(30, 50%, 30%)",
];

const PartyEffects = () => {
  const [active, setActive] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const triggerParty = useCallback(() => {
    if (active) return;
    setActive(true);

    const newParticles: Particle[] = [];
    let id = 0;

    // Confetti
    for (let i = 0; i < 60; i++) {
      newParticles.push({
        id: id++,
        x: Math.random() * 100,
        y: -10 - Math.random() * 30,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        type: "confetti",
        size: 6 + Math.random() * 10,
        rotation: Math.random() * 360,
        speed: 1 + Math.random() * 3,
      });
    }

    // Fireworks
    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: id++,
        x: 10 + Math.random() * 80,
        y: 20 + Math.random() * 40,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        type: "firework",
        size: 20 + Math.random() * 40,
        rotation: 0,
        speed: 0,
      });
    }

    // Flying blocks
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: id++,
        x: Math.random() * 100,
        y: 100 + Math.random() * 20,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        type: "block",
        size: 16 + Math.random() * 24,
        rotation: Math.random() * 45,
        speed: 2 + Math.random() * 4,
      });
    }

    setParticles(newParticles);

    setTimeout(() => {
      setActive(false);
      setParticles([]);
    }, 3000);
  }, [active]);

  return { active, particles, triggerParty };
};

export const PartyOverlay = ({ active, particles }: { active: boolean; particles: Particle[] }) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {particles.map((p) => {
        if (p.type === "confetti") {
          return (
            <div
              key={p.id}
              className="absolute animate-confetti"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size * 0.6,
                backgroundColor: p.color,
                transform: `rotate(${p.rotation}deg)`,
                animationDuration: `${1.5 + p.speed * 0.3}s`,
                animationDelay: `${Math.random() * 0.8}s`,
              }}
            />
          );
        }

        if (p.type === "firework") {
          return (
            <div
              key={p.id}
              className="absolute animate-firework rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                border: `3px solid ${p.color}`,
                boxShadow: `0 0 20px ${p.color}, inset 0 0 20px ${p.color}`,
                animationDelay: `${Math.random() * 1.5}s`,
              }}
            />
          );
        }

        // Block particles
        return (
          <div
            key={p.id}
            className="absolute mc-block-texture"
            style={{
              left: `${p.x}%`,
              bottom: "-20px",
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              border: "2px solid rgba(0,0,0,0.3)",
              animation: `float-block ${2 + Math.random() * 2}s linear forwards`,
              animationDelay: `${Math.random() * 1}s`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        );
      })}

      {/* Screen flash */}
      <div className="absolute inset-0 bg-mc-gold/20 animate-pulse" style={{ animationDuration: "0.3s" }} />
    </div>
  );
};

export default PartyEffects;
