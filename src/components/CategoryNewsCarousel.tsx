
import { useState } from "react";
import { NewsArticle } from "@/data/newsData";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface CategoryNewsCarouselProps {
  category: string;
  news: NewsArticle[];
}

export default function CategoryNewsCarousel({ category, news }: CategoryNewsCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Get category color based on category name
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tech": return "tech";
      case "sports": return "sports";
      case "politics": return "politics";
      case "economy": return "economy";
      case "entertainment": return "entertainment";
      case "science": return "science";
      case "health": return "health";
      case "environment": return "environment";
      default: return "tech";
    }
  };

  const color = getCategoryColor(category);
  const categoryDisplay = category.charAt(0).toUpperCase() + category.slice(1);

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`scroll-${category}`);
    if (!container) return;

    const scrollAmount = 300;
    const newPosition = direction === "left" 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
    
    container.scrollTo({
      left: newPosition,
      behavior: "smooth"
    });
    
    setScrollPosition(newPosition);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 
          className="text-xl font-bold"
          style={{ color: `var(--category-${color})` }}
        >
          {categoryDisplay}
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Anterior</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próximo</span>
          </Button>
          <Button 
            variant="link"
            className="text-sm"
            style={{ color: `var(--category-${color})` }}
            asChild
          >
            <a href={`/category/${category}`}>Ver mais</a>
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <ScrollArea 
          className="w-full" 
          id={`scroll-${category}`}
          onScroll={(e) => setScrollPosition((e.target as HTMLDivElement).scrollLeft)}
        >
          <div className="flex space-x-4 pb-4 pl-1 pr-10">
            {news.map((item) => (
              <Card 
                key={item.id} 
                className="flex-shrink-0 w-[280px] overflow-hidden hover:shadow-lg transition-shadow" 
                style={{ borderTop: `3px solid var(--category-${color})` }}
              >
                <div className="relative h-32">
                  <img
                    src={item.image || `https://placehold.co/600x400/${color === 'tech' ? '6366f1' : color === 'sports' ? '22c55e' : color === 'politics' ? 'ef4444' : color === 'economy' ? 'f59e0b' : color === 'entertainment' ? 'ec4899' : color === 'science' ? '8b5cf6' : color === 'health' ? '06b6d4' : '10b981'}/white?text=${category}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://placehold.co/600x400/${color === 'tech' ? '6366f1' : color === 'sports' ? '22c55e' : color === 'politics' ? 'ef4444' : color === 'economy' ? 'f59e0b' : color === 'entertainment' ? 'ec4899' : color === 'science' ? '8b5cf6' : color === 'health' ? '06b6d4' : '10b981'}/white?text=${category}`;
                    }}
                  />
                  {item.isBreaking && (
                    <Badge 
                      variant="destructive" 
                      className="absolute top-2 left-2 animate-pulse"
                    >
                      Última hora
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 
                    className="font-bold mb-2 line-clamp-2"
                    style={{ color: `var(--category-${color})` }}
                  >
                    <a href={`/news/${item.id}`} className="hover:underline">
                      {item.title}
                    </a>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.excerpt}
                  </p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto"
                    style={{ color: `var(--category-${color})` }}
                    asChild
                  >
                    <a href={`/news/${item.id}`}>
                      Leia mais <ArrowRight className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
