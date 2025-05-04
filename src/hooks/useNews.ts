
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/api";
import type { Article, Category, PaginatedResponse } from "@/types/api";

export function useNews(page = 1, category = "", query = "") {
  return useQuery({
    queryKey: ["news", { page, category, query }],
    queryFn: () => queries.getNews({ pageParam: page, category, query }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useNewsDetail(slug: string) {
  return useQuery({
    queryKey: ["news", slug],
    queryFn: () => queries.getNewsById(slug),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: queries.getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
    select: (data) => {
      // Ensure we return an array of valid Category objects
      if (!data) return [];
      
      if (Array.isArray(data)) {
        return data.filter(item => item && typeof item === 'object');
      }
      
      if (data && typeof data === 'object' && 'data' in data) {
        if (Array.isArray(data.data)) {
          return data.data.filter(item => item && typeof item === 'object');
        }
      }
      
      return [];
    }
  });
}

export function useLatestNews() {
  return useQuery({
    queryKey: ["latest-news"],
    queryFn: queries.getLatestNews,
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
    select: (data) => {
      // Ensure we return an array of valid Article objects
      if (!data) return [];
      
      if (Array.isArray(data)) {
        return data.filter(item => item && typeof item === 'object');
      }
      
      if (data && typeof data === 'object' && 'data' in data) {
        if (Array.isArray(data.data)) {
          return data.data.filter(item => item && typeof item === 'object');
        }
      }
      
      return [];
    }
  });
}

export function useCategoryNews(slug: string, page = 1) {
  return useQuery({
    queryKey: ["category-news", slug, page],
    queryFn: () => queries.getCategoryNews(slug, page),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2, // Retry twice if it fails
    enabled: Boolean(slug), // Only execute if there's a slug
    select: (data) => {
      console.log("Data received in useCategoryNews select:", data);
      
      // Return empty results if no data
      if (!data) return { data: [], current_page: page, last_page: 1, per_page: 10, total: 0 };
      
      // If data is already in the expected format
      if (data.data && Array.isArray(data.data)) {
        return data;
      }
      
      // If data is an array (direct list of articles)
      if (Array.isArray(data)) {
        return {
          data: data,
          current_page: page,
          last_page: 1,
          per_page: data.length,
          total: data.length
        };
      }
      
      // Default empty response
      return { data: [], current_page: page, last_page: 1, per_page: 10, total: 0 };
    }
  });
}

export function useSearchNews(query: string, page = 1) {
  return useQuery({
    queryKey: ["search", query, page],
    queryFn: () => queries.searchNews(query, page),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: Boolean(query),
  });
}
