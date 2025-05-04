
import axios from "axios";

const BASE_URL = "https://taquaritinganoticias.criarsite.online/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor para tratamento de erros global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

// Queries functions
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
    try {
      const { data } = await api.get(`/categories/${slug}/news?page=${page}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch news for category ${slug}:`, error);
      throw error;
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
