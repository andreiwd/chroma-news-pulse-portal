
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
      // Ensure categories are correctly formatted as an array
      return Array.isArray(data) ? data : [];
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
      // Garantir que os dados retornados sejam um array
      return Array.isArray(data) ? data : [];
    }
  });
}

export function useCategoryNews(slug: string, page = 1) {
  return useQuery({
    queryKey: ["category-news", slug, page],
    queryFn: () => queries.getCategoryNews(slug, page),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false, // Não tenta novamente se falhar
    enabled: Boolean(slug), // Só executa se houver slug
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
