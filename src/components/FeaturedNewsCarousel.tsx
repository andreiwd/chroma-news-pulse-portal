
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { NewsArticle } from "@/data/newsData";
import { Badge } from "./ui/badge";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface FeaturedNewsCarouselProps {
  highlightedNews: NewsArticle[];
}

export default function FeaturedNewsCarousel({ highlightedNews }: FeaturedNewsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => 
        current === highlightedNews.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [highlightedNews.length, isAutoplay]);

  return (
    <div className="w-full">
      <div className="mb-6 relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-2xl">
        {/* Main Featured News */}
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Article */}
            <div className="lg:col-span-2 relative">
              <Card className="overflow-hidden border-0 bg-transparent shadow-none">
                <div className="relative aspect-[16/9]">
                  <img
                    src={highlightedNews[activeIndex].image || "https://placehold.co/800x450/333/white?text=Featured+News"}
                    alt={highlightedNews[activeIndex].title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://placehold.co/800x450/333/white?text=Featured+News";
                    }}
                  />
                  {highlightedNews[activeIndex].isBreaking && (
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
                      backgroundColor: `var(--category-${highlightedNews[activeIndex].category}-light)`,
                      color: `var(--category-${highlightedNews[activeIndex].category})`
                    }}
                  >
                    {highlightedNews[activeIndex].category}
                  </span>
                  <h2 
                    className="text-2xl md:text-3xl font-bold mb-4 text-white"
                  >
                    {highlightedNews[activeIndex].title}
                  </h2>
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {highlightedNews[activeIndex].excerpt}
                  </p>
                  <Button variant="secondary" size="sm" className="text-primary" asChild>
                    <a href={`/news/${highlightedNews[activeIndex].id}`}>
                      Leia mais <ArrowRight className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Thumbnails */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {highlightedNews.map((article, index) => (
                  <button
                    key={article.id}
                    onClick={() => {
                      setActiveIndex(index);
                      setIsAutoplay(false);
                    }}
                    className={cn(
                      "w-full text-left transition-all duration-300 hover:bg-white/10 rounded-lg p-2",
                      activeIndex === index ? "bg-white/10" : "opacity-70"
                    )}
                  >
                    <div className="flex gap-3">
                      <img
                        src={article.image || "https://placehold.co/100x100/333/white?text=News"}
                        alt={article.title}
                        className="w-24 h-24 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "https://placehold.co/100x100/333/white?text=News";
                        }}
                      />
                      <div>
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

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => {
                setActiveIndex((current) => 
                  current === 0 ? highlightedNews.length - 1 : current - 1
                );
                setIsAutoplay(false);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => {
                setActiveIndex((current) => 
                  current === highlightedNews.length - 1 ? 0 : current + 1
                );
                setIsAutoplay(false);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Ad Spaces */}
      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Side Ad Space */}
          <div className="hidden lg:block md:col-span-3">
            <div className="bg-muted/30 rounded-lg p-4 h-[600px] flex items-center justify-center border-2 border-dashed border-muted">
              <div className="text-center text-muted-foreground">
                <p className="font-medium">Anúncio</p>
                <p className="text-sm">300 x 600</p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-9">
            {/* Top Banner Ad */}
            <div className="bg-muted/30 rounded-lg p-4 mb-6 h-[90px] flex items-center justify-center border-2 border-dashed border-muted">
              <div className="text-center text-muted-foreground">
                <p className="font-medium">Banner Anúncio</p>
                <p className="text-sm">728 x 90</p>
              </div>
            </div>

            {/* In-feed Ad */}
            <div className="bg-muted/30 rounded-lg p-4 h-[250px] flex items-center justify-center border-2 border-dashed border-muted mt-6">
              <div className="text-center text-muted-foreground">
                <p className="font-medium">Anúncio In-feed</p>
                <p className="text-sm">728 x 250</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
