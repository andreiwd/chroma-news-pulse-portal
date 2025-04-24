
import { useEffect, useState } from "react";

const latestNews = [
  { id: 1, title: "Nova descoberta revoluciona tratamento contra o câncer" },
  { id: 2, title: "Mercado financeiro reage positivamente a dados econômicos" },
  { id: 3, title: "Brasil conquista medalha de ouro nas Olimpíadas" },
  { id: 4, title: "Cientistas descobrem novo planeta habitável" },
  { id: 5, title: "Avanço tecnológico promete revolucionar energia limpa" },
];

export default function NewsTicker() {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % latestNews.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-primary/90 to-primary py-2 text-white">
      <div className="container flex items-center space-x-4">
        <span className="font-semibold whitespace-nowrap">Últimas Notícias:</span>
        <div className="overflow-hidden h-6">
          <p
            key={currentNewsIndex}
            className="animate-[tickerFade_4s_ease-in-out_infinite]"
          >
            {latestNews[currentNewsIndex].title}
          </p>
        </div>
      </div>
    </div>
  );
}
