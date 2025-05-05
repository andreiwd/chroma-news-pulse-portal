
import React from "react";

interface CategoryDebugInfoProps {
  categorySlug: string;
  articlesCount: number;
  totalPages: number;
  currentPage: number;
}

export default function CategoryDebugInfo({ 
  categorySlug, 
  articlesCount, 
  totalPages, 
  currentPage 
}: CategoryDebugInfoProps) {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="bg-yellow-100 p-4 mb-4 rounded-md">
      <p><strong>Slug:</strong> {categorySlug}</p>
      <p><strong>Artigos carregados:</strong> {articlesCount}</p>
      <p><strong>Total páginas:</strong> {totalPages}</p>
      <p><strong>Página atual:</strong> {currentPage}</p>
    </div>
  );
}
