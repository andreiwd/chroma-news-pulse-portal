
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import NewsTicker from "@/components/NewsTicker";
import Footer from "@/components/Footer";
import { Category, Article } from "@/types/api"; // Certifique-se de ter a interface Article definida
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
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    if (!categorySlug) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Configuração do cliente Axios com timeout e headers adequados
        const apiClient = axios.create({
          baseURL: 'https://taquaritinganoticias.criarsite.online/api',
          timeout: 15000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        // Buscar detalhes da categoria primeiro para confirmar que ela existe
        const categoriesResponse = await apiClient.get('/categories');
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
        
        // Agora buscar as notícias desta categoria conforme documentação da API
        let newsResponse;
        try {
          // Primeiro tenta o endpoint específico para categoria
          console.log(`Tentando endpoint específico: /categories/${categorySlug}/news?page=${currentPage}`);
          newsResponse = await apiClient.get(`/categories/${categorySlug}/news?page=${currentPage}`);
        } catch (categoryApiError) {
          console.warn("Endpoint específico de categoria falhou, tentando fallback", categoryApiError);
          
          // Fallback para o endpoint geral com filtro de categoria
          console.log(`Tentando fallback: /news?category=${categorySlug}&page=${currentPage}`);
          newsResponse = await apiClient.get(`/news?category=${categorySlug}&page=${currentPage}`);
        }
        
        console.log('Resposta da API:', newsResponse.data);
        
        // Processar dados garantindo compatibilidade com ambos os formatos possíveis
        if (newsResponse.data) {
          if (Array.isArray(newsResponse.data)) {
            // Resposta direta como array
            setArticles(newsResponse.data);
            setTotalPages(1);
          } else if (typeof newsResponse.data === 'object') {
            if (Array.isArray(newsResponse.data.data)) {
              // Resposta paginada conforme documentação
              setArticles(newsResponse.data.data);
              setTotalPages(newsResponse.data.last_page || 1);
            } else {
              // Caso ainda não tenha encontrado dados, verificar outros formatos possíveis
              const possibleDataKeys = Object.keys(newsResponse.data).find(key => 
                Array.isArray(newsResponse.data[key])
              );
              
              if (possibleDataKeys) {
                setArticles(newsResponse.data[possibleDataKeys]);
                // Verificar se existem infos de paginação
                setTotalPages(newsResponse.data.last_page || newsResponse.data.meta?.last_page || 1);
              } else {
                throw new Error("Formato de resposta não reconhecido");
              }
            }
          } else {
            throw new Error("Formato de resposta inválido");
          }
        } else {
          throw new Error("Resposta da API vazia");
        }
      } catch (error: any) {
        console.error("Erro ao buscar dados:", error);
        setError(error.message || "Não foi possível carregar notícias desta categoria.");
        setArticles([]);
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
