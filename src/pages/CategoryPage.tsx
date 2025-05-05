import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import NewsTicker from "@/components/NewsTicker";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Definição simplificada dos tipos
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  text_color: string;
  active: boolean;
  order: number;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: Category;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export default function CategoryPage() {
  const navigate = useNavigate();
  const { category: categorySlug } = useParams<{ category: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryDetails, setCategoryDetails] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  
  // Primeiro, busca todas as categorias disponíveis
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Buscando categorias...");
        
        const response = await axios.get('https://taquaritinganoticias.criarsite.online/api/categories');
        console.log("Resposta da API de categorias:", response.data);
        
        // Processar categorias
        let categories = [];
        if (Array.isArray(response.data)) {
          categories = response.data;
        } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
          categories = response.data.data;
        }
        
        // Salvar todas as categorias disponíveis
        setAllCategories(categories);
        
        // Depuração - listar todos os slugs disponíveis
        console.log("Slugs de categorias disponíveis:", categories.map((c: any) => c.slug));
        console.log("Categoria atual da URL:", categorySlug);
        
        // Verificar se o slug atual existe nas categorias
        if (categorySlug) {
          console.log("Tentando encontrar categoria com slug:", categorySlug);
          
          // Primeiro tenta uma correspondência exata
          let matchingCategory = categories.find((cat: any) => cat.slug === categorySlug);
          
          // Se não encontrar, tenta ignorando case
          if (!matchingCategory) {
            console.log("Correspondência exata não encontrada, tentando case-insensitive...");
            matchingCategory = categories.find(
              (cat: any) => cat.slug.toLowerCase() === categorySlug.toLowerCase()
            );
          }
          
          console.log("Categoria correspondente encontrada:", matchingCategory);
          
          if (matchingCategory) {
            const categoryData = {
              id: Number(matchingCategory.id) || 0,
              name: String(matchingCategory.name || ""),
              slug: String(matchingCategory.slug || ""),
              description: String(matchingCategory.description || ""),
              color: String(matchingCategory.color || "#333333"),
              text_color: String(matchingCategory.text_color || "#FFFFFF"),
              active: Boolean(matchingCategory.active),
              order: Number(matchingCategory.order) || 0
            };
            
            console.log("Definindo detalhes da categoria:", categoryData);
            setCategoryDetails(categoryData);
          } else {
            // Se não encontrou a categoria, definir erro
            console.error(`Categoria '${categorySlug}' não encontrada entre as categorias disponíveis`);
            setError(`Categoria '${categorySlug}' não encontrada`);
          }
        } else {
          console.error("Nenhum slug de categoria fornecido na URL");
          setError("Categoria não especificada");
        }
      } catch (err: any) {
        console.error("Erro ao buscar categorias:", err);
        setError(`Erro ao carregar categorias: ${err.message || "Erro desconhecido"}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [categorySlug]);
  
  // Depois, busca as notícias quando temos detalhes da categoria
  useEffect(() => {
    // Se não temos categoria ou já temos erro, não buscar notícias
    if (!categoryDetails || error) {
      console.log("Não buscando notícias porque:", !categoryDetails ? "Sem detalhes de categoria" : "Há um erro");
      return;
    }
    
    const fetchArticles = async () => {
      try {
        setLoadingArticles(true);
        console.log(`Buscando notícias para categoria '${categoryDetails.slug}', página=${currentPage}`);
        
        // Usar o endpoint de notícias com filtro de categoria
        const newsResponse = await axios.get(`https://taquaritinganoticias.criarsite.online/api/news`, {
          params: {
            category: categoryDetails.slug,
            page: currentPage
          }
        });
        
        console.log("Resposta da API de notícias:", newsResponse.data);
        
        // Processar notícias
        if (newsResponse.data && typeof newsResponse.data === 'object') {
          if (Array.isArray(newsResponse.data.data)) {
            console.log(`Encontradas ${newsResponse.data.data.length} notícias`);
            setArticles(newsResponse.data.data);
            setTotalPages(newsResponse.data.last_page || 1);
          } else if (Array.isArray(newsResponse.data)) {
            console.log(`Encontradas ${newsResponse.data.length} notícias (formato alternativo)`);
            setArticles(newsResponse.data);
            setTotalPages(1);
          } else {
            console.log("Nenhuma notícia encontrada na resposta");
            setArticles([]);
          }
        } else {
          console.log("Formato de resposta de notícias inválido");
          setArticles([]);
        }
      } catch (err: any) {
        console.error("Erro ao buscar notícias:", err);
        setError(`Erro ao carregar notícias: ${err.message || "Erro desconhecido"}`);
      } finally {
        setLoadingArticles(false);
      }
    };
    
    fetchArticles();
  }, [categoryDetails, currentPage]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // Verifica se estamos carregando algo
  const showLoading = isLoading || loadingArticles;
  
  // Fallback para categoria não encontrada
  if (error && error.includes("não encontrada")) {
    return (
      <div className="min-h-screen flex flex-col">
        <NewsTicker />
        <Header />
        <Navigation />
        
        <main className="container mx-auto py-8 flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-6">Categoria não encontrada</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            A categoria que você está procurando não existe ou foi removida.
          </p>
          
          {allCategories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Categorias disponíveis:</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {allCategories.map((cat) => (
                  <Button 
                    key={cat.id}
                    variant="outline"
                    onClick={() => navigate(`/category/${cat.slug}`)}
                    style={{ 
                      color: cat.color,
                      borderColor: cat.color + '40'
                    }}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <Button asChild>
            <Link to="/">Voltar para a página inicial</Link>
          </Button>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  // Renderização normal
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="flex-1 container mx-auto py-8">
        {/* Header da categoria */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ 
            color: categoryDetails?.color || '#333333' 
          }}>
            {showLoading ? <Skeleton className="h-10 w-64" /> : categoryDetails?.name || "Carregando..."}
          </h1>
          {categoryDetails?.description && (
            <p className="text-gray-600 dark:text-gray-300">
              {categoryDetails.description}
            </p>
          )}
        </div>
        
        {/* Informações de Debug - sempre visíveis temporariamente até resolver o problema */}
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 mb-6 rounded-lg text-sm">
          <p><strong>URL Slug:</strong> {categorySlug}</p>
          <p><strong>Categoria ID:</strong> {categoryDetails?.id || 'N/A'}</p>
          <p><strong>Categoria Nome:</strong> {categoryDetails?.name || 'N/A'}</p>
          <p><strong>Categoria Slug:</strong> {categoryDetails?.slug || 'N/A'}</p>
          <p><strong>Artigos:</strong> {articles.length}</p>
          <p><strong>Página:</strong> {currentPage} de {totalPages}</p>
          <p><strong>Carregando Categorias:</strong> {isLoading ? 'Sim' : 'Não'}</p>
          <p><strong>Carregando Artigos:</strong> {loadingArticles ? 'Sim' : 'Não'}</p>
          <p><strong>Erro:</strong> {error || 'Nenhum'}</p>
          <p><strong>Categorias disponíveis:</strong> {allCategories.map(c => c.slug).join(', ')}</p>
        </div>
        
        {/* Estados de conteúdo */}
        {showLoading ? (
          // Estado de carregamento
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error && !error.includes("não encontrada") ? (
          // Estado de erro (que não seja "categoria não encontrada")
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Erro</h3>
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </div>
        ) : articles && articles.length > 0 ? (
          // Estado com notícias
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link 
                  key={article.id}
                  to={`/news/${article.slug}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {article.featured_image && (
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={article.featured_image} 
                        alt={article.title}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        {new Date(article.published_at).toLocaleDateString('pt-BR')}
                      </span>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          backgroundColor: article.category?.color + '20' || '#33333320',
                          color: article.category?.color || '#333333'
                        }}
                      >
                        {article.category?.name || categoryDetails?.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    // Lógica para mostrar no máximo 5 botões de página
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Estado vazio
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Nenhuma notícia encontrada</h3>
            <p className="text-gray-600 dark:text-gray-400">Não há notícias disponíveis nesta categoria no momento.</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              asChild
            >
              <Link to="/">Voltar para a página inicial</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
