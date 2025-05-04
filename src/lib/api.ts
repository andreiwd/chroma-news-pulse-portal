
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
      const { data } = await api.get(`/news?${params.toString()}`);
      return data;
    } catch (error) {
      console.error("Failed to fetch news:", error);
      throw error;
    }
  },

  getNewsById: async (slug: string) => {
    try {
      const { data } = await api.get(`/news/${slug}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch news ${slug}:`, error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const { data } = await api.get("/categories");
      return data;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  },

  getCategoryNews: async (slug: string, page = 1) => {
    if (!slug) {
      console.error("No category slug provided");
      throw new Error("Category slug is required");
    }

    try {
      console.log(`Fetching news for category ${slug}, page ${page}`);
      
      // Try the endpoint for category news first
      const response = await api.get(`/categories/${slug}/news?page=${page}`);
      console.log("Category API response:", response.data);
      
      // Check if we got valid data
      if (response.data) {
        // If data is a direct array, wrap it in a paginated format
        if (Array.isArray(response.data)) {
          return {
            data: response.data,
            current_page: page,
            last_page: Math.ceil(response.data.length / 10) || 1,
            per_page: 10,
            total: response.data.length
          };
        }
        
        // If data is already paginated (has data property and pagination info)
        if (response.data.data && Array.isArray(response.data.data)) {
          return response.data;
        }
        
        // Unknown format - return as is and let the hook handle it
        return response.data;
      }
      
      throw new Error("Invalid response format from API");
    } catch (error) {
      console.error(`Failed to fetch news for category ${slug}:`, error);
      
      // Try fallback to general news search with category filter
      try {
        console.log(`Trying fallback for category ${slug}`);
        const fallbackResponse = await api.get(`/news?category=${slug}&page=${page}`);
        console.log("Fallback response:", fallbackResponse.data);
        
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error(`Fallback also failed for category ${slug}:`, fallbackError);
        throw error; // Throw the original error
      }
    }
  },

  getLatestNews: async () => {
    try {
      const { data } = await api.get("/latest-news");
      return data;
    } catch (error) {
      console.error("Failed to fetch latest news:", error);
      throw error;
    }
  },

  searchNews: async (query: string, page = 1) => {
    try {
      const { data } = await api.get(`/search?query=${query}&page=${page}`);
      return data;
    } catch (error) {
      console.error(`Failed to search news for query ${query}:`, error);
      throw error;
    }
  },
};
