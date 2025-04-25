
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { NewsArticle } from "@/data/newsData";
import { Badge } from "./ui/badge";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface FeaturedNewsCarouselProps {
  highlightedNews: NewsArticle[];
}

export default function FeaturedNewsCarousel({ highlightedNews }: FeaturedNewsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  
  // Limit to 4 news articles
  const featuredNews = highlightedNews.slice(0, 4);

  useEffect(() => {
    if (!isAutoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => 
        current === featuredNews.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredNews.length, isAutoplay]);

  return (
    <div className="w-full">
      <div className="mb-6 relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-2xl">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Article */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden border-0 bg-transparent shadow-none">
                <div className="relative h-[400px]"> {/* Fixed height */}
                  <img
                    src={featuredNews[activeIndex].image || "https://placehold.co/800x450/333/white?text=Featured+News"}
                    alt={featuredNews[activeIndex].title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://placehold.co/800x450/333/white?text=Featured+News";
                    }}
                  />
                  {featuredNews[activeIndex].isBreaking && (
                    <Badge 
                      variant="destructive" 
                      className="absolute top-4 left-4 animate-pulse"
                    >
                      Última hora
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <span 
                    className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-3"
                    style={{ 
                      backgroundColor: `var(--category-${featuredNews[activeIndex].category}-light)`,
                      color: `var(--category-${featuredNews[activeIndex].category})`
                    }}
                  >
                    {featuredNews[activeIndex].category}
                  </span>
                  <h2 
                    className="text-2xl md:text-3xl font-bold mb-4 text-white"
                  >
                    {featuredNews[activeIndex].title}
                  </h2>
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {featuredNews[activeIndex].excerpt}
                  </p>
                  <Button variant="secondary" size="sm" className="text-primary" asChild>
                    <a href={`/news/${featuredNews[activeIndex].id}`}>
                      Leia mais <ArrowRight className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Thumbnails - Redesigned layout */}
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
                        src={article.image || "https://placehold.co/100x100/333/white?text=News"}
                        alt={article.title}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "https://placehold.co/100x100/333/white?text=News";
                        }}
                      />
                      <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent text overflow */}
                        <span 
                          className="text-xs font-medium px-2 py-1 rounded-full inline-block mb-2"
                          style={{ 
                            backgroundColor: `var(--category-${article.category}-light)`,
                            color: `var(--category-${article.category})`
                          }}
                        >
                          {article.category}
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
