
import { Card, CardContent } from "./ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useNews } from "@/hooks/useNews";
import { Skeleton } from "./ui/skeleton";
import { Article } from "@/types/api";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function FeaturedNewsCarousel() {
  const { data: newsData, isLoading } = useNews(1, "", "");
  
  // Make sure we have an array of articles, even if empty
  const featuredNews: Article[] = Array.isArray(newsData?.data) ? newsData.data.slice(0, 5) : [];
  
  console.log("Featured news data:", featuredNews);

  if (isLoading) {
    return (
      <div className="w-full mb-6 relative overflow-hidden rounded-xl p-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
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
      <div className="mb-6 relative overflow-hidden rounded-xl">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main featured article with title, summary, and date above the image */}
            <div className="lg:col-span-8 flex flex-col overflow-hidden bg-transparent border-0">
              <div className="p-6 flex flex-col justify-center">
                {mainArticle?.category && (
                  <span 
                    className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-3"
                    style={{ 
                      backgroundColor: `${mainArticle.category.color || '#333'}20`,
                      color: mainArticle.category.color || '#333'
                    }}
                  >
                    {mainArticle.category.name || "Sem categoria"}
                  </span>
                )}
                <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: mainArticle?.category?.color || 'inherit' }}>
                  {mainArticle?.title || "Notícia sem título"}
                </h2>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {mainArticle?.excerpt || "Sem descrição disponível"}
                </p>
                <div className="text-sm text-muted-foreground mb-4">
                  {mainArticle?.published_at && new Date(mainArticle.published_at).toLocaleDateString('pt-BR')}
                </div>
                <Button variant="outline" size="sm" className="w-fit mb-6" asChild>
                  <Link to={`/news/${mainArticle?.slug}`}>
                    Leia mais <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
              <div className="relative min-h-[300px]">
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

            {/* Side articles (cards) */}
            <div className="lg:col-span-4">
              <div className="flex flex-col space-y-4 h-full">
                {sideArticles.map((article, index) => {
                  if (!article || typeof article !== 'object') return null;
                  
                  const categoryColor = article.category?.color || '#333';
                  const articleId = article.id || `side-article-${index}`;
                  
                  return (
                    <Link 
                      key={articleId}
                      to={`/news/${article.slug}`}
                      className="p-3 border-l-2 hover:bg-muted/20 transition-colors flex items-start"
                      style={{ borderLeftColor: categoryColor }}
                    >
                      <div className="flex-grow">
                        <div className="text-xs font-medium mb-1" style={{ color: categoryColor }}>
                          {article.category?.name || "Sem categoria"}
                        </div>
                        <h3 className="font-medium line-clamp-2 text-sm">
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
  );
}
