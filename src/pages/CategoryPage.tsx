
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useCategoryNews, useCategories } from "@/hooks/useNews";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import NewsTicker from "@/components/NewsTicker";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Article } from "@/types/api";
import { toast } from "@/components/ui/use-toast";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

export default function CategoryPage() {
  const navigate = useNavigate();
  const { category: categorySlug } = useParams<{ category: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  
  // Fetch all categories to get color and other metadata
  const { data: categoriesData } = useCategories();
  
  const {
    data: newsData,
    isLoading,
    error,
    isFetching,
    refetch,
    isError
  } = useCategoryNews(categorySlug, currentPage);

  // Log current state to help debug
  console.log("CategoryPage render:", { 
    category: categorySlug, 
    currentPage, 
    newsData, 
    isLoading,
    error,
    categoriesData
  });

  // Refetch when category changes
  useEffect(() => {
    if (categorySlug) {
      console.log("Category changed, refetching:", categorySlug);
      setCurrentPage(1);
      refetch();
    }
  }, [categorySlug, refetch]);

  // Extract news articles and pagination data
  const news = newsData?.data || [];
  const totalPages = newsData?.last_page || 1;

  // Find category details from categories list
  const categoryDetails = categoriesData?.find(
    cat => cat.slug === categorySlug
  ) || null;

  // Get category name, color, description
  const categoryName = categoryDetails?.name || 
    (categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : "Categoria");
  
  const categoryColor = categoryDetails?.color || "#333";
  
  const categoryDescription = categoryDetails?.description || "";

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Display a notification when loading fails
  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notícias desta categoria.",
        variant: "destructive",
      });
    }
  }, [isError, error]);
  
  // Protect against missing category slug
  if (!categorySlug) {
    return (
      <div className="min-h-screen flex flex-col">
        <NewsTicker />
        <Header />
        <Navigation />
        
        <main className="container py-6 flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Categoria não encontrada</h1>
            <Button className="mt-4" asChild>
              <Link to="/">Voltar para a página inicial</Link>
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="container py-6">
        {/* Category Header */}
        <div 
          className="mb-8 pb-4 border-b"
          style={{ borderColor: `${categoryColor}40` }}
        >
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
          
          {categoryDescription && (
            <p className="text-muted-foreground">
              {categoryDescription}
            </p>
          )}
        </div>

        {/* Ad banner at top */}
        <AdPlaceholder 
          size="banner"
          id="ad-category-top"
          className="mb-8"
        />
        
        {/* News Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10">
            <p className="text-xl">Ocorreu um erro ao carregar esta categoria.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Detalhes: {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
            <Button className="mt-4" asChild>
              <Link to="/">Voltar para a página inicial</Link>
            </Button>
          </div>
        ) : news && news.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article: Article, index) => (
                <div key={article.id || `article-${index}`}>
                  {/* Insert ad after every 6 articles */}
                  {index > 0 && index % 6 === 0 && (
                    <AdPlaceholder 
                      size="rectangle"
                      id={`ad-category-inline-${Math.floor(index/6)}`}
                      className="mb-6"
                    />
                  )}
                  <NewsCard 
                    news={article} 
                    variant="compact" 
                  />
                </div>
              ))}
            </div>
            
            {/* Ad banner before pagination */}
            <AdPlaceholder 
              size="banner"
              id="ad-category-bottom"
              className="my-8"
            />
            
            {/* Pagination using shadcn UI components */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <Pagination>
                  <PaginationContent>
                    {/* Previous button */}
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 || isFetching ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {/* Generate page numbers */}
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      
                      // Show first page, last page, and pages around current page
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              isActive={currentPage === pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={isFetching ? "pointer-events-none" : ""}
                              style={
                                currentPage === pageNumber
                                  ? { backgroundColor: categoryColor, borderColor: categoryColor }
                                  : {}
                              }
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        (pageNumber === currentPage - 2 && currentPage > 3) ||
                        (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                      ) {
                        return <PaginationItem key={pageNumber}><PaginationEllipsis /></PaginationItem>;
                      }
                      return null;
                    })}
                    
                    {/* Next button */}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages || isFetching ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl">Nenhuma notícia encontrada nesta categoria.</p>
            <Button className="mt-4" asChild>
              <Link to="/">Voltar para a página inicial</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
