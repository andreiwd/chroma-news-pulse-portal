
import { Article } from "@/types/api";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface FeaturedNewsHeroProps {
  featuredArticles: Article[];
}

export default function FeaturedNewsHero({ featuredArticles }: FeaturedNewsHeroProps) {
  if (!featuredArticles || featuredArticles.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-pulse">
        <div className="lg:col-span-2">
          <Skeleton className="h-80 rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[calc(40px*2)] rounded-lg" />
          <Skeleton className="h-[calc(40px*2)] rounded-lg" />
        </div>
      </div>
    );
  }

  // Ensure we have valid articles
  const mainArticle = featuredArticles[0];
  const sideArticles = featuredArticles.slice(1, 3);

  if (!mainArticle) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Main Featured Article - Removida exibição da categoria */}
      <div className="lg:col-span-2 bg-white rounded-xl overflow-hidden shadow-md group">
        <Link to={`/news/${mainArticle.slug}`} className="block">
          <div className="relative h-80">
            <img
              src={mainArticle.featured_image || "https://placehold.co/1200x800/333/white?text=Featured+News"}
              alt={mainArticle.title || "Featured News"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://placehold.co/1200x800/333/white?text=Featured+News";
              }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {mainArticle.title || "Notícia sem título"}
              </h2>
              
              <p className="text-white/80 mb-3 line-clamp-2">
                {mainArticle.excerpt || "Sem descrição disponível"}
              </p>
              
              <div className="text-sm text-white/70">
                {mainArticle.published_at && new Date(mainArticle.published_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Side Articles */}
      <div className="space-y-4">
        {sideArticles.map((article, index) => {
          if (!article) return null;
          
          // Process category safely to get primitive values
          let categoryColor = '#fff';
          let categoryTextColor = '#fff';
          let categoryName = 'Sem categoria';
          
          if (article.category && typeof article.category === 'object') {
            categoryColor = typeof article.category.color === 'string' ? article.category.color : '#fff';
            categoryTextColor = typeof article.category.text_color === 'string' ? article.category.text_color : '#fff';
            categoryName = typeof article.category.name === 'string' ? article.category.name : 'Sem categoria';
          }
          
          return (
            <Link 
              key={article.id || `side-article-${index}`}
              to={`/news/${article.slug}`} 
              className="flex flex-col h-[calc(40vh/2)] max-h-40 bg-white rounded-lg shadow-md overflow-hidden relative group"
            >
              <div className="absolute inset-0">
                <img
                  src={article.featured_image || "https://placehold.co/800x400/333/white"}
                  alt={article.title || "News"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://placehold.co/800x400/333/white";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex flex-col justify-end">
                  <div className="mb-1">
                    {article.category && typeof article.category === 'object' && (
                      <span 
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: categoryColor,
                          color: categoryTextColor
                        }}
                      >
                        {categoryName}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-lg line-clamp-2">
                    {article.title || "Notícia sem título"}
                  </h3>
                </div>
              </div>
            </Link>
          );
        })}
        
        {/* See More Button - Only show if we have articles */}
        {featuredArticles.length > 0 && (
          <Button asChild className="w-full">
            <Link to="/category/destaque">
              Mais destaques <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
