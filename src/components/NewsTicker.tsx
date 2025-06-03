
import { useState, useEffect, useCallback } from 'react';
import { useLatestNews } from "@/hooks/useNews";
import { Link } from "react-router-dom";
import { Article } from "@/types/api";
import { useSupabaseConfig } from "@/hooks/useSupabaseConfig";

export default function NewsTicker() {
  const { data: latestNewsData, isLoading } = useLatestNews();
  const { getConfig } = useSupabaseConfig();
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [primaryColor, setPrimaryColor] = useState('#1a73e8');
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  
  // Ensure latestNews is always a valid array
  const latestNews: Article[] = Array.isArray(latestNewsData) ? latestNewsData.filter(Boolean) : [];
  
  // Load primary color from config
  const loadColors = useCallback(async () => {
    if (isConfigLoaded) return; // Evita recarregamentos desnecessários
    
    try {
      const config = await getConfig('frontend_settings');
      if (config && typeof config === 'object') {
        const configData = config as Record<string, any>;
        if (configData.colors?.primary) {
          setPrimaryColor(configData.colors.primary);
        }
      }
      setIsConfigLoaded(true);
    } catch (error) {
      console.error("Erro ao carregar cores para o ticker:", error);
      setIsConfigLoaded(true);
    }
  }, [getConfig, isConfigLoaded]);

  useEffect(() => {
    loadColors();
  }, [loadColors]);
  
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
        className="py-3 text-white"
        style={{
          background: `linear-gradient(to right, ${primaryColor}dd, ${primaryColor})`
        }}
      >
        <div className="container flex items-center space-x-4 overflow-hidden">
          <span className="font-semibold whitespace-nowrap text-white bg-black/20 px-3 py-1 rounded-full text-sm">
            Últimas Notícias
          </span>
          <p className="animate-pulse text-white">Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="py-3 text-white border-b"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}dd, ${primaryColor})`
      }}
    >
      <div className="container flex items-center space-x-4 overflow-hidden">
        <span className="font-semibold whitespace-nowrap text-white bg-black/20 px-3 py-1 rounded-full text-sm flex-shrink-0">
          Últimas Notícias
        </span>
        <div className="overflow-hidden h-6 flex-1">
          {latestNews?.length > 0 && currentNewsIndex < latestNews.length && latestNews[currentNewsIndex] ? (
            <Link
              to={`/news/${latestNews[currentNewsIndex].slug}`}
              key={`ticker-${latestNews[currentNewsIndex].id}`}
              className="block animate-[tickerFade_4s_ease-in-out_infinite] hover:underline text-white transition-all duration-300 hover:text-white/90"
            >
              {latestNews[currentNewsIndex].title || "Notícia sem título"}
            </Link>
          ) : (
            <p className="text-white/80 text-sm">Nenhuma notícia encontrada</p>
          )}
        </div>
      </div>
    </div>
  );
}
