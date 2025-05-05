
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

// Query functions simplificados
export const queries = {
  getNews: async ({ pageParam = 1, category = "", query = "" }) => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (query) params.append("q", query);
    params.append("page", pageParam.toString());

    try {
      const response = await axios.get(`${BASE_URL}/news?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch news:", error);
      throw error;
    }
  },

  getNewsById: async (slug: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/news/${slug}`);
      return response.data;
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
          data: response.data,
          current_page: page,
          last_page: 1,
          per_page: response.data.length,
          total: response.data.length
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
      return response.data;
    } catch (error) {
      console.error("Failed to fetch latest news:", error);
      return [];
    }
  },

  searchNews: async (query: string, page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/search?query=${query}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to search news for query ${query}:`, error);
      return { data: [] };
    }
  },
};
