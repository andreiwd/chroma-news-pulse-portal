
import { Link } from "react-router-dom";
import { Article } from "@/types/api";

interface LatestNewsSidebarProps {
  latestNewsItems: Article[];
}

export default function LatestNewsSidebar({ latestNewsItems }: LatestNewsSidebarProps) {
  // Ensure latestNewsItems is an array
  const safeNewsItems = Array.isArray(latestNewsItems) ? latestNewsItems : [];
  
  return (
    <div className="bg-muted/30 p-4 rounded-lg mt-6">
      <h3 className="text-lg font-bold mb-4 border-b pb-2">Últimas Notícias</h3>
      <div className="space-y-3">
        {safeNewsItems.slice(0, 5).map((news) => {
          if (!news || typeof news !== 'object') return null;
          // Use optional chaining and provide defaults
          const categoryColor = news.category?.color || '#333';
          
          return (
            <div 
              key={news.id} 
              className="border-l-2 pl-2 py-1 hover:bg-muted/50 transition-colors"
              style={{ borderLeftColor: categoryColor }}
            >
              <Link 
                to={`/news/${news.slug}`}
                className="text-sm font-medium hover:underline line-clamp-2"
                style={{ color: categoryColor }}
              >
                {news.title || "Notícia sem título"}
              </Link>
              <div className="text-xs text-muted-foreground mt-1">
                {news.published_at && new Date(news.published_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
