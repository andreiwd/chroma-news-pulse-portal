
import { useState, useEffect } from 'react';
import { useLatestNews } from "@/hooks/useNews";
import { Link } from "react-router-dom";
import { Article } from "@/types/api";

export default function NewsTicker() {
  const { data: latestNewsData, isLoading } = useLatestNews();
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  
  // Ensure latestNews is always a valid array
  const latestNews: Article[] = Array.isArray(latestNewsData) ? latestNewsData.filter(Boolean) : [];
  
  // Reset index if it's out of bounds
  useEffect(() => {
    if (latestNews.length > 0 && currentNewsIndex >= latestNews.length) {
      setCurrentNewsIndex(0);
    }
  }, [latestNews, currentNewsIndex]);
  
  useEffect(() => {
    if (!latestNews?.length) return;
    
    const timer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % latestNews.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [latestNews?.length]);

  // Avoid rendering until data is loaded
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-primary/90 to-primary py-2 text-white">
        <div className="container flex items-center space-x-4 overflow-hidden">
          <span className="font-semibold whitespace-nowrap">Últimas Notícias:</span>
          <p className="animate-pulse">Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/90 to-primary py-2 text-white" style={{
      background: `linear-gradient(to right, hsl(var(--primary) / 0.9), hsl(var(--primary)))`
    }}>
      <div className="container flex items-center space-x-4 overflow-hidden">
        <span className="font-semibold whitespace-nowrap">Últimas Notícias:</span>
        <div className="overflow-hidden h-6">
          {latestNews?.length > 0 && currentNewsIndex < latestNews.length && latestNews[currentNewsIndex] ? (
            <Link
              to={`/news/${latestNews[currentNewsIndex].slug}`}
              key={`ticker-${latestNews[currentNewsIndex].id}`}
              className="block animate-[tickerFade_4s_ease-in-out_infinite] hover:underline text-white"
            >
              {latestNews[currentNewsIndex].title || "Notícia sem título"}
            </Link>
          ) : (
            <p className="text-white">Nenhuma notícia encontrada</p>
          )}
        </div>
      </div>
    </div>
  );
}
