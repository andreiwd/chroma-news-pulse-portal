
import { Link } from "react-router-dom";
import { Article } from "@/types/api";

interface LatestNewsSidebarProps {
  latestNewsItems: Article[];
}

export default function LatestNewsSidebar({ latestNewsItems }: LatestNewsSidebarProps) {
  // Ensure latestNewsItems is an array
  const safeNewsItems = Array.isArray(latestNewsItems) ? latestNewsItems : [];
  
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="bg-primary text-primary-foreground p-4">
        <h3 className="text-lg font-bold">Últimas Notícias</h3>
      </div>
      
      <div className="divide-y">
        {safeNewsItems.slice(0, 5).map((news, index) => {
          if (!news || typeof news !== 'object') return null;
          
          // Use optional chaining and provide defaults
          const categoryColor = news.category?.color || '#333';
          const newsId = news.id || `latest-news-${index}`; // Ensure a unique key even if id is missing
          
          return (
            <div 
              key={newsId} 
              className="p-3 hover:bg-muted/20 transition-colors"
            >
              <Link 
                to={`/noticia/${news.slug}`}
                className="text-sm font-medium hover:underline line-clamp-2 block"
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
      
      <div className="p-3 bg-muted/10 text-center">
        <Link to="/busca" className="text-sm text-primary font-medium hover:underline">
          Ver todas as notícias
        </Link>
      </div>
    </div>
  );
}
