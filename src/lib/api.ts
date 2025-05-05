
import axios from "axios";

const BASE_URL = "https://taquaritinganoticias.criarsite.online/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Global error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

// Helper function to ensure category is a valid object with primitive values
const sanitizeCategory = (category: any) => {
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
  
  // If category is just a string (name or slug), create a minimal object
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
const sanitizeArticle = (article: any) => {
  if (!article) return null;
  
  // Ensure category is properly formatted
  const sanitizedCategory = sanitizeCategory(article.category);
  
  // Ensure tags are properly formatted
  const sanitizedTags = Array.isArray(article.tags) 
    ? article.tags.map((tag: any) => ({
        id: Number(tag.id) || 0,
        name: String(tag.name || "")
      }))
    : [];
  
  // Return sanitized article
  return {
    id: Number(article.id) || 0,
    title: String(article.title || ""),
    slug: String(article.slug || ""),
    excerpt: String(article.excerpt || ""),
    content: String(article.content || ""),
    featured_image: String(article.featured_image || ""),
    category: sanitizedCategory,
    tags: sanitizedTags,
    published_at: String(article.published_at || ""),
    created_at: String(article.created_at || ""),
    updated_at: String(article.updated_at || "")
  };
};

// Query functions simplificados
export const queries = {
  getNews: async ({ pageParam = 1, category = "", query = "" }) => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (query) params.append("q", query);
    params.append("page", pageParam.toString());

    try {
      const response = await axios.get(`${BASE_URL}/news?${params.toString()}`);
      
      // Sanitize the data before returning
      if (Array.isArray(response.data)) {
        return { data: response.data.map(article => sanitizeArticle(article)) };
      }
      
      if (response.data && Array.isArray(response.data.data)) {
        return {
          ...response.data,
          data: response.data.data.map(article => sanitizeArticle(article))
        };
      }
      
      return response.data;
    } catch (error) {
      console.error("Failed to fetch news:", error);
      throw error;
    }
  },

  getNewsById: async (slug: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/news/${slug}`);
      return sanitizeArticle(response.data);
    } catch (error) {
      console.error(`Failed to fetch news ${slug}:`, error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      
      // Determinar a estrutura da resposta
      let categoriesData = [];
      
      if (Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
        categoriesData = response.data.data;
      } else {
        console.error("Unexpected categories data format:", response.data);
        return [];
      }
      
      // Mapear e validar cada categoria - garantindo que são strings ou valores primitivos
      return categoriesData
        .filter(cat => cat && typeof cat === 'object') // Filtrar categorias inválidas
        .map(cat => ({
          id: Number(cat.id) || 0,
          name: String(cat.name || ""),
          slug: String(cat.slug || ""),
          description: String(cat.description || ""),
          color: String(cat.color || "#333333"),
          text_color: String(cat.text_color || "#FFFFFF"),
          active: Boolean(cat.active),
          order: Number(cat.order) || 0
        }));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  },

  getCategoryNews: async (slug: string, page = 1) => {
    try {
      console.log(`Tentando buscar notícias da categoria ${slug}, página ${page}`);
      const response = await axios.get(`${BASE_URL}/categories/${slug}/news?page=${page}`);
      console.log('Resposta da API:', response.data);
      
      // Handle different response formats
      if (Array.isArray(response.data)) {
        return {
          data: response.data.map(article => sanitizeArticle(article)),
          current_page: page,
          last_page: 1,
          per_page: response.data.length,
          total: response.data.length
        };
      }
      
      if (response.data && Array.isArray(response.data.data)) {
        return {
          ...response.data,
          data: response.data.data.map(article => sanitizeArticle(article))
        };
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${slug}:`, error);
      
      // Try fallback
      try {
        console.log(`Tentando fallback com filtro de categoria: ${slug}`);
        const fallbackResponse = await axios.get(`${BASE_URL}/news?category=${slug}&page=${page}`);
        console.log('Resposta do fallback:', fallbackResponse.data);
        
        if (Array.isArray(fallbackResponse.data)) {
          return {
            data: fallbackResponse.data.map(article => sanitizeArticle(article)),
            current_page: page,
            last_page: 1,
            per_page: fallbackResponse.data.length,
            total: fallbackResponse.data.length
          };
        }
        
        if (fallbackResponse.data && Array.isArray(fallbackResponse.data.data)) {
          return {
            ...fallbackResponse.data,
            data: fallbackResponse.data.data.map(article => sanitizeArticle(article))
          };
        }
        
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error("Fallback failed:", fallbackError);
        return { data: [], current_page: page, last_page: 1, per_page: 10, total: 0 };
      }
    }
  },

  getLatestNews: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/latest-news`);
      if (Array.isArray(response.data)) {
        return response.data.map(article => sanitizeArticle(article));
      }
      return response.data;
    } catch (error) {
      console.error("Failed to fetch latest news:", error);
      return [];
    }
  },

  searchNews: async (query: string, page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/search?query=${query}&page=${page}`);
      
      if (Array.isArray(response.data)) {
        return { 
          data: response.data.map(article => sanitizeArticle(article))
        };
      }
      
      if (response.data && Array.isArray(response.data.data)) {
        return {
          ...response.data,
          data: response.data.data.map(article => sanitizeArticle(article))
        };
      }
      
      return response.data;
    } catch (error) {
      console.error(`Failed to search news for query ${query}:`, error);
      return { data: [] };
    }
  },
};
