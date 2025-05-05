
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

// Query functions
export const queries = {
  getNews: async ({ pageParam = 1, category = "", query = "" }) => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (query) params.append("q", query);
    params.append("page", pageParam.toString());

    try {
      const response = await api.get(`/news?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch news:", error);
      throw error;
    }
  },

  getNewsById: async (slug: string) => {
    try {
      const response = await api.get(`/news/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch news ${slug}:`, error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get("/categories");
      console.log("Raw categories response:", response.data);
      
      // Determine the structure of the response
      let categoriesData = [];
      
      if (Array.isArray(response.data)) {
        // Direct array of categories
        categoriesData = response.data;
      } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
        // Paginated response
        categoriesData = response.data.data;
      } else {
        console.error("Unexpected categories data format:", response.data);
        return [];
      }
      
      // Map and validate each category
      return categoriesData.map(cat => ({
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
      return []; // Return empty array instead of throwing
    }
  },

  getCategoryNews: async (slug: string, page = 1) => {
    if (!slug) {
      throw new Error("Category slug is required");
    }

    try {
      console.log(`Fetching news for category: ${slug}, page: ${page}`);
      // Try the direct endpoint first
      const response = await api.get(`/categories/${slug}/news?page=${page}`);
      console.log("Category news response:", response.data);
      
      // Handle different response formats
      if (response.data) {
        if (Array.isArray(response.data)) {
          // If it's a direct array, convert to paginated format
          return {
            data: response.data,
            current_page: page,
            last_page: 1,
            per_page: 10,
            total: response.data.length
          };
        }
        
        // If it's already in a paginated format with data array
        if (typeof response.data === 'object' && 'data' in response.data) {
          return response.data;
        }
        
        // Return whatever we got
        return response.data;
      }
      
      return { data: [], current_page: page, last_page: 1, per_page: 10, total: 0 };
    } catch (error) {
      console.error(`Error fetching category ${slug}:`, error);
      
      // Try fallback with filtered news endpoint
      try {
        const fallbackResponse = await api.get(`/news?category=${slug}&page=${page}`);
        console.log("Fallback category news response:", fallbackResponse.data);
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        return { data: [], current_page: page, last_page: 1, per_page: 10, total: 0 };
      }
    }
  },

  getLatestNews: async () => {
    try {
      const response = await api.get("/latest-news");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch latest news:", error);
      throw error;
    }
  },

  searchNews: async (query: string, page = 1) => {
    try {
      const response = await api.get(`/search?query=${query}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to search news for query ${query}:`, error);
      throw error;
    }
  },
};
