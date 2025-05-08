
import { useState, useRef, useEffect } from "react";
import { Article } from "@/types/api";
import { Card, CardContent } from "./ui/card";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface CategoryNewsCarouselProps {
  category: string;
  news: Article[];
}

export default function CategoryNewsCarousel({ category, news }: CategoryNewsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

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

  useEffect(() => {
    const updateMaxScroll = () => {
      if (scrollRef.current) {
        const scrollWidth = scrollRef.current.scrollWidth;
        const clientWidth = scrollRef.current.clientWidth;
        setMaxScroll(Math.max(0, scrollWidth - clientWidth));
        console.log(`Carousel ${categoryName}: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}, maxScroll=${scrollWidth - clientWidth}`);
      }
    };

    // Update on mount, resize, and when news content changes
    updateMaxScroll();
    
    window.addEventListener('resize', updateMaxScroll);
    
    // Create a ResizeObserver to detect content size changes
    const resizeObserver = new ResizeObserver(() => {
      updateMaxScroll();
    });
    
    if (scrollRef.current) {
      resizeObserver.observe(scrollRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', updateMaxScroll);
      resizeObserver.disconnect();
    };
  }, [news, categoryName]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newPosition = (e.target as HTMLDivElement).scrollLeft;
    setScrollPosition(newPosition);
    console.log(`Carousel ${categoryName} scrolled to: ${newPosition}/${maxScroll}`);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 300; // Pixels to scroll
    const currentPosition = scrollRef.current.scrollLeft;
    
    const newPosition = direction === "left" 
      ? Math.max(0, currentPosition - scrollAmount)
      : Math.min(maxScroll, currentPosition + scrollAmount);
    
    console.log(`Scrolling carousel ${categoryName} ${direction}: from ${currentPosition} to ${newPosition}`);
    
    scrollRef.current.scrollTo({
      left: newPosition,
      behavior: "smooth"
    });
  };

  // Even if no news items, still render the section with a placeholder message
  const hasNews = news && news.length > 0;

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
            disabled={scrollPosition <= 0 || !hasNews}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Anterior</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => scroll("right")}
            disabled={scrollPosition >= maxScroll || !hasNews}
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
        {hasNews ? (
          <div 
            ref={scrollRef}
            className="flex space-x-4 pb-4 pl-1 pr-10 overflow-x-auto scrollbar-hide"
            onScroll={handleScroll}
          >
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
                      src={article.featured_image || `https://placehold.co/600x400/333/white?text=${encodeURIComponent(categoryName)}`}
                      alt={article.title || ""}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://placehold.co/600x400/333/white?text=${encodeURIComponent(categoryName)}`;
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
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Não existem notícias para esta categoria no momento.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              style={{ color: categoryColor, borderColor: categoryColor }}
              asChild
            >
              <Link to={`/category/${categorySlug}`}>
                Ver todas as notícias de {categoryName}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
