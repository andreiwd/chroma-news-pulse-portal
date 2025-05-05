
import { useState } from "react";
import { Article } from "@/types/api";
import { Card, CardContent } from "./ui/card";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Link } from "react-router-dom";

interface CategoryNewsCarouselProps {
  category: string;
  news: Article[];
}

export default function CategoryNewsCarousel({ category, news }: CategoryNewsCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Get category details from the first news item, with safety checks
  let categorySlug = category;
  let categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  let categoryColor = '#333';
  
  if (news && news.length > 0 && news[0]?.category) {
    const categoryData = news[0].category;
    if (typeof categoryData === 'object') {
      categorySlug = typeof categoryData.slug === 'string' ? categoryData.slug : category;
      categoryName = typeof categoryData.name === 'string' ? categoryData.name : categoryName;
      categoryColor = typeof categoryData.color === 'string' ? categoryData.color : '#333';
    }
  }

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

  // If no news items, don't render anything
  if (!news || news.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 
          className="text-xl font-bold"
          style={{ color: categoryColor }}
        >
          {categoryName}
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
            style={{ color: categoryColor }}
            asChild
          >
            <Link to={`/category/${categorySlug}`}>Ver mais</Link>
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
            {news.map((article) => {
              if (!article) return null;
              
              return (
                <Card 
                  key={article.id} 
                  className="flex-shrink-0 w-[280px] overflow-hidden hover:shadow-lg transition-shadow" 
                  style={{ borderTop: `3px solid ${categoryColor}` }}
                >
                  <div className="relative h-32">
                    <img
                      src={article.featured_image || `https://placehold.co/600x400/333/white?text=${categoryName}`}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://placehold.co/600x400/333/white?text=${categoryName}`;
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 
                      className="font-bold mb-2 line-clamp-2"
                      style={{ color: categoryColor }}
                    >
                      <Link to={`/news/${article.slug}`} className="hover:underline">
                        {article.title || 'Notícia sem título'}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {article.excerpt || 'Sem descrição disponível'}
                    </p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto"
                      style={{ color: categoryColor }}
                      asChild
                    >
                      <Link to={`/news/${article.slug}`}>
                        Leia mais <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
