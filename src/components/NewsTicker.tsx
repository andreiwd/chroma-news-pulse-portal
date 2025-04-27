
import React, { useState, useEffect } from 'react';
import { useLatestNews } from "@/hooks/useNews";
import { Link } from "react-router-dom";

export default function NewsTicker() {
  const { data: latestNews, isLoading } = useLatestNews();
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  
  useEffect(() => {
    if (!latestNews?.length) return;
    
    const timer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % latestNews.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [latestNews?.length]);

  return (
    <div className="bg-gradient-to-r from-primary/90 to-primary py-2 text-white">
      <div className="container flex items-center space-x-4 overflow-hidden">
        <span className="font-semibold whitespace-nowrap">Últimas Notícias:</span>
        <div className="overflow-hidden h-6">
          {isLoading ? (
            <p className="animate-pulse">Carregando notícias...</p>
          ) : latestNews?.length ? (
            <Link
              to={`/news/${latestNews[currentNewsIndex]?.slug}`}
              key={latestNews[currentNewsIndex]?.slug}
              className="block animate-[tickerFade_4s_ease-in-out_infinite] hover:underline"
            >
              {latestNews[currentNewsIndex]?.title}
            </Link>
          ) : (
            <p>Nenhuma notícia encontrada</p>
          )}
        </div>
      </div>
    </div>
  );
}
