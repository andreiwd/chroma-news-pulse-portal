
import { NewsArticle } from "@/data/newsData";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface NewsCardProps {
  news: NewsArticle;
  variant?: "default" | "compact";
}

export default function NewsCard({ news, variant = "default" }: NewsCardProps) {
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
