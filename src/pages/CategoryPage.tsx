
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import NewsTicker from "@/components/NewsTicker";
import Breadcrumbs from "@/components/Breadcrumbs";
import newsData from "@/data/newsData";
import NewsCard from "@/components/NewsCard";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CategoryPage() {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  const filteredNews = useMemo(() => {
    if (!category) return [];
    
    const filtered = newsData.filter(
      news => news.category.toLowerCase() === category.toLowerCase()
    );
    
    return filtered.sort((a, b) => {
      if (sortBy === "recent" && a.publishedAt && b.publishedAt) {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      } else if (sortBy === "popular") {
        return (b.views || 0) - (a.views || 0);
      }
      return 0;
    });
    
  }, [category, sortBy]);
  
  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNews, currentPage]);
  
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <NewsTicker />
        <Header />
        <Navigation />
        <main className="container py-10 text-center">
          <h1 className="text-2xl font-bold">Categoria não encontrada</h1>
        </main>
      </div>
    );
  }

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="min-h-screen flex flex-col">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="container py-6">
        <Breadcrumbs 
          items={[
            { label: categoryTitle }
          ]}
        />
        
        <header className="mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: `var(--category-${category})` }}
          >
            {categoryTitle}
          </h1>
          <p className="text-muted-foreground">
            {filteredNews.length} artigos nesta categoria
          </p>
        </header>
        
        <div className="flex justify-end mb-6">
          <Select 
            defaultValue="recent"
            onValueChange={(value) => setSortBy(value as "recent" | "popular")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Mais recentes</SelectItem>
              <SelectItem value="popular">Mais populares</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
        
        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                
                // Show first page, current page, last page and one page before and after current
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  pageNumber === currentPage ||
                  pageNumber === currentPage - 1 ||
                  pageNumber === currentPage + 1
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={currentPage === pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                // Show ellipsis for gaps
                if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return <PaginationEllipsis key={`ellipsis-${pageNumber}`} />;
                }
                
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </div>
  );
}
