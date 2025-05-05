
import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import NewsTicker from "@/components/NewsTicker";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import NewsCard from "@/components/NewsCard";
import { Article, Category } from "@/types/api";

export default function CategoryPage() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryDetails, setCategoryDetails] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    if (!categorySlug) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Tentativa direta para buscar notícias da categoria
        console.log(`Buscando notícias para categoria: ${categorySlug}`);
        const response = await axios.get(`https://taquaritinganoticias.criarsite.online/api/categories/${categorySlug}/news?page=${currentPage}`);
        console.log('Resposta da API:', response.data);
        
        // Processar dados de acordo com o formato da resposta
        if (Array.isArray(response.data)) {
          setArticles(response.data);
          setTotalPages(1);
        } else if (response.data && typeof response.data === 'object') {
          if (Array.isArray(response.data.data)) {
            setArticles(response.data.data);
            setTotalPages(response.data.last_page || 1);
          }
        }
        
        // Buscar detalhes da categoria separadamente (não bloqueia o carregamento de notícias)
        try {
          const categoriesResponse = await axios.get('https://taquaritinganoticias.criarsite.online/api/categories');
          let categories = [];
          
          if (Array.isArray(categoriesResponse.data)) {
            categories = categoriesResponse.data;
          } else if (categoriesResponse.data && typeof categoriesResponse.data === 'object' && Array.isArray(categoriesResponse.data.data)) {
            categories = categoriesResponse.data.data;
          }
          
          const category = categories.find((cat: any) => cat.slug === categorySlug);
          if (category) {
            setCategoryDetails({
              id: Number(category.id) || 0,
              name: String(category.name || ""),
              slug: String(category.slug || ""),
              description: String(category.description || ""),
              color: String(category.color || "#333333"),
              text_color: String(category.text_color || "#FFFFFF"),
              active: Boolean(category.active),
              order: Number(category.order) || 0
            });
          }
        } catch (categoryError) {
          console.error("Erro ao buscar detalhes da categoria:", categoryError);
          // Não definimos erro aqui pois as notícias já foram carregadas
        }
      } catch (newsError) {
        console.error("Erro ao buscar notícias da categoria:", newsError);
        
        // Tentar o fallback para a API regular de notícias
        try {
          console.log(`Tentando fallback com filtro de categoria: ${categorySlug}`);
          const fallbackResponse = await axios.get(`https://taquaritinganoticias.criarsite.online/api/news?category=${categorySlug}&page=${currentPage}`);
          console.log('Resposta do fallback:', fallbackResponse.data);
          
          if (fallbackResponse.data && typeof fallbackResponse.data === 'object') {
            if (Array.isArray(fallbackResponse.data.data)) {
              setArticles(fallbackResponse.data.data);
              setTotalPages(fallbackResponse.data.last_page || 1);
            } else if (Array.isArray(fallbackResponse.data)) {
              setArticles(fallbackResponse.data);
              setTotalPages(1);
            }
          }
        } catch (fallbackError) {
          console.error("Ambos os métodos de busca falharam:", fallbackError);
          setError("Não foi possível carregar notícias desta categoria.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [categorySlug, currentPage]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // Category name and color fallbacks
  const categoryName = categoryDetails?.name || 
    (categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' ') : "Categoria");
  
  const categoryColor = categoryDetails?.color || "#333333";
  
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
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-100 p-4 mb-4 rounded-md">
            <p><strong>Slug:</strong> {categorySlug}</p>
            <p><strong>Artigos carregados:</strong> {articles.length}</p>
            <p><strong>Total páginas:</strong> {totalPages}</p>
            <p><strong>Página atual:</strong> {currentPage}</p>
          </div>
        )}
        
        {/* News Grid - simplificado */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-xl">Ocorreu um erro ao carregar esta categoria.</p>
            <p className="text-sm text-gray-500 mt-2">{error}</p>
            <Button className="mt-4" asChild>
              <Link to="/">Voltar para a página inicial</Link>
            </Button>
          </div>
        ) : articles && articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
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
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Show first page, last page, current page, and pages around current
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
                  
                  return pagesToShow.map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ));
                })}
                
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
