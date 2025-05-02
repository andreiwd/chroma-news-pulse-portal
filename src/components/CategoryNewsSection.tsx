import { useState } from "react";
import { Article } from "@/types/api";
import { Card, CardContent } from "./ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface CategoryNewsSectionProps {
  category: string;
  news: Article[];
}

export default function CategoryNewsSection({ category, news }: CategoryNewsSectionProps) {
  // Get category details from the first news item, with safety checks
  const categoryData = news?.[0]?.category;
  const categorySlug = categoryData && typeof categoryData === 'object' ? String(categoryData.slug || category) : category;
  const categoryName = categoryData && typeof categoryData === 'object'
    ? String(categoryData.name || (category.charAt(0).toUpperCase() + category.slice(1)))
    : (category.charAt(0).toUpperCase() + category.slice(1));
  const categoryColor = categoryData && typeof categoryData === 'object' ? String(categoryData.color || '#333') : '#333';

  // If no news items, don't render anything
  if (!news || news.length === 0) {
    return null;
  }

  // Always show the first article as featured
  const featuredArticle = news[0];
  const otherArticles = news.slice(1, 5);

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6 pb-2 border-b">
        <h2 
          className="text-xl font-bold"
          style={{ color: categoryColor }}
        >
          {categoryName}
        </h2>
        <Link 
          to={`/category/${categorySlug}`}
          className="text-sm hover:underline"
          style={{ color: categoryColor }}
        >
          Ver mais <ArrowRight className="inline h-3 w-3 ml-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Featured Article */}
        <div className="md:col-span-2">
          <Card className="overflow-hidden hover:shadow-md transition-shadow border-0">
            <Link to={`/news/${featuredArticle.slug}`}>
              <div className="aspect-video w-full">
                <img
                  src={featuredArticle.featured_image || `https://placehold.co/800x450/333/white?text=${categoryName}`}
                  alt={featuredArticle.title || "Article"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://placehold.co/800x450/333/white?text=${categoryName}`;
                  }}
                />
              </div>
            </Link>
            <CardContent className="p-4">
              <Link 
                to={`/news/${featuredArticle.slug}`}
                className="font-bold text-lg mb-2 block hover:underline line-clamp-2"
                style={{ color: categoryColor }}
              >
                {featuredArticle.title || 'Notícia sem título'}
              </Link>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                {featuredArticle.excerpt || 'Sem descrição disponível'}
              </p>
              <div className="text-xs text-muted-foreground">
                {featuredArticle.published_at && new Date(featuredArticle.published_at).toLocaleDateString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* List of Articles */}
        <div className="space-y-4">
          {otherArticles.map((article, index) => {
            if (!article) return null;
            return (
              <div key={article.id || `${category}-article-${index}`} className="border-b border-gray-100 pb-4 last:border-0">
                <Link 
                  to={`/news/${article.slug}`}
                  className="font-medium hover:underline line-clamp-2 mb-1 block"
                  style={{ color: categoryColor }}
                >
                  {article.title || 'Notícia sem título'}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {article.published_at && new Date(article.published_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
