
import { useEffect } from "react";
import NewsTicker from "@/components/NewsTicker";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FeaturedNewsCarousel from "@/components/FeaturedNewsCarousel";
import AdPlaceholder from "@/components/AdPlaceholder";
import CustomHtmlBlock from "@/components/CustomHtmlBlock";
import { Separator } from "@/components/ui/separator";
import { useNews, useLatestNews } from "@/hooks/useNews";
import { Article } from "@/types/api";
import MainNewsGrid from "@/components/MainNewsGrid";
import LatestNewsSidebar from "@/components/LatestNewsSidebar";
import MostViewedSidebar from "@/components/MostViewedSidebar";
import NewsletterSignup from "@/components/NewsletterSignup";
import CategoryNewsCarousel from "@/components/CategoryNewsCarousel";

export default function Index() {
  const { data: newsData, isLoading: isNewsLoading } = useNews(1, "", "");
  const { data: latestNewsData, isLoading: isLatestNewsLoading } = useLatestNews();
  
  const allNews: Article[] = newsData?.data || [];
  const latestNewsItems: Article[] = Array.isArray(latestNewsData) ? latestNewsData.filter(Boolean) : [];
  
  const getNewsByCategory = () => {
    if (!allNews?.length) return {};
    
    const categoryMap: Record<string, Article[]> = {};
    
    allNews.forEach(article => {
      if (!article) return;
      const categorySlug = article.category?.slug;
      if (!categorySlug) return;
      
      if (!categoryMap[categorySlug]) {
        categoryMap[categorySlug] = [];
      }
      
      categoryMap[categorySlug].push(article);
    });
    
    return categoryMap;
  };
  
  const getMostViewedNews = () => {
    return [...(allNews || [])].slice(0, 5);
  };
  
  const mainLatestNews = allNews?.slice(0, 12) || [];

  // Convert object to array of [key, value] pairs for safe rendering
  const categoryEntries = Object.entries(getNewsByCategory() || {});

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="flex-1">
        <section className="py-6 bg-white border-b">
          <div className="container">
            <h2 className="sr-only">Destaques</h2>
            <FeaturedNewsCarousel />
          </div>
        </section>

        <div className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-2">
              <AdPlaceholder 
                size="sidebar" 
                id="ad-left-sidebar-1" 
                className="sticky top-24 bg-white rounded-lg shadow-sm"
              />
              
              <LatestNewsSidebar latestNewsItems={latestNewsItems} />
            </div>
            
            <div className="lg:col-span-7">
              <MainNewsGrid mainLatestNews={mainLatestNews} />
              
              <AdPlaceholder 
                size="banner" 
                id="ad-main-banner-1"
                className="my-8 bg-white rounded-lg shadow-sm" 
              />

              <CustomHtmlBlock
                id="block-weather"
                title="Previsão do Tempo"
                className="bg-white rounded-lg shadow-sm mb-8"
              />

              {categoryEntries.slice(0, 1).map(([category, news], index) => {
                if (!category || !news || !news.length) return null;
                return (
                  <CategoryNewsCarousel key={`cat-carousel-${category}-${index}`} category={category} news={news} />
                );
              })}
              
              <AdPlaceholder 
                size="banner" 
                id="ad-main-banner-2"
                className="my-8 bg-white rounded-lg shadow-sm" 
              />
              
              <CustomHtmlBlock
                id="block-horoscope"
                title="Horóscopo"
                className="bg-white rounded-lg shadow-sm mb-8"
              />

              {categoryEntries.slice(1, 2).map(([category, news], index) => {
                if (!category || !news || !news.length) return null;
                return (
                  <CategoryNewsCarousel key={`cat-carousel-${category}-${index}`} category={category} news={news} />
                );
              })}
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-lg shadow-sm">
                <MostViewedSidebar mostViewedNews={getMostViewedNews()} />
              </div>
              
              <AdPlaceholder 
                size="rectangle" 
                id="ad-sidebar-rect-1"
                className="bg-white rounded-lg shadow-sm" 
              />
              
              <div className="bg-white rounded-lg shadow-sm">
                <NewsletterSignup />
              </div>
              
              <AdPlaceholder 
                size="sidebar" 
                id="ad-sidebar-tall-1"
                className="bg-white rounded-lg shadow-sm" 
              />
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <Separator className="my-8" />
            
            {categoryEntries.slice(2, 4).map(([category, news], index) => {
              if (!category || !news || !news.length) return null;
              return (
                <CategoryNewsCarousel key={`cat-footer-${category}-${index}`} category={category} news={news} />
              );
            })}
            
            <AdPlaceholder 
              size="banner" 
              id="ad-footer-banner-1"
              className="bg-white rounded-lg shadow-sm my-8" 
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
