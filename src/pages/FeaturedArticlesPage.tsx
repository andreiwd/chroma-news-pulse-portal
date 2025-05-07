
import { useEffect } from "react";
import { useNews } from "@/hooks/useNews";
import { Article } from "@/types/api";
import { Card } from "@/components/ui/card";
import NewsCard from "@/components/NewsCard";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsTicker from "@/components/NewsTicker";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedArticlesPage() {
  // Get all news and filter on client side for featured items
  const { data: newsData, isLoading } = useNews(1, "", "");
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  // Filter for featured articles
  const featuredArticles: Article[] = (newsData?.data || [])
    .filter(article => article && typeof article === 'object' && article.featured === true)
    .sort((a, b) => {
      // Sort by published_at date, newest first
      const dateA = new Date(a.published_at || 0).getTime();
      const dateB = new Date(b.published_at || 0).getTime();
      return dateB - dateA;
    });
  
  // Debug log to check how many featured articles we have
  console.log("FeaturedArticlesPage - Total featured articles:", featuredArticles.length);
  if (featuredArticles.length > 0) {
    console.log("First featured article:", featuredArticles[0]?.title);
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Destaques", href: "/featured" }
            ]}
          />
          
          <div className="mb-8 mt-4">
            <h1 className="text-3xl font-bold">Notícias em Destaque</h1>
            <p className="text-muted-foreground">
              Confira as principais notícias selecionadas por nossa equipe
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </Card>
              ))}
            </div>
          ) : featuredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map(article => (
                <NewsCard 
                  key={typeof article.id === 'number' ? article.id : article.slug} 
                  news={article} 
                  variant="default" 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Nenhuma notícia em destaque encontrada</h3>
              <p className="text-muted-foreground">
                Volte mais tarde para novos destaques
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
