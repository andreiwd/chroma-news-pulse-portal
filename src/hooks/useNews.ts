
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/api";
import type { Article, Category, PaginatedResponse } from "@/types/api";
import axios from "axios";

const API_BASE_URL = "https://taquaritinganoticias.criarsite.online/api";

// Helper function to sanitize category objects
const sanitizeCategory = (category: any): Category | null => {
  if (!category) return null;
  
  if (typeof category === 'object') {
    return {
      id: Number(category.id) || 0,
      name: String(category.name || ""),
      slug: String(category.slug || ""),
      description: String(category.description || ""),
      color: String(category.color || "#333333"),
      text_color: String(category.text_color || "#FFFFFF"),
      active: Boolean(category.active),
      order: Number(category.order) || 0
    };
  }
  
  if (typeof category === 'string') {
    return {
      id: 0,
      name: category,
      slug: category.toLowerCase().replace(/\s+/g, '-'),
      description: '',
      color: "#333333",
      text_color: "#FFFFFF",
      active: true,
      order: 0
    };
  }
  
  return null;
};

// Helper function to sanitize article data
const sanitizeArticle = (article: any): Article => {
  if (!article) return {} as Article;
  
  // Ensure category is properly formatted
  const sanitizedCategory = sanitizeCategory(article.category);
  
  // Ensure tags are properly formatted
  const sanitizedTags = Array.isArray(article.tags) 
    ? article.tags.map((tag: any) => ({
        id: Number(tag.id) || 0,
        name: String(tag.name || "")
      }))
    : [];
  
  // Return sanitized article with featured properly typed
  return {
    id: Number(article.id) || 0,
    title: String(article.title || ""),
    slug: String(article.slug || ""),
    excerpt: String(article.excerpt || ""),
    content: String(article.content || ""),
    featured_image: String(article.featured_image || ""),
    featured: Boolean(article.featured), // Ensure featured is properly converted to boolean
    category: sanitizedCategory as Category,
    tags: sanitizedTags,
    published_at: String(article.published_at || ""),
    created_at: String(article.created_at || ""),
    updated_at: String(article.updated_at || "")
  };
};

// Fetch featured articles (hero section) - new function
export function useFeaturedHeroNews() {
  return useQuery({
    queryKey: ["featured-hero"],
    queryFn: async () => {
      try {
        console.log("Fetching featured hero articles with new endpoint");
        const response = await axios.get(`${API_BASE_URL}/news?featured=1&limit=3`);
        console.log('Featured hero API response:', response.data);
        
        // Process the response
        if (Array.isArray(response.data)) {
          const sanitizedArticles = response.data.map(item => sanitizeArticle(item));
          console.log('Sanitized hero articles:', sanitizedArticles.length);
          return sanitizedArticles;
        }
        
        if (response.data && Array.isArray(response.data.data)) {
          const sanitizedArticles = response.data.data.map(item => sanitizeArticle(item));
          console.log('Sanitized hero articles (from data):', sanitizedArticles.length);
          return sanitizedArticles;
        }
        
        return [];
      } catch (error) {
        console.error("Error fetching featured hero articles:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch all featured articles (for the featured page)
export function useAllFeaturedNews(page = 1) {
  return useQuery({
    queryKey: ["all-featured", page],
    queryFn: async () => {
      try {
        console.log(`Fetching all featured articles, page ${page}`);
        const response = await axios.get(`${API_BASE_URL}/news?featured=1&page=${page}`);
        console.log('All featured API response:', response.data);
        
        // Process paginated data
        if (response.data && Array.isArray(response.data.data)) {
          return {
            ...response.data,
            data: response.data.data.map(item => sanitizeArticle(item))
          };
        }
        
        // Process array data
        if (Array.isArray(response.data)) {
          return {
            data: response.data.map(item => sanitizeArticle(item)),
            current_page: page,
            last_page: 1,
            per_page: response.data.length,
            total: response.data.length
          };
        }
        
        return {
          data: [],
          current_page: page,
          last_page: 1,
          per_page: 10,
          total: 0
        };
      } catch (error) {
        console.error("Error fetching all featured articles:", error);
        return {
          data: [],
          current_page: page,
          last_page: 1,
          per_page: 10,
          total: 0
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

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
        
        // Ensure we properly format and sanitize the data
        if (Array.isArray(response.data)) {
          const sanitizedArticles = response.data.map(item => sanitizeArticle(item));
          console.log('Artigos em destaque:', sanitizedArticles.filter(article => article.featured === true));
          return { 
            data: sanitizedArticles,
            current_page: 1,
            last_page: 1,
            per_page: response.data.length,
            total: response.data.length
          };
        }
        
        if (response.data && Array.isArray(response.data.data)) {
          const sanitizedArticles = response.data.data.map(item => sanitizeArticle(item));
          console.log('Artigos em destaque:', sanitizedArticles.filter(article => article.featured === true));
          return {
            ...response.data,
            data: sanitizedArticles
          };
        }
        
        return {
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0
        };
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
        return sanitizeArticle(response.data);
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
        
        // Mapear e garantir que temos os campos necessários como strings
        return categories
          .filter((cat: any) => cat && typeof cat === 'object') // Filtrar categorias inválidas
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
            data: response.data.map(item => sanitizeArticle(item)),
            current_page: 1,
            last_page: 1,
            per_page: response.data.length,
            total: response.data.length
          };
        }
        
        // Process paginated data
        if (response.data && Array.isArray(response.data.data)) {
          return {
            ...response.data,
            data: response.data.data.map(item => sanitizeArticle(item))
          };
        }
        
        return {
          data: [],
          current_page: page,
          last_page: 1,
          per_page: 10,
          total: 0
        };
      } catch (error) {
        console.error("Erro ao buscar notícias da categoria:", error);
        
        // Tentativa alternativa
        try {
          console.log(`Tentando fallback para categoria ${categorySlug}`);
          const fallbackResponse = await axios.get(`${API_BASE_URL}/news?category=${categorySlug}&page=${page}`);
          console.log('Resposta do fallback:', fallbackResponse.data);
          
          if (fallbackResponse.data && Array.isArray(fallbackResponse.data.data)) {
            return {
              ...fallbackResponse.data,
              data: fallbackResponse.data.data.map(item => sanitizeArticle(item))
            };
          }
          
          if (Array.isArray(fallbackResponse.data)) {
            return {
              data: fallbackResponse.data.map(item => sanitizeArticle(item)),
              current_page: page,
              last_page: 1,
              per_page: fallbackResponse.data.length,
              total: fallbackResponse.data.length
            };
          }
          
          return {
            data: [],
            current_page: page,
            last_page: 1,
            per_page: 10,
            total: 0
          };
        } catch (fallbackError) {
          console.error("Fallback também falhou:", fallbackError);
          return { 
            data: [],
            current_page: page,
            last_page: 1,
            per_page: 10,
            total: 0
          };
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
        if (Array.isArray(response.data)) {
          return response.data.map(item => sanitizeArticle(item));
        }
        return [];
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
        
        // Process paginated data
        if (response.data && Array.isArray(response.data.data)) {
          return {
            ...response.data,
            data: response.data.data.map(item => sanitizeArticle(item))
          };
        }
        
        if (Array.isArray(response.data)) {
          return {
            data: response.data.map(item => sanitizeArticle(item)),
            current_page: page,
            last_page: 1,
            per_page: response.data.length,
            total: response.data.length
          };
        }
        
        return { 
          data: [],
          current_page: page,
          last_page: 1,
          per_page: 10,
          total: 0
        };
      } catch (error) {
        console.error(`Erro ao buscar por "${query}":`, error);
        return { 
          data: [],
          current_page: page,
          last_page: 1,
          per_page: 10,
          total: 0
        };
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(query),
  });
}
