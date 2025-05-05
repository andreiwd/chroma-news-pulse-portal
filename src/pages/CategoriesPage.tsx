
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import NewsTicker from "@/components/NewsTicker";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/types/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        console.log("Buscando categorias...");
        const response = await axios.get('https://taquaritinganoticias.criarsite.online/api/categories');
        console.log("Resposta da API de categorias:", response.data);
        
        // Processar a resposta para garantir que temos um array
        let fetchedCategories = [];
        if (Array.isArray(response.data)) {
          fetchedCategories = response.data;
        } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
          fetchedCategories = response.data.data;
        }
        
        console.log("Categorias processadas:", fetchedCategories);
        
        // Mapear para o formato Category
        const processedCategories = fetchedCategories.map((cat: any) => ({
          id: Number(cat.id) || 0,
          name: String(cat.name || ""),
          slug: String(cat.slug || ""),
          description: String(cat.description || ""),
          color: String(cat.color || "#333333"),
          text_color: String(cat.text_color || "#FFFFFF"),
          active: Boolean(cat.active),
          order: Number(cat.order) || 0
        }));
        
        setCategories(processedCategories);
        
        if (processedCategories.length === 0) {
          console.log("Nenhuma categoria encontrada na resposta");
        }
      } catch (err: any) {
        console.error("Erro ao buscar categorias:", err);
        setError(err.message || "Erro ao buscar categorias");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Todas as Categorias</h1>
          
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-yellow-100 p-4 mb-4 rounded-md">
              <p><strong>Total de categorias:</strong> {categories.length}</p>
              <p><strong>Carregando:</strong> {isLoading ? 'Sim' : 'Não'}</p>
              <p><strong>Erro:</strong> {error || 'Nenhum'}</p>
            </div>
          )}
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-lg dark:text-white">Erro ao carregar categorias: {error}</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link 
                  key={`cat-${category.id || 'unknown'}-${category.slug}`}
                  to={`/category/${category.slug}`}
                  className="group overflow-hidden rounded-lg shadow-md transition-all hover:-translate-y-1 hover:shadow-lg bg-white dark:bg-gray-800"
                >
                  <div className="p-6">
                    <h2 
                      className="text-xl font-bold mb-2 transition-all group-hover:text-primary dark:text-white"
                      style={{ color: category.color }}
                    >
                      {category.name}
                    </h2>
                    
                    {category.description && (
                      <p className="text-sm line-clamp-2 text-gray-600 dark:text-gray-300 mb-4">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="inline-block px-4 py-1 rounded-full text-xs font-medium" style={{
                      backgroundColor: `${category.color}20`,
                      color: category.color
                    }}>
                      Ver notícias
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg dark:text-white">Nenhuma categoria encontrada.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
