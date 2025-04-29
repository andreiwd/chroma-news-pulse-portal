
import { Link } from "react-router-dom";
import { Article } from "@/types/api";

interface MostViewedSidebarProps {
  mostViewedNews: Article[];
}

export default function MostViewedSidebar({ mostViewedNews }: MostViewedSidebarProps) {
  return (
    <div className="bg-muted/30 p-4 rounded-lg sticky top-24">
      <h3 className="text-lg font-bold mb-4 border-b pb-2">Mais Lidas</h3>
      <div className="space-y-4">
        {mostViewedNews.map((news, index) => {
          if (!news) return null;
          const categoryColor = news.category?.color || '#333';
          
          return (
            <div key={news.id} className="flex gap-3">
              <div className="text-2xl font-bold text-muted-foreground w-8">
                {index + 1}
              </div>
              <div>
                <Link 
                  to={`/news/${news.slug}`}
                  className="font-medium hover:underline line-clamp-2"
                  style={{ color: categoryColor }}
                >
                  {news.title || "Notícia sem título"}
                </Link>
                <div className="text-xs text-muted-foreground mt-1">
                  Views
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
