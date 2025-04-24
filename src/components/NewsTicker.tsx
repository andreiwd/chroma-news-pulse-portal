
import { useEffect, useState } from "react";
import newsData from "@/data/newsData";

export default function NewsTicker() {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  
  // Filter latest breaking news or most recent news
  const latestNews = newsData
    .filter(article => article.isBreaking || article.publishedAt)
    .sort((a, b) => {
      // Prioritize breaking news
      if (a.isBreaking && !b.isBreaking) return -1;
      if (!a.isBreaking && b.isBreaking) return 1;
      
      // Then sort by publish date
      if (a.publishedAt && b.publishedAt) {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      return 0;
    })
    .slice(0, 5); // Get top 5

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % latestNews.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [latestNews.length]);

  return (
    <div className="bg-gradient-to-r from-primary/90 to-primary py-2 text-white">
      <div className="container flex items-center space-x-4 overflow-hidden">
        <span className="font-semibold whitespace-nowrap">Últimas Notícias:</span>
        <div className="overflow-hidden h-6">
          <p
            key={currentNewsIndex}
            className="animate-[tickerFade_4s_ease-in-out_infinite]"
          >
            {latestNews[currentNewsIndex]?.title || "Carregando notícias..."}
          </p>
        </div>
      </div>
    </div>
  );
}
