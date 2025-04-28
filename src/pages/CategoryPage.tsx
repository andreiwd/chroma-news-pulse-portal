
import { useParams, Link } from "react-router-dom";
import { useCategoryNews } from "@/hooks/useNews";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import NewsTicker from "@/components/NewsTicker";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Article } from "@/types/api";

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  
  const {
    data: newsData,
    isLoading,
    error,
    isFetching,
  } = useCategoryNews(category || "", currentPage);

  // Extract news articles and pagination data
  const news = newsData?.data || [];
  const totalPages = newsData?.last_page || 1;

  // Get category details from the first news item for styling
  const categoryDetails = news[0]?.category;
  const categoryName = categoryDetails?.name || (category ? category.charAt(0).toUpperCase() + category?.slice(1) : "");
  const categoryColor = categoryDetails?.color || "#333";
  const categoryDescription = categoryDetails?.description || "";

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <NewsTicker />
        <Header />
        <Navigation />
        <main className="container py-10 text-center">
          <h1 className="text-2xl font-bold">Categoria não encontrada</h1>
          <p className="mt-4">A categoria que você está procurando não existe.</p>
          <Button className="mt-6" asChild>
            <Link to="/">Voltar para a página inicial</Link>
          </Button>
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
        ) : news.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article: Article, index) => (
                <div key={article.id}>
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isFetching}
                  >
                    Anterior
                  </Button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show limited page numbers to avoid cluttering
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          onClick={() => handlePageChange(pageNumber)}
                          disabled={isFetching}
                          style={
                            currentPage === pageNumber
                              ? { backgroundColor: categoryColor }
                              : {}
                          }
                        >
                          {pageNumber}
                        </Button>
                      );
                    } else if (
                      (pageNumber === currentPage - 2 && currentPage > 3) ||
                      (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return <span key={pageNumber} className="flex items-center">...</span>;
                    }
                    return null;
                  })}
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isFetching}
                  >
                    Próximo
                  </Button>
                </div>
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
