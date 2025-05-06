
import { Card } from "./ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useNews } from "@/hooks/useNews";
import { Skeleton } from "./ui/skeleton";
import { Article } from "@/types/api";
import { Link } from "react-router-dom";

export default function FeaturedNewsCarousel() {
  const { data: newsData, isLoading } = useNews(1, "", "");
  
  // Make sure we have an array of articles, even if empty
  const featuredNews: Article[] = Array.isArray(newsData?.data) ? newsData.data.slice(0, 5) : [];

  if (isLoading) {
    return (
      <div className="w-full mb-6 relative overflow-hidden rounded-xl">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <Skeleton className="h-24 w-3/4 mb-4" />
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-[300px] w-full" />
            </div>
            <div className="lg:col-span-4 space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!featuredNews.length) {
    return null;
  }

  const mainArticle = featuredNews[0];
  const sideArticles = featuredNews.slice(1, 5);

  return (
    <div className="w-full">
      <div className="mb-8 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main featured article */}
            <div className="lg:col-span-8">
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  {mainArticle?.category && typeof mainArticle.category === 'object' && (
                    <span 
                      className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-3"
                      style={{ 
                        backgroundColor: `${String(mainArticle.category.color || '#333')}20`,
                        color: String(mainArticle.category.color || '#333')
                      }}
                    >
                      {String(mainArticle.category.name || "Sem categoria")}
                    </span>
                  )}
                  
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    <Link 
                      to={`/news/${mainArticle?.slug}`}
                      className="hover:underline"
                      style={{ 
                        color: mainArticle?.category && typeof mainArticle.category === 'object' 
                          ? String(mainArticle.category.color || 'inherit')
                          : 'inherit'
                      }}
                    >
                      {mainArticle?.title || "Notícia sem título"}
                    </Link>
                  </h2>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {mainArticle?.excerpt || "Sem descrição disponível"}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {mainArticle?.published_at && new Date(mainArticle.published_at).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/news/${mainArticle?.slug}`}>
                        Leia mais <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="relative rounded-lg overflow-hidden shadow-sm h-[320px]">
                  <Link to={`/news/${mainArticle?.slug}`} className="block h-full">
                    <img
                      src={mainArticle?.featured_image || "https://placehold.co/800x450/333/white?text=Featured+News"}
                      alt={mainArticle?.title || "Featured news"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://placehold.co/800x450/333/white?text=Featured+News";
                      }}
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Side articles */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-bold mb-4 pb-2 border-b">
                  Últimas Atualizações
                </h3>
                <div className="flex flex-col space-y-4">
                  {sideArticles.map((article, index) => {
                    if (!article || typeof article !== 'object') return null;
                    
                    const categoryColor = article.category && typeof article.category === 'object' 
                      ? String(article.category.color || '#333')
                      : '#333';
                    const articleId = article.id || `side-article-${index}`;
                    
                    return (
                      <Link 
                        key={articleId}
                        to={`/news/${article.slug}`}
                        className="p-3 border-l-2 hover:bg-muted/20 transition-colors flex items-start rounded"
                        style={{ borderLeftColor: categoryColor }}
                      >
                        <div className="flex-grow">
                          <div className="text-xs font-medium mb-1" style={{ color: categoryColor }}>
                            {article.category && typeof article.category === 'object' 
                              ? String(article.category.name || "Sem categoria")
                              : "Sem categoria"}
                          </div>
                          <h3 className="font-medium line-clamp-2">
                            {article.title || "Notícia sem título"}
                          </h3>
                          <div className="text-xs text-muted-foreground mt-1">
                            {article.published_at && new Date(article.published_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
