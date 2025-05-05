
import { useParams, Link } from "react-router-dom";
import { useCategoryNews, useCategories } from "@/hooks/useNews";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import NewsTicker from "@/components/NewsTicker";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import NewsCard from "@/components/NewsCard";
import { Article, Category } from "@/types/api";

export default function CategoryPage() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  
  console.log("CategoryPage rendering with slug:", categorySlug);
  
  // Fetch all categories
  const { data: categories } = useCategories();
  
  // Fetch news for the category
  const {
    data: newsData,
    isLoading,
    error,
    isError
  } = useCategoryNews(categorySlug, currentPage);

  // Log everything to debug
  console.log("Categories:", categories);
  console.log("News data:", newsData);
  console.log("Current page:", currentPage);
  console.log("Is loading:", isLoading);
  console.log("Error:", error);
  
  // Find the current category in the categories list
  const categoryDetails = categories?.find(
    cat => cat && typeof cat === 'object' && cat.slug === categorySlug
  );
  
  console.log("Found category details:", categoryDetails);
  
  // Get category name and color
  const categoryName = categoryDetails?.name || 
    (categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : "Categoria");
  
  const categoryColor = categoryDetails?.color || "#333333";
  
  // Get news articles
  const articles = Array.isArray(newsData?.data) ? newsData.data : [];
  const totalPages = newsData?.last_page || 1;
  
  console.log("Processed articles:", articles);
  console.log("Total pages:", totalPages);

  // Show error toast if needed
  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notícias desta categoria.",
        variant: "destructive",
      });
    }
  }, [isError, error]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // Render empty state if no category slug
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
        
        {/* News Grid - simplified */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10">
            <p className="text-xl">Ocorreu um erro ao carregar esta categoria.</p>
            <Button className="mt-4" asChild>
              <Link to="/">Voltar para a página inicial</Link>
            </Button>
          </div>
        ) : articles && articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: Article, index) => (
                <div key={`article-${index}-${article.id || 'unknown'}`}>
                  <NewsCard news={article} variant="compact" />
                </div>
              ))}
            </div>
            
            {/* Simple pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Anterior
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Próximo
                </Button>
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
