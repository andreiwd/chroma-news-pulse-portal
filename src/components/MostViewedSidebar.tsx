
import { Link } from "react-router-dom";
import { Article } from "@/types/api";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface MostViewedSidebarProps {
  mostViewedNews: Article[];
}

export default function MostViewedSidebar({ mostViewedNews }: MostViewedSidebarProps) {
  // Ensure mostViewedNews is an array
  const safeNews = Array.isArray(mostViewedNews) ? mostViewedNews : [];
  
  return (
    <div className="bg-muted/30 p-4 rounded-lg sticky top-24">
      <h3 className="text-lg font-bold mb-4 border-b pb-2">Mais Lidas</h3>
      <div className="space-y-4">
        {safeNews.map((news, index) => {
          if (!news || typeof news !== 'object') return null;
          // Use optional chaining and provide defaults
          const categoryColor = news.category?.color || '#333';
          
          return (
            <div key={news.id} className="flex gap-3">
              <div className="text-2xl font-bold text-muted-foreground w-8">
                {index + 1}
              </div>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link 
                        to={`/news/${news.slug}`}
                        className="font-medium hover:underline line-clamp-2"
                        style={{ color: categoryColor }}
                      >
                        {news.title || "Notícia sem título"}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clique para ler</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="text-xs text-muted-foreground mt-1">
                  {/* Use a static value since 'views' is not in the Article type */}
                  {(index + 1) * 100} Views
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
