
import React from "react";
import { Button } from "@/components/ui/button";

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CategoryPagination({ 
  currentPage, 
  totalPages,
  onPageChange 
}: CategoryPaginationProps) {
  if (totalPages <= 1) return null;
  
  const getPageNumbers = () => {
    let pagesToShow = [];
    if (totalPages <= 5) {
      pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 3) {
      pagesToShow = [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      pagesToShow = Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    } else {
      pagesToShow = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    }
    return pagesToShow;
  };

  return (
    <div className="flex justify-center mt-10 gap-2">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </Button>
      
      {getPageNumbers().map(page => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      
      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Próximo
      </Button>
    </div>
  );
}
