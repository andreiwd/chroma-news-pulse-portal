
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import NewsTicker from "@/components/NewsTicker";
import Footer from "@/components/Footer";
import { useCategories, useNews } from "@/hooks/useNews";
import { Skeleton } from "@/components/ui/skeleton";
import { Category, Article } from "@/types/api";

export default function CategoriesPage() {
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories();
  const { data: newsData } = useNews(1, "", "");
  const [categoryWithLatest, setCategoryWithLatest] = useState<Record<string, Article>>({});
  
  // Ensure categories is always an array of valid Category objects
  const categories: Category[] = Array.isArray(categoriesData) 
    ? categoriesData.filter((cat): cat is Category => 
        Boolean(cat) && 
        typeof cat === 'object' && 
        'name' in cat && 
        'id' in cat && 
        'slug' in cat
      )
    : [];
    
  const allNews: Article[] = newsData?.data || [];
  
  // Find the latest article for each category
  useEffect(() => {
    if (categories.length && allNews.length) {
      const latestByCategory: Record<string, Article> = {};
      
      categories.forEach(category => {
        if (!category || !category.slug) return;
        
        const categoryNews = allNews.filter(article => 
          article.category && 
          typeof article.category === 'object' && 
          article.category.slug === category.slug
        );
        
        if (categoryNews.length) {
          // Sort by published date (newest first)
          const sorted = [...categoryNews].sort((a, b) => {
            const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
            const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
            return dateB - dateA;
          });
          
          latestByCategory[category.slug] = sorted[0];
        }
      });
      
      setCategoryWithLatest(latestByCategory);
    }
  }, [categories, allNews]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Todas as Categorias</h1>
          
          {isCategoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => {
                if (!category || !category.slug) return null;
                
                const latestArticle = categoryWithLatest[category.slug];
                const categoryName = typeof category.name === 'string' ? category.name : '';
                const categorySlug = typeof category.slug === 'string' ? category.slug : '';
                const categoryColor = typeof category.color === 'string' ? category.color : '#333';
                
                return (
                  <Link 
                    key={category.id}
                    to={`/category/${categorySlug}`}
                    className="group overflow-hidden rounded-lg shadow-md transition-all hover:-translate-y-1 hover:shadow-lg bg-white dark:bg-gray-800"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={latestArticle?.featured_image || "https://placehold.co/800x450/333/white?text=Category"}
                        alt={categoryName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "https://placehold.co/800x450/333/white?text=Category";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                    </div>
                    
                    <div className="p-4">
                      <h2 
                        className="text-xl font-bold mb-2 transition-all group-hover:text-primary dark:text-white"
                        style={{ color: categoryColor }}
                      >
                        {categoryName}
                      </h2>
                      
                      {latestArticle ? (
                        <p className="text-sm line-clamp-2 text-gray-600 dark:text-gray-300">
                          Última notícia: {latestArticle.title}
                        </p>
                      ) : (
                        <p className="text-sm italic text-gray-500 dark:text-gray-400">
                          Nenhuma notícia publicada
                        </p>
                      )}
                      
                      <div className="mt-4 inline-block px-4 py-1 rounded-full text-xs font-medium" style={{
                        backgroundColor: `${categoryColor}20`,
                        color: categoryColor
                      }}>
                        Ver notícias
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
