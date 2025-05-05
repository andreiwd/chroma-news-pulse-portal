
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import NewsTicker from "@/components/NewsTicker";
import Footer from "@/components/Footer";
import { Category } from "@/types/api";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryLoadingState from "@/components/category/CategoryLoadingState";
import CategoryErrorState from "@/components/category/CategoryErrorState";
import CategoryEmptyState from "@/components/category/CategoryEmptyState";
import CategoryPagination from "@/components/category/CategoryPagination";
import CategoryNewsGrid from "@/components/category/CategoryNewsGrid";
import CategoryDebugInfo from "@/components/category/CategoryDebugInfo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryDetails, setCategoryDetails] = useState<Category | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
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
        <CategoryHeader 
          isLoading={isLoading} 
          categoryName={categoryName} 
          categoryColor={categoryColor} 
        />
        
        {/* Debug info */}
        <CategoryDebugInfo 
          categorySlug={categorySlug}
          articlesCount={articles.length}
          totalPages={totalPages}
          currentPage={currentPage}
        />
        
        {/* Content states */}
        {isLoading ? (
          <CategoryLoadingState />
        ) : error ? (
          <CategoryErrorState error={error} />
        ) : articles && articles.length > 0 ? (
          <>
            <CategoryNewsGrid articles={articles} />
            
            {/* Pagination */}
            <CategoryPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <CategoryEmptyState />
        )}
      </main>

      <Footer />
    </div>
  );
}
