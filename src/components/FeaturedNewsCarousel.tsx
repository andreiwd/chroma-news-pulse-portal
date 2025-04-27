
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useNews } from "@/hooks/useNews";
import { Skeleton } from "./ui/skeleton";
import { Article } from "@/types/api";

export default function FeaturedNewsCarousel() {
  const { data: newsData, isLoading } = useNews(1, "", "");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  
  // Get featured news (first 4 articles)
  const featuredNews: Article[] = newsData?.data?.slice(0, 4) || [];

  useEffect(() => {
    if (!featuredNews.length || !isAutoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => 
        current === featuredNews.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredNews.length, isAutoplay]);

  if (isLoading) {
    return (
      <div className="w-full mb-6 relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-2xl">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="lg:col-span-1">
              <div className="grid grid-cols-1 gap-4 h-full">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!featuredNews.length) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="mb-6 relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-2xl">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Article */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden border-0 bg-transparent shadow-none">
                <div className="relative h-[400px]">
                  <img
                    src={featuredNews[activeIndex]?.featured_image || "https://placehold.co/800x450/333/white?text=Featured+News"}
                    alt={featuredNews[activeIndex]?.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://placehold.co/800x450/333/white?text=Featured+News";
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <span 
                    className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-3"
                    style={{ 
                      backgroundColor: featuredNews[activeIndex]?.category?.color || '#333',
                      color: featuredNews[activeIndex]?.category?.text_color || '#fff'
                    }}
                  >
                    {featuredNews[activeIndex]?.category?.name}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    {featuredNews[activeIndex]?.title}
                  </h2>
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {featuredNews[activeIndex]?.excerpt}
                  </p>
                  <Button variant="secondary" size="sm" className="text-primary" asChild>
                    <Link to={`/news/${featuredNews[activeIndex]?.slug}`}>
                      Leia mais <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Thumbnails */}
            <div className="lg:col-span-1">
              <div className="grid grid-cols-1 gap-4 h-full">
                {featuredNews.map((article, index) => (
                  <button
                    key={article.id}
                    onClick={() => {
                      setActiveIndex(index);
                      setIsAutoplay(false);
                    }}
                    className={cn(
                      "w-full text-left transition-all duration-300 hover:bg-white/10 rounded-lg p-2 flex items-center",
                      activeIndex === index ? "bg-white/10" : "opacity-70"
                    )}
                  >
                    <div className="flex gap-3 items-center w-full">
                      <img
                        src={article.featured_image || "https://placehold.co/100x100/333/white?text=News"}
                        alt={article.title}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "https://placehold.co/100x100/333/white?text=News";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span 
                          className="text-xs font-medium px-2 py-1 rounded-full inline-block mb-2"
                          style={{ 
                            backgroundColor: article.category?.color || '#333',
                            color: article.category?.text_color || '#fff'
                          }}
                        >
                          {article.category?.name}
                        </span>
                        <h3 className="text-sm font-medium text-white line-clamp-2">
                          {article.title}
                        </h3>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
