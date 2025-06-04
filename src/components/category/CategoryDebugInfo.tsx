
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
  // Componente removido para produção
  return null;
}
