
import { Article } from "@/types/api";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface TrendingTopicsProps {
  trendingNews: Article[];
}

export default function TrendingTopics({ trendingNews }: TrendingTopicsProps) {
  // Make sure we have trending news
  const validTrendingNews = Array.isArray(trendingNews) ? trendingNews.filter(Boolean) : [];
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    if (!validTrendingNews?.length) return;
    
    const timer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % validTrendingNews.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [validTrendingNews]);
  
  if (!validTrendingNews.length) return null;
  
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2 text-primary font-semibold shrink-0 pr-4 border-r border-gray-200">
        <TrendingUp className="h-4 w-4" />
        <span>Trending</span>
      </div>
      
      <div className="px-4 overflow-hidden">
        <div className="py-1">
          {validTrendingNews.map((news, index) => {
            if (!news) return null;
            
            // Extract category color safely
            const categoryObj = news.category;
            const categoryColor = categoryObj && typeof categoryObj === 'object' 
              ? String(categoryObj.color || 'inherit') 
              : 'inherit';
            
            // Display with animation
            return (
              <Link 
                key={news.id || `trending-${index}`}
                to={`/news/${news.slug || ''}`}
                className={`text-sm font-medium whitespace-nowrap hover:underline block transition-opacity duration-500 ${index === currentNewsIndex ? 'opacity-100' : 'opacity-0 hidden'}`}
                style={{ color: categoryColor }}
              >
                {news.title || "Notícia sem título"}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
