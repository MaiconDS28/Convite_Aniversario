import { useState } from "react";

const gifts = [
  { name: "🎮 Controle de videogame", emoji: "🎮" },
  { name: "⛏️ LEGO Minecraft", emoji: "⛏️" },
  { name: "📚 Livro de aventura", emoji: "📚" },
  { name: "🎨 Kit de arte/desenho", emoji: "🎨" },
  { name: "🧸 Pelúcia Creeper", emoji: "🧸" },
  { name: "👕 Camiseta Minecraft", emoji: "👕" },
  { name: "🎧 Fone de ouvido gamer", emoji: "🎧" },
  { name: "🏗️ Blocos de montar", emoji: "🏗️" },
  { name: "🎲 Jogo de tabuleiro", emoji: "🎲" },
  { name: "💎 Minecraft Gift Card", emoji: "💎" },
];

const GiftList = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div
        className="relative bg-card mc-block-texture border-4 border-mc-stone p-4 sm:p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-pixel text-sm sm:text-base text-mc-gold text-center mb-4">
          💎 Sugestões de Presentes 💎
        </h2>
        <div className="space-y-2">
          {gifts.map((gift, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-muted mc-block-texture border-2 border-mc-dirt hover:border-mc-grass-light transition-colors"
            >
              <span className="text-2xl">{gift.emoji}</span>
              <span className="font-minecraft text-lg text-foreground">{gift.name}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full mc-btn bg-destructive text-destructive-foreground py-2 px-4 text-xs"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default GiftList;
