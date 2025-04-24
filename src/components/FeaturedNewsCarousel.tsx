
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { NewsArticle } from "@/data/newsData";
import { Badge } from "./ui/badge";
import { ArrowRight } from "lucide-react";

interface FeaturedNewsCarouselProps {
  highlightedNews: NewsArticle[];
}

export default function FeaturedNewsCarousel({ highlightedNews }: FeaturedNewsCarouselProps) {
  return (
    <div className="py-6">
      <Carousel className="w-full">
        <CarouselContent>
          {highlightedNews.map((article) => (
            <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <div className="relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    {article.isBreaking && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-2 left-2 animate-pulse"
                      >
                        Última hora
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <span 
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `var(--category-${article.category}-light, #f3f4f6)`,
                          color: `var(--category-${article.category}, currentColor)`
                        }}
                      >
                        {article.category}
                      </span>
                    </div>
                    <h3 
                      className="font-bold text-lg mb-2 line-clamp-2"
                      style={{ color: `var(--category-${article.category})` }}
                    >
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        {article.author && `Por ${article.author}`}
                        {article.publishedAt && article.author && " • "}
                        {article.publishedAt && new Date(article.publishedAt).toLocaleDateString('pt-BR')}
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary" asChild>
                        <a href={`/news/${article.id}`}>
                          Leia mais <ArrowRight className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </div>
      </Carousel>
    </div>
  );
}
