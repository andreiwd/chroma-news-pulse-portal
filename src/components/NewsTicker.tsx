
import { useState, useEffect } from 'react';
import { useLatestNews } from "@/hooks/useNews";
import { Link } from "react-router-dom";
import { Article } from "@/types/api";
import { useSupabaseConfig } from "@/hooks/useSupabaseConfig";

export default function NewsTicker() {
  const { data: latestNewsData, isLoading } = useLatestNews();
  const { getConfig } = useSupabaseConfig();
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [primaryColor, setPrimaryColor] = useState('#1a73e8');
  
  // Ensure latestNews is always a valid array
  const latestNews: Article[] = Array.isArray(latestNewsData) ? latestNewsData.filter(Boolean) : [];
  
  // Load primary color from config
  useEffect(() => {
    const loadColors = async () => {
      try {
        const config = await getConfig('frontend_settings');
        if (config && typeof config === 'object') {
          const settings = config as any;
          if (settings.colors?.primary) {
            setPrimaryColor(settings.colors.primary);
          }
        }
      } catch (error) {
        console.error("Error loading colors for ticker:", error);
      }
    };

    loadColors();
  }, [getConfig]);
  
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
      <div 
        className="py-2 text-white"
        style={{
          background: `linear-gradient(to right, ${primaryColor}90, ${primaryColor})`
        }}
      >
        <div className="container flex items-center space-x-4 overflow-hidden">
          <span className="font-semibold whitespace-nowrap text-white">Últimas Notícias:</span>
          <p className="animate-pulse text-white">Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="py-2 text-white"
      style={{
        background: `linear-gradient(to right, ${primaryColor}90, ${primaryColor})`
      }}
    >
      <div className="container flex items-center space-x-4 overflow-hidden">
        <span className="font-semibold whitespace-nowrap text-white">Últimas Notícias:</span>
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
