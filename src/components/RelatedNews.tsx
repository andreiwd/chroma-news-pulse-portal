
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Article } from "@/types/api";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from "react-router-dom";

interface RelatedNewsProps {
  articles: Article[];
}

export default function RelatedNews({ articles }: RelatedNewsProps) {
  // Safety check to ensure articles is an array
  const safeArticles = Array.isArray(articles) ? articles : [];
  
  if (!safeArticles.length) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Notícias Relacionadas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {safeArticles.map((article) => {
          if (!article) return null;
          
          const publishedDate = article.published_at ? new Date(article.published_at) : new Date();
          const timeAgo = formatDistanceToNow(publishedDate, { locale: ptBR, addSuffix: true });
          
          // Make sure category properties are accessed safely
          const categoryName = article.category?.name || "";
          const categoryColor = article.category?.color || `#333`;
          
          return (
            <Link key={article.id} to={`/news/${article.slug}`} className="block">
              <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.featured_image || "https://placehold.co/600x400/333/white?text=News"}
                    alt={article.title || ""}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://placehold.co/600x400/333/white?text=News";
                    }}
                  />
                  {categoryName && (
                    <div 
                      className="absolute bottom-0 left-0 p-2 text-xs font-medium text-white rounded-tr-md"
                      style={{ backgroundColor: categoryColor }}
                    >
                      {categoryName}
                    </div>
                  )}
                </div>
                
                <CardContent className="py-4 flex-1">
                  <h3 className="font-bold line-clamp-2 text-lg mb-2">{article.title || "Sem título"}</h3>
                  <p className="text-muted-foreground line-clamp-2 text-sm">{article.excerpt || "Sem descrição"}</p>
                </CardContent>
                
                <CardFooter className="pt-0 text-xs text-muted-foreground">
                  {timeAgo}
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
