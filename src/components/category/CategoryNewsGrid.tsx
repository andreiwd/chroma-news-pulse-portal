
import React from "react";
import { Article } from "@/types/api";
import NewsCard from "@/components/NewsCard";

interface CategoryNewsGridProps {
  articles: Article[];
}

export default function CategoryNewsGrid({ articles }: CategoryNewsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <div key={`article-${index}-${article.id || 'unknown'}`}>
          <NewsCard news={article} variant="compact" />
        </div>
      ))}
    </div>
  );
}
