
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import NewsTicker from "@/components/NewsTicker";
import Footer from "@/components/Footer";
import { useCategories, useNews } from "@/hooks/useNews";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/types/api";

export default function CategoriesPage() {
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories();
  const { data: newsData } = useNews(1, "", "");
  
  // Log everything for debugging
  console.log("Categories page - categories:", categoriesData);
  console.log("Categories page - news:", newsData);
  
  // Ensure categories is always an array
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
    
  const allNews = Array.isArray(newsData?.data) ? newsData.data : [];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Todas as Categorias</h1>
          
          {isCategoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link 
                  key={`cat-${category.id || 'unknown'}`}
                  to={`/category/${category.slug}`}
                  className="group overflow-hidden rounded-lg shadow-md transition-all hover:-translate-y-1 hover:shadow-lg bg-white dark:bg-gray-800"
                >
                  <div className="p-6">
                    <h2 
                      className="text-xl font-bold mb-2 transition-all group-hover:text-primary dark:text-white"
                      style={{ color: category.color }}
                    >
                      {category.name}
                    </h2>
                    
                    {category.description && (
                      <p className="text-sm line-clamp-2 text-gray-600 dark:text-gray-300 mb-4">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="inline-block px-4 py-1 rounded-full text-xs font-medium" style={{
                      backgroundColor: `${category.color}20`,
                      color: category.color
                    }}>
                      Ver notícias
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg dark:text-white">Nenhuma categoria encontrada.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
