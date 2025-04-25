
import { NewsArticle } from "@/data/newsData";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface NewsCardProps {
  news: NewsArticle;
  variant?: "default" | "compact" | "horizontal" | "minimal";
}

export default function NewsCard({ news, variant = "default" }: NewsCardProps) {
  if (variant === "horizontal") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-row h-40">
        <div className="relative w-1/3">
          <img
            src={news.image || `https://placehold.co/600x400/${news.category === 'tech' ? '6366f1' : news.category === 'sports' ? '22c55e' : news.category === 'politics' ? 'ef4444' : news.category === 'economy' ? 'f59e0b' : news.category === 'entertainment' ? 'ec4899' : news.category === 'science' ? '8b5cf6' : news.category === 'health' ? '06b6d4' : '10b981'}/white?text=${news.category}`}
            alt={news.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://placehold.co/600x400/${news.category === 'tech' ? '6366f1' : news.category === 'sports' ? '22c55e' : news.category === 'politics' ? 'ef4444' : news.category === 'economy' ? 'f59e0b' : news.category === 'entertainment' ? 'ec4899' : news.category === 'science' ? '8b5cf6' : news.category === 'health' ? '06b6d4' : '10b981'}/white?text=${news.category}`;
            }}
          />
          {news.isBreaking && (
            <Badge 
              variant="destructive" 
              className="absolute top-2 left-2 animate-pulse"
            >
              Última hora
            </Badge>
          )}
        </div>
        <div className="w-2/3 flex flex-col">
          <CardHeader className="p-3">
            <div className="mb-1">
              <span 
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: `var(--category-${news.category}-light, #f3f4f6)`,
                  color: `var(--category-${news.category}, currentColor)`
                }}
              >
                {news.category}
              </span>
            </div>
            <CardTitle 
              className="text-lg font-bold line-clamp-2"
              style={{ color: `var(--category-${news.category})` }}
            >
              {news.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 flex-grow flex flex-col justify-between">
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {news.excerpt}
            </p>
            <div className="flex justify-between items-center mt-auto">
              <div className="text-xs text-muted-foreground">
                {news.publishedAt && new Date(news.publishedAt).toLocaleDateString('pt-BR')}
              </div>
              <Button variant="ghost" size="sm" className="text-primary p-0 h-auto" asChild>
                <a href={`/news/${news.id}`}>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  if (variant === "minimal") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: `var(--category-${news.category})` }}>
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="text-xs font-medium px-1 py-0.5 rounded-full"
              style={{ 
                backgroundColor: `var(--category-${news.category}-light, #f3f4f6)`,
                color: `var(--category-${news.category}, currentColor)`
              }}
            >
              {news.category}
            </span>
            <span className="text-xs text-muted-foreground">
              {news.publishedAt && new Date(news.publishedAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <a href={`/news/${news.id}`} className="font-medium line-clamp-2 hover:underline" style={{ color: `var(--category-${news.category})` }}>
            {news.title}
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={news.image || `https://placehold.co/600x400/${news.category === 'tech' ? '6366f1' : news.category === 'sports' ? '22c55e' : news.category === 'politics' ? 'ef4444' : news.category === 'economy' ? 'f59e0b' : news.category === 'entertainment' ? 'ec4899' : news.category === 'science' ? '8b5cf6' : news.category === 'health' ? '06b6d4' : '10b981'}/white?text=${news.category}`}
          alt={news.title}
          className={`w-full object-cover ${variant === "compact" ? "h-32" : "h-48"}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `https://placehold.co/600x400/${news.category === 'tech' ? '6366f1' : news.category === 'sports' ? '22c55e' : news.category === 'politics' ? 'ef4444' : news.category === 'economy' ? 'f59e0b' : news.category === 'entertainment' ? 'ec4899' : news.category === 'science' ? '8b5cf6' : news.category === 'health' ? '06b6d4' : '10b981'}/white?text=${news.category}`;
          }}
        />
        {news.isBreaking && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 left-2 animate-pulse"
          >
            Última hora
          </Badge>
        )}
      </div>
      <CardHeader className={variant === "compact" ? "p-4" : "p-6"}>
        <div className="mb-2">
          <span 
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{ 
              backgroundColor: `var(--category-${news.category}-light, #f3f4f6)`,
              color: `var(--category-${news.category}, currentColor)`
            }}
          >
            {news.category}
          </span>
        </div>
        <CardTitle 
          className={`${variant === "compact" ? "text-lg" : "text-xl"} font-bold line-clamp-2`}
          style={{ color: `var(--category-${news.category})` }}
        >
          {news.title}
        </CardTitle>
      </CardHeader>
      <CardContent className={variant === "compact" ? "p-4 pt-0" : "p-6 pt-0"}>
        <p className={`text-muted-foreground mb-4 ${variant === "compact" ? "text-sm line-clamp-2" : "line-clamp-3"}`}>
          {news.excerpt}
        </p>
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {news.author && `Por ${news.author}`}
            {news.publishedAt && news.author && " • "}
            {news.publishedAt && new Date(news.publishedAt).toLocaleDateString('pt-BR')}
          </div>
          <Button variant="ghost" size="sm" className="text-primary" asChild>
            <a href={`/news/${news.id}`}>
              Leia mais <ArrowRight className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
