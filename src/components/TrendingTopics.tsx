
import { Article } from "@/types/api";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";

interface TrendingTopicsProps {
  trendingNews: Article[];
}

export default function TrendingTopics({ trendingNews }: TrendingTopicsProps) {
  // Make sure we have trending news
  const validTrendingNews = Array.isArray(trendingNews) ? trendingNews.filter(Boolean) : [];
  
  if (!validTrendingNews.length) return null;
  
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2 text-primary font-semibold shrink-0 pr-4 border-r border-gray-200">
        <TrendingUp className="h-4 w-4" />
        <span>Trending</span>
      </div>
      
      <ScrollArea className="w-full px-4">
        <div className="flex gap-8 py-1">
          {validTrendingNews.map((news) => {
            if (!news) return null;
            
            // Safely access category color with fallback
            const categoryColor = news.category && typeof news.category === 'object' && news.category !== null 
              ? news.category.color || 'inherit'
              : 'inherit';
            
            return (
              <Link 
                key={news.id} 
                to={`/news/${news.slug}`}
                className="text-sm font-medium whitespace-nowrap hover:underline"
                style={{ color: categoryColor }}
              >
                {news.title || "Notícia sem título"}
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
