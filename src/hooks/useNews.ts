
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/api";
import type { Article, Category, PaginatedResponse } from "@/types/api";
import axios from "axios";

const API_BASE_URL = "https://taquaritinganoticias.criarsite.online/api";

// Simplificada versão direta para buscar notícias
export function useNews(page = 1, category = "", query = "") {
  return useQuery({
    queryKey: ["news", { page, category, query }],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (query) params.append("q", query);
        params.append("page", page.toString());

        const response = await axios.get(`${API_BASE_URL}/news?${params.toString()}`);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch news:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Simplificada versão para detalhes de notícias
export function useNewsDetail(slug: string) {
  return useQuery({
    queryKey: ["news-detail", slug],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/news/${slug}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch news ${slug}:`, error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(slug),
  });
}

// Nova versão simplificada para categorias
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        
        // Garantir que sempre retornamos um array
        let categories = [];
        
        if (Array.isArray(response.data)) {
          categories = response.data;
        } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
          categories = response.data.data;
        }
        
        // Mapear e garantir que temos os campos necessários
        return categories.map((category: any) => ({
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
        console.error("Failed to fetch categories:", error);
        return [];
      }
    },
    staleTime: 30 * 60 * 1000,
  });
}

// Nova implementação simples para noticias de categoria
export function useCategoryNews(categorySlug: string | undefined) {
  return useQuery({
    queryKey: ["category-news", categorySlug],
    queryFn: async () => {
      if (!categorySlug) {
        return { data: [] };
      }

      try {
        // Tentativa direta
        const response = await axios.get(`${API_BASE_URL}/categories/${categorySlug}/news`);
        
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
        console.error("Failed to fetch category news:", error);
        
        // Tentativa alternativa
        try {
          const fallbackResponse = await axios.get(`${API_BASE_URL}/news?category=${categorySlug}`);
          return fallbackResponse.data;
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
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
        console.error("Failed to fetch latest news:", error);
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
        console.error(`Failed to search news for query ${query}:`, error);
        return { data: [] };
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(query),
  });
}
