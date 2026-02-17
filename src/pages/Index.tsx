import { useState, useEffect, useRef } from "react";
import MinecraftBackground from "@/components/MinecraftBackground";
import CountdownTimer from "@/components/CountdownTimer";
import PartyEffects, { PartyOverlay } from "@/components/PartyEffects";
import GiftList from "@/components/GiftList";
import { MapPin, MessageCircle, Gift, PartyPopper, Volume2, VolumeX } from "lucide-react";

const Index = () => {
  const [showGifts, setShowGifts] = useState(false);
  const [partyActive, setPartyActive] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Party effects logic
  const triggerParty = () => {
    if (partyActive) return;
    setPartyActive(true);

    const CONFETTI_COLORS = [
      "hsl(100, 38%, 35%)",
      "hsl(185, 70%, 55%)",
      "hsl(45, 80%, 55%)",
      "hsl(0, 70%, 50%)",
      "hsl(270, 60%, 55%)",
      "hsl(30, 50%, 30%)",
    ];

    const newParticles: any[] = [];
    let id = 0;

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
      setPartyActive(false);
      setParticles([]);
    }, 3000);
  };

  // Music setup
  useEffect(() => {
    // Create audio context for generated Minecraft-style music
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    let ctx: AudioContext | null = null;
    let interval: ReturnType<typeof setInterval> | null = null;

    const notes = [262, 294, 330, 349, 392, 440, 494, 523, 587, 659];

    const playNote = (audioCtx: AudioContext, freq: number, time: number, duration: number) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(time);
      osc.stop(time + duration);
    };

    if (musicPlaying) {
      ctx = new AudioContext();
      let noteIndex = 0;

      const playSequence = () => {
        if (!ctx) return;
        const now = ctx.currentTime;
        for (let i = 0; i < 4; i++) {
          const idx = (noteIndex + i) % notes.length;
          playNote(ctx, notes[idx], now + i * 0.5, 0.45);
        }
        noteIndex = (noteIndex + 2) % notes.length;
      };

      playSequence();
      interval = setInterval(playSequence, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (ctx) ctx.close();
    };
  }, [musicPlaying]);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Olá! Confirmo minha presença na festa do Samuel no dia 07/03! 🎂⛏️");
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const handleLocation = () => {
    // Placeholder - user should update with real location
    window.open("https://maps.google.com", "_blank");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <MinecraftBackground />
      <PartyOverlay active={partyActive} particles={particles} />
      <GiftList open={showGifts} onClose={() => setShowGifts(false)} />

      {/* Music toggle */}
      <button
        onClick={() => setMusicPlaying(!musicPlaying)}
        className="fixed top-4 right-4 z-30 mc-btn bg-secondary p-3 sm:p-3"
        aria-label="Toggle music"
      >
        {musicPlaying ? (
          <Volume2 className="w-5 h-5 text-mc-gold" />
        ) : (
          <VolumeX className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:py-12 pointer-events-none [&_button]:pointer-events-auto [&_a]:pointer-events-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-block mc-block-texture bg-primary/80 border-4 border-mc-grass-light px-4 sm:px-8 py-2 sm:py-3 mb-4">
            <p className="font-pixel text-[10px] sm:text-xs text-primary-foreground tracking-widest">
              ⛏️ CONVITE ESPECIAL ⛏️
            </p>
          </div>

          <h1 className="font-pixel text-xl sm:text-3xl md:text-4xl text-mc-gold leading-relaxed mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Festa do
          </h1>
          <h1 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-mc-diamond leading-relaxed mb-4 drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)] animate-shimmer-diamond">
            Samuel
          </h1>

          <div className="mc-block-texture bg-card/80 border-2 border-mc-stone inline-block px-4 sm:px-6 py-2">
            <p className="font-minecraft text-xl sm:text-3xl text-foreground">
              📅 07 de Março de 2026
            </p>
          </div>
        </div>

        {/* Countdown */}
        <div className="mb-8 sm:mb-12">
          <p className="font-pixel text-[10px] sm:text-xs text-muted-foreground text-center mb-3 tracking-wider">
            FALTAM
          </p>
          <CountdownTimer />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm sm:max-w-md">
          <button
            onClick={handleLocation}
            className="mc-btn bg-primary text-primary-foreground py-3 sm:py-4 px-3 sm:px-6 flex flex-col items-center gap-2 mc-block-texture"
          >
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="font-pixel text-[8px] sm:text-[10px]">Localização</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="mc-btn bg-mc-creeper text-primary-foreground py-3 sm:py-4 px-3 sm:px-6 flex flex-col items-center gap-2 mc-block-texture"
          >
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="font-pixel text-[8px] sm:text-[10px]">Confirmar</span>
          </button>

          <button
            onClick={() => setShowGifts(true)}
            className="mc-btn bg-mc-gold text-accent-foreground py-3 sm:py-4 px-3 sm:px-6 flex flex-col items-center gap-2 mc-block-texture"
          >
            <Gift className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="font-pixel text-[8px] sm:text-[10px]">Presentes</span>
          </button>

          <button
            onClick={triggerParty}
            className="mc-btn bg-mc-diamond text-accent-foreground py-3 sm:py-4 px-3 sm:px-6 flex flex-col items-center gap-2 mc-block-texture animate-pulse-glow"
          >
            <PartyPopper className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="font-pixel text-[8px] sm:text-[10px]">Festa!</span>
          </button>
        </div>

        {/* Creeper face decoration */}
        <div className="mt-8 sm:mt-12 opacity-30">
          <div className="grid grid-cols-8 gap-0" style={{ width: 64, height: 64 }}>
            {[
              0,0,0,0,0,0,0,0,
              0,1,1,0,0,1,1,0,
              0,1,1,0,0,1,1,0,
              0,0,0,1,1,0,0,0,
              0,0,1,1,1,1,0,0,
              0,0,1,1,1,1,0,0,
              0,0,1,0,0,1,0,0,
              0,0,0,0,0,0,0,0,
            ].map((cell, i) => (
              <div
                key={i}
                className={cell ? "bg-mc-creeper" : "bg-mc-grass"}
                style={{ width: 8, height: 8 }}
              />
            ))}
          </div>
        </div>

        <p className="font-pixel text-[8px] text-muted-foreground mt-6 text-center">
          Clique nos blocos para quebrá-los! ⛏️
        </p>
      </div>
    </div>
  );
};

export default Index;
