import { useEffect, useRef, useState, useCallback } from "react";

type Block = {
  id: number;
  x: number;
  y: number;
  size: number;
  type: "grass" | "dirt" | "stone" | "diamond" | "gold" | "wood" | "cobblestone";
  speed: number;
  delay: number;
  breaking: boolean;
};

const BLOCK_COLORS: Record<Block["type"], { main: string; dark: string; light: string }> = {
  grass: { main: "hsl(100, 38%, 35%)", dark: "hsl(30, 50%, 30%)", light: "hsl(100, 45%, 50%)" },
  dirt: { main: "hsl(30, 50%, 30%)", dark: "hsl(25, 45%, 20%)", light: "hsl(30, 40%, 40%)" },
  stone: { main: "hsl(220, 5%, 45%)", dark: "hsl(220, 5%, 35%)", light: "hsl(220, 5%, 55%)" },
  diamond: { main: "hsl(185, 70%, 55%)", dark: "hsl(185, 60%, 40%)", light: "hsl(185, 80%, 70%)" },
  gold: { main: "hsl(45, 80%, 55%)", dark: "hsl(45, 70%, 40%)", light: "hsl(45, 90%, 70%)" },
  wood: { main: "hsl(25, 60%, 35%)", dark: "hsl(25, 50%, 25%)", light: "hsl(25, 50%, 45%)" },
  cobblestone: { main: "hsl(220, 3%, 50%)", dark: "hsl(220, 3%, 38%)", light: "hsl(220, 5%, 62%)" },
};

const randomType = (): Block["type"] => {
  const r = Math.random();
  if (r < 0.02) return "diamond";
  if (r < 0.05) return "gold";
  if (r < 0.2) return "stone";
  if (r < 0.4) return "wood";
  if (r < 0.55) return "cobblestone";
  if (r < 0.75) return "dirt";
  return "grass";
};

const drawPixelBlock = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  type: Block["type"],
  isDiamond: boolean
) => {
  const colors = BLOCK_COLORS[type];
  const px = size / 8;

  // Main fill
  ctx.fillStyle = colors.main;
  ctx.fillRect(x, y, size, size);

  // Pixel texture
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const noise = Math.random();
      if (noise < 0.15) {
        ctx.fillStyle = colors.dark;
        ctx.fillRect(x + i * px, y + j * px, px, px);
      } else if (noise < 0.25) {
        ctx.fillStyle = colors.light;
        ctx.fillRect(x + i * px, y + j * px, px, px);
      }
    }
  }

  // Grass top
  if (type === "grass") {
    ctx.fillStyle = colors.light;
    for (let i = 0; i < 8; i++) {
      const h = Math.random() < 0.5 ? 2 : 1;
      ctx.fillRect(x + i * px, y, px, h * px);
    }
  }

  // Diamond sparkle
  if (isDiamond || type === "diamond") {
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillRect(x + 2 * px, y + 2 * px, px, px);
    ctx.fillRect(x + 5 * px, y + 5 * px, px, px);
    ctx.fillRect(x + 3 * px, y + 5 * px, px, px);
  }

  // Border
  ctx.strokeStyle = colors.dark;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, size, size);
};

const drawPixelSun = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, time: number) => {
  const px = size / 12;
  const bobY = Math.sin(time * 0.001) * 15;
  const actualCy = cy + bobY;

  // Sun glow
  const gradient = ctx.createRadialGradient(cx, actualCy, size * 0.3, cx, actualCy, size * 1.5);
  gradient.addColorStop(0, "hsla(45, 100%, 60%, 0.3)");
  gradient.addColorStop(1, "hsla(45, 100%, 60%, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(cx - size * 1.5, actualCy - size * 1.5, size * 3, size * 3);

  // Pixel sun body
  const sunColor = "hsl(45, 100%, 60%)";
  const sunDark = "hsl(45, 90%, 50%)";
  const sunLight = "hsl(45, 100%, 75%)";

  // Draw a pixelated circle
  const pattern = [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
  ];

  const startX = cx - 5 * px;
  const startY = actualCy - 5 * px;

  pattern.forEach((row, j) => {
    row.forEach((cell, i) => {
      if (cell) {
        const noise = Math.random();
        ctx.fillStyle = noise < 0.2 ? sunDark : noise < 0.4 ? sunLight : sunColor;
        ctx.fillRect(startX + i * px, startY + j * px, px, px);
      }
    });
  });

  // Sun rays
  ctx.fillStyle = "hsl(45, 100%, 65%)";
  const rayLength = px * 3;
  // Top
  ctx.fillRect(cx - px / 2, actualCy - 6 * px - rayLength, px, rayLength);
  // Bottom
  ctx.fillRect(cx - px / 2, actualCy + 5 * px, px, rayLength);
  // Left
  ctx.fillRect(cx - 6 * px - rayLength, actualCy - px / 2, rayLength, px);
  // Right
  ctx.fillRect(cx + 5 * px, actualCy - px / 2, rayLength, px);
};

const MinecraftBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blocksRef = useRef<Block[]>([]);
  const animFrameRef = useRef<number>(0);
  const [breakingBlocks, setBreakingBlocks] = useState<{ x: number; y: number; id: number }[]>([]);

  const spawnBlock = useCallback((id: number): Block => ({
    id,
    x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
    y: typeof window !== "undefined" ? window.innerHeight + 50 : 800,
    size: 24 + Math.random() * 32,
    type: randomType(),
    speed: 0.3 + Math.random() * 0.7,
    delay: Math.random() * 5000,
    breaking: false,
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init blocks
    blocksRef.current = Array.from({ length: 18 }, (_, i) => {
      const block = spawnBlock(i);
      block.y = Math.random() * window.innerHeight;
      return block;
    });

    let startTime = Date.now();
    let nextId = 18;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, "hsl(210, 60%, 15%)");
      skyGrad.addColorStop(0.5, "hsl(210, 45%, 22%)");
      skyGrad.addColorStop(1, "hsl(222, 28%, 10%)");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw sun
      drawPixelSun(ctx, canvas.width * 0.8, 100, 60, elapsed);

      // Update & draw blocks
      blocksRef.current = blocksRef.current.map((block) => {
        if (elapsed < block.delay) return block;
        if (block.breaking) return block;

        const newY = block.y - block.speed;
        if (newY < -block.size) {
          return spawnBlock(nextId++);
        }

        drawPixelBlock(ctx, block.x, newY, block.size, block.type, block.type === "diamond");
        return { ...block, y: newY };
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [spawnBlock]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check if clicked on a block
    const hitIndex = blocksRef.current.findIndex(
      (b) => clickX >= b.x && clickX <= b.x + b.size && clickY >= b.y && clickY <= b.y + b.size && !b.breaking
    );

    if (hitIndex !== -1) {
      const block = blocksRef.current[hitIndex];
      blocksRef.current[hitIndex] = { ...block, breaking: true };
      setBreakingBlocks((prev) => [...prev, { x: block.x, y: block.y, id: block.id }]);

      setTimeout(() => {
        blocksRef.current = blocksRef.current.filter((b) => b.id !== block.id);
        const newBlock = { ...block, id: Date.now(), y: window.innerHeight + 50, x: Math.random() * window.innerWidth, type: randomType() as Block["type"], breaking: false, delay: 0 };
        blocksRef.current.push(newBlock);
        setBreakingBlocks((prev) => prev.filter((b) => b.id !== block.id));
      }, 400);
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 cursor-crosshair"
        onClick={handleCanvasClick}
      />
      {/* Breaking block particles */}
      {breakingBlocks.map((b) => (
        <div key={b.id} className="fixed z-10 pointer-events-none" style={{ left: b.x, top: b.y }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-mc-dirt animate-block-break"
              style={{
                left: Math.random() * 30 - 15,
                top: Math.random() * 30 - 15,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default MinecraftBackground;
