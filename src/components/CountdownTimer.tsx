import { useEffect, useState } from "react";

const CountdownTimer = () => {
  const targetDate = new Date("2026-03-07T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "DIAS", value: timeLeft.days },
    { label: "HORAS", value: timeLeft.hours },
    { label: "MIN", value: timeLeft.minutes },
    { label: "SEG", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-2 sm:gap-4 justify-center">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex flex-col items-center mc-block-texture bg-secondary p-2 sm:p-4 min-w-[60px] sm:min-w-[80px] border-2 border-mc-stone"
        >
          <span className="text-2xl sm:text-4xl font-pixel text-mc-gold animate-pulse-glow">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-xs sm:text-sm font-pixel text-muted-foreground mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
