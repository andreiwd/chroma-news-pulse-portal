
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/types/api";

interface CategoryHeaderProps {
  isLoading: boolean;
  categoryName: string;
  categoryColor: string;
}

export default function CategoryHeader({ isLoading, categoryName, categoryColor }: CategoryHeaderProps) {
  return (
    <div className="mb-8 pb-4 border-b">
      <h1 
        className="text-3xl font-bold mb-2"
        style={{ color: categoryColor }}
      >
        {isLoading ? (
          <Skeleton className="h-10 w-48" />
        ) : (
          categoryName
        )}
      </h1>
    </div>
  );
}
