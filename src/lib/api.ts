
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
      
      // Check if data is an array of category objects
      if (Array.isArray(data)) {
        return data;
      }
      
      // Check if data has a property 'data' that is an array (paginated response)
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data;
      }
      
      // Return empty array if none of the above
      console.error("Unexpected data structure from categories API:", data);
      return [];
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

    console.log(`Fetching news for category ${slug}, page ${page}`);
    
    try {
      // Use the exact endpoint from the documentation
      const response = await api.get(`/categories/${slug}/news?page=${page}`);
      console.log("Category API response:", response.data);
      
      // If the API returns data in the expected format, use it
      if (response.data && typeof response.data === 'object') {
        // If the data is in a paginated format
        if ('data' in response.data && Array.isArray(response.data.data)) {
          return response.data;
        }
        
        // If the data is a direct array of articles
        if (Array.isArray(response.data)) {
          return {
            data: response.data,
            current_page: page,
            last_page: Math.ceil(response.data.length / 10) || 1,
            per_page: 10,
            total: response.data.length
          };
        }
      }
      
      // If we couldn't determine the format, return the raw data
      return response.data;
    } catch (firstError) {
      console.error(`Error fetching category ${slug}:`, firstError);
      
      // Try fallback method using the news endpoint with category filter
      try {
        console.log(`Trying fallback for category ${slug}`);
        const fallbackResponse = await api.get(`/news?category=${slug}&page=${page}`);
        console.log("Fallback response:", fallbackResponse.data);
        
        return fallbackResponse.data;
      } catch (secondError) {
        console.error(`Both category endpoints failed for ${slug}:`, secondError);
        throw firstError; // Throw the original error
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
