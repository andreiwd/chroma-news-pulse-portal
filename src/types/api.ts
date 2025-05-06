
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  text_color: string;
  active: boolean;
  order: number;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  featured?: boolean;
  category: Category;
  tags: Tag[];
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}
