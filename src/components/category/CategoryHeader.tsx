
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryHeaderProps {
  isLoading: boolean;
  categoryName: string;
  categoryColor: string;
}

export default function CategoryHeader({ isLoading, categoryName, categoryColor }: CategoryHeaderProps) {
  // Ensure we're working with strings
  const name = String(categoryName || "");
  const color = String(categoryColor || "#333");
  
  return (
    <div className="mb-8 pb-4 border-b">
      <h1 
        className="text-3xl font-bold mb-2"
        style={{ color: color }}
      >
        {isLoading ? (
          <Skeleton className="h-10 w-48" />
        ) : (
          name
        )}
      </h1>
    </div>
  );
}
