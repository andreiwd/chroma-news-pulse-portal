
import { useEffect } from "react";
import NewsTicker from "@/components/NewsTicker";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { useNews, useLatestNews, useFeaturedHeroNews } from "@/hooks/useNews";
import { Article } from "@/types/api";
import MainNewsGrid from "@/components/MainNewsGrid";
import LatestNewsSidebar from "@/components/LatestNewsSidebar";
import MostViewedSidebar from "@/components/MostViewedSidebar";
import NewsletterSignup from "@/components/NewsletterSignup";
import FeaturedNewsHero from "@/components/FeaturedNewsHero";
import TrendingTopics from "@/components/TrendingTopics";
import CategoryNewsSection from "@/components/CategoryNewsSection";
import WeatherWidget from "@/components/WeatherWidget";
import FeaturedYouTubeVideo from "@/components/FeaturedYouTubeVideo";

export default function Index() {
  const { data: newsData, isLoading: isNewsLoading } = useNews(1, "", "");
  const { data: latestNewsData, isLoading: isLatestNewsLoading } = useLatestNews();
  const { data: featuredArticles, isLoading: isFeaturedLoading } = useFeaturedHeroNews();
  
  const allNews: Article[] = Array.isArray(newsData?.data) ? newsData?.data : [];
  console.log("Index - Total articles:", allNews.length);
  
  const latestNewsItems: Article[] = Array.isArray(latestNewsData) ? latestNewsData.filter(Boolean) : [];
  
  console.log("Featured articles from new endpoint:", featuredArticles);
  
  const getNewsByCategory = () => {
    if (!allNews?.length) return {};
    
    const categoryMap: Record<string, Article[]> = {};
    
    allNews.forEach(article => {
      if (!article || typeof article !== 'object') return;
      if (!article.category || typeof article.category !== 'object') return;
      
      const categorySlug = article.category.slug;
      if (!categorySlug || typeof categorySlug !== 'string') return;
      
      if (!categoryMap[categorySlug]) {
        categoryMap[categorySlug] = [];
      }
      
      categoryMap[categorySlug].push(article);
    });
    
    return categoryMap;
  };
  
  const getMostViewedNews = () => {
    // Calcular visualizações baseadas no ID ou em outra métrica real
    return [...(allNews || [])].sort((a, b) => {
      // Usamos o ID multiplicado por um fator para simular dados reais de visualização
      const viewsA = a.id ? a.id * 7.3 : 0;
      const viewsB = b.id ? b.id * 7.3 : 0;
      return viewsB - viewsA;
    }).slice(0, 5);
  };
  
  const mainLatestNews = allNews?.slice(0, 12) || [];
  const categoryEntries = Object.entries(getNewsByCategory() || {});
  const trendingNews = allNews?.slice(0, 6) || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-6">
          <div className="container">
            <FeaturedNewsHero featuredArticles={featuredArticles || []} />
          </div>
        </section>

        {/* Trending Topics Bar */}
        <section className="bg-white py-3 border-y shadow-sm mb-6">
          <div className="container">
            <TrendingTopics trendingNews={trendingNews} />
          </div>
        </section>

        {/* Main Content */}
        <div className="container pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <AdPlaceholder 
                  size="sidebar" 
                  id="ad-left-sidebar-1" 
                  className="bg-white rounded-lg shadow-sm"
                />
                
                <LatestNewsSidebar latestNewsItems={latestNewsItems} />
                
                {/* Weather Widget */}
                <div className="mt-6">
                  <WeatherWidget city="Taquaritinga,BR" />
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-7">
              <MainNewsGrid mainLatestNews={mainLatestNews} />
              
              <AdPlaceholder 
                size="banner" 
                id="ad-main-banner-1"
                className="my-8 bg-white rounded-lg shadow-sm" 
              />

              {/* Categorias */}
              {categoryEntries.slice(0, 4).map(([category, news], index) => {
                if (!category || !news || !news.length) return null;
                return (
                  <CategoryNewsSection 
                    key={`cat-section-${category}-${index}`} 
                    category={category} 
                    news={news} 
                  />
                );
              })}
              
              <AdPlaceholder 
                size="banner" 
                id="ad-main-banner-2"
                className="my-8 bg-white rounded-lg shadow-sm" 
              />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3">
              <div className="sticky top-24 space-y-6">
                {/* Use sticky for the sidebar with proper top offset */}
                <div className="mb-6">
                  <MostViewedSidebar mostViewedNews={getMostViewedNews()} />
                </div>
                
                <div className="space-y-6">
                  <AdPlaceholder 
                    size="rectangle" 
                    id="ad-sidebar-rect-1"
                    className="bg-white rounded-lg shadow-sm" 
                  />
                  
                  <NewsletterSignup />
                  
                  <AdPlaceholder 
                    size="sidebar" 
                    id="ad-sidebar-tall-1"
                    className="bg-white rounded-lg shadow-sm" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Vídeos em Destaque - full width with no container restrictions */}
        <FeaturedYouTubeVideo />
      </main>

      <Footer />
    </div>
  );
}
