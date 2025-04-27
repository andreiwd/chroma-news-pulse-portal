
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

    const { data } = await api.get(`/news?${params.toString()}`);
    return data;
  },

  getNewsById: async (slug: string) => {
    const { data } = await api.get(`/news/${slug}`);
    return data;
  },

  getCategories: async () => {
    const { data } = await api.get("/categories");
    return data;
  },

  getCategoryNews: async (slug: string, page = 1) => {
    const { data } = await api.get(`/categories/${slug}/news?page=${page}`);
    return data;
  },

  getLatestNews: async () => {
    const { data } = await api.get("/latest-news");
    return data;
  },

  searchNews: async (query: string, page = 1) => {
    const { data } = await api.get(`/search?query=${query}&page=${page}`);
    return data;
  },
};
