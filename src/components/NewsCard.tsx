
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Article } from "@/types/api";
import { Link } from "react-router-dom";

interface NewsCardProps {
  news: Article;
  variant?: "default" | "compact" | "horizontal" | "minimal";
}

export default function NewsCard({ news, variant = "default" }: NewsCardProps) {
  const categoryColor = news.category?.color || "#333";
  const categoryTextColor = news.category?.text_color || "#fff";
  const categoryName = news.category?.name || "";
  const categorySlug = news.category?.slug || "";

  if (variant === "horizontal") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-row h-40">
        <div className="relative w-1/3">
          <img
            src={news.featured_image || `https://placehold.co/600x400/333/white?text=${categoryName}`}
            alt={news.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://placehold.co/600x400/333/white?text=${categoryName}`;
            }}
          />
        </div>
        <div className="w-2/3 flex flex-col">
          <CardHeader className="p-3">
            <div className="mb-1">
              {news.category && (
                <span 
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${categoryColor}20`,
                    color: categoryColor
                  }}
                >
                  {categoryName}
                </span>
              )}
            </div>
            <CardTitle 
              className="text-lg font-bold line-clamp-2"
              style={{ color: categoryColor }}
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
                {news.published_at && new Date(news.published_at).toLocaleDateString('pt-BR')}
              </div>
              <Button variant="ghost" size="sm" className="text-primary p-0 h-auto" asChild>
                <Link to={`/news/${news.slug}`}>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  if (variant === "minimal") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: categoryColor }}>
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-1">
            {news.category && (
              <span 
                className="text-xs font-medium px-1 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: `${categoryColor}20`,
                  color: categoryColor
                }}
              >
                {categoryName}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {news.published_at && new Date(news.published_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <Link to={`/news/${news.slug}`} className="font-medium line-clamp-2 hover:underline" style={{ color: categoryColor }}>
            {news.title}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={news.featured_image || `https://placehold.co/600x400/333/white?text=${categoryName}`}
          alt={news.title}
          className={`w-full object-cover ${variant === "compact" ? "h-32" : "h-48"}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `https://placehold.co/600x400/333/white?text=${categoryName}`;
          }}
        />
      </div>
      <CardHeader className={variant === "compact" ? "p-4" : "p-6"}>
        <div className="mb-2">
          {news.category && (
            <span 
              className="text-xs font-medium px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: `${categoryColor}20`,
                color: categoryColor
              }}
            >
              {categoryName}
            </span>
          )}
        </div>
        <CardTitle 
          className={`${variant === "compact" ? "text-lg" : "text-xl"} font-bold line-clamp-2`}
          style={{ color: categoryColor }}
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
            {news.published_at && new Date(news.published_at).toLocaleDateString('pt-BR')}
          </div>
          <Button variant="ghost" size="sm" className="text-primary" asChild>
            <Link to={`/news/${news.slug}`}>
              Leia mais <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
