
export interface LayoutBlock {
  id: string;
  type: 'carousel' | 'section'; // carousel = CategoryNewsCarousel, section = CategoryNewsSection
  categorySlug: string;
  order: number;
}

export interface LayoutConfig {
  blocks: LayoutBlock[];
}
