
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/api";
import type { Article, Category, PaginatedResponse } from "@/types/api";
import axios from "axios";

const API_BASE_URL = "https://taquaritinganoticias.criarsite.online/api";

// Buscar notícias
export function useNews(page = 1, category = "", query = "") {
  return useQuery({
    queryKey: ["news", { page, category, query }],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (query) params.append("q", query);
        params.append("page", page.toString());

        console.log(`Buscando notícias com parâmetros: ${params.toString()}`);
        const response = await axios.get(`${API_BASE_URL}/news?${params.toString()}`);
        console.log('Resposta da API de notícias:', response.data);
        return response.data;
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Detalhes de notícia
export function useNewsDetail(slug: string) {
  return useQuery({
    queryKey: ["news-detail", slug],
    queryFn: async () => {
      try {
        console.log(`Buscando detalhes da notícia: ${slug}`);
        const response = await axios.get(`${API_BASE_URL}/news/${slug}`);
        console.log('Resposta da API de detalhes:', response.data);
        return response.data;
      } catch (error) {
        console.error(`Erro ao buscar notícia ${slug}:`, error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(slug),
  });
}

// Categorias
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        console.log("Buscando categorias...");
        const response = await axios.get(`${API_BASE_URL}/categories`);
        console.log("Resposta da API de categorias:", response.data);
        
        let categories = [];
        
        if (Array.isArray(response.data)) {
          categories = response.data;
        } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
          categories = response.data.data;
        }
        
        // Mapear e garantir que temos os campos necessários
        return categories
          .filter(cat => cat && typeof cat === 'object') // Filtrar categorias inválidas
          .map((category: any) => ({
            id: Number(category.id) || 0,
            name: String(category.name || ""),
            slug: String(category.slug || ""),
            description: String(category.description || ""),
            color: String(category.color || "#333333"),
            text_color: String(category.text_color || "#FFFFFF"),
            active: Boolean(category.active),
            order: Number(category.order) || 0
          }));
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        return [];
      }
    },
    staleTime: 30 * 60 * 1000,
  });
}

// Notícias de categoria
export function useCategoryNews(categorySlug: string | undefined, page = 1) {
  return useQuery({
    queryKey: ["category-news", categorySlug, page],
    queryFn: async () => {
      if (!categorySlug) {
        return { data: [] };
      }

      try {
        // Tentativa direta
        console.log(`Tentando buscar notícias da categoria ${categorySlug}, página ${page}`);
        const response = await axios.get(`${API_BASE_URL}/categories/${categorySlug}/news?page=${page}`);
        console.log('Resposta da API de categoria:', response.data);
        
        // Verificar se a resposta é um array ou um objeto paginado
        if (Array.isArray(response.data)) {
          return { 
            data: response.data,
            current_page: 1,
            last_page: 1,
            per_page: response.data.length,
            total: response.data.length
          };
        }
        
        return response.data;
      } catch (error) {
        console.error("Erro ao buscar notícias da categoria:", error);
        
        // Tentativa alternativa
        try {
          console.log(`Tentando fallback para categoria ${categorySlug}`);
          const fallbackResponse = await axios.get(`${API_BASE_URL}/news?category=${categorySlug}&page=${page}`);
          console.log('Resposta do fallback:', fallbackResponse.data);
          return fallbackResponse.data;
        } catch (fallbackError) {
          console.error("Fallback também falhou:", fallbackError);
          return { data: [] };
        }
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(categorySlug),
  });
}

export function useLatestNews() {
  return useQuery({
    queryKey: ["latest-news"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/latest-news`);
        return response.data;
      } catch (error) {
        console.error("Erro ao buscar últimas notícias:", error);
        return [];
      }
    },
    staleTime: 1 * 60 * 1000,
  });
}

export function useSearchNews(query: string, page = 1) {
  return useQuery({
    queryKey: ["search", query, page],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/search?query=${query}&page=${page}`);
        return response.data;
      } catch (error) {
        console.error(`Erro ao buscar por "${query}":`, error);
        return { data: [] };
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(query),
  });
}
