
import { useEffect } from "react";
import NewsTicker from "@/components/NewsTicker";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FeaturedNewsCarousel from "@/components/FeaturedNewsCarousel";
import NewsCard from "@/components/NewsCard";
import CategoryNewsCarousel from "@/components/CategoryNewsCarousel";
import AdPlaceholder from "@/components/AdPlaceholder";
import CustomHtmlBlock from "@/components/CustomHtmlBlock";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNews, useLatestNews } from "@/hooks/useNews";
import { Link } from "react-router-dom";
import { Article } from "@/types/api";

export default function Index() {
  const { data: newsData, isLoading: isNewsLoading } = useNews(1, "", "");
  const { data: latestNewsData, isLoading: isLatestNewsLoading } = useLatestNews();
  
  const allNews: Article[] = newsData?.data || [];
  const latestNewsItems: Article[] = Array.isArray(latestNewsData) ? latestNewsData : [];
  
  const getNewsByCategory = () => {
    if (!allNews?.length) return {};
    
    const categoryMap: Record<string, Article[]> = {};
    
    allNews.forEach(article => {
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
  
  const newsByCategory = getNewsByCategory();
  const mostViewedNews = getMostViewedNews();
  const mainLatestNews = allNews?.slice(0, 12) || [];

  // Convert object to array of [key, value] pairs for safe rendering
  const categoryEntries = Object.entries(newsByCategory || {});

  return (
    <div className="min-h-screen flex flex-col">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="flex-1 overflow-hidden">
        <section className="py-6">
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
                className="sticky top-24"
              />
              
              <div className="bg-muted/30 p-4 rounded-lg mt-6">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Últimas Notícias</h3>
                <div className="space-y-3">
                  {latestNewsItems.slice(0, 5).map((news) => (
                    <div 
                      key={news.id} 
                      className="border-l-2 pl-2 py-1 hover:bg-muted/50 transition-colors"
                      style={{ borderLeftColor: news.category?.color || '#333' }}
                    >
                      <Link 
                        to={`/news/${news.slug}`}
                        className="text-sm font-medium hover:underline line-clamp-2"
                        style={{ color: news.category?.color || '#333' }}
                      >
                        {news.title || "Notícia sem título"}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-1">
                        {news.published_at && new Date(news.published_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">Principais Notícias</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mainLatestNews.slice(0, 4).map((article, index) => (
                    <div 
                      key={article.id}
                      className={`animate-fadeInUp`} 
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <NewsCard 
                        news={article} 
                        variant={index < 2 ? "default" : "compact"}
                      />
                    </div>
                  ))}
                </div>
              </section>
              
              <AdPlaceholder size="banner" id="ad-main-banner-1" />

              <CustomHtmlBlock
                id="block-weather"
                title="Previsão do Tempo"
                className="bg-muted/10"
              />

              {categoryEntries.slice(0, 1).map(([category, news], index) => (
                <CategoryNewsCarousel key={`cat-carousel-${category}-${index}`} category={category} news={news} />
              ))}
              
              <section>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    {mainLatestNews.length > 5 && <NewsCard news={mainLatestNews[5]} />}
                  </div>
                  
                  <div className="space-y-4">
                    {mainLatestNews.slice(6, 9).map(news => (
                      <NewsCard key={news.id} news={news} variant="minimal" />
                    ))}
                  </div>
                </div>
              </section>

              <CustomHtmlBlock
                id="block-horoscope"
                title="Horóscopo"
                className="bg-muted/10"
              />

              {categoryEntries.slice(1, 2).map(([category, news], index) => (
                <CategoryNewsCarousel key={`cat-carousel-${category}-${index}`} category={category} news={news} />
              ))}
              
              <AdPlaceholder size="banner" id="ad-main-banner-2" />
              
              <section>
                <h2 className="text-xl font-bold mb-4">Reportagens Especiais</h2>
                <div className="space-y-4">
                  {mainLatestNews.slice(9, 12).map(news => (
                    <NewsCard key={news.id} news={news} variant="horizontal" />
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg sticky top-24">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Mais Lidas</h3>
                <div className="space-y-4">
                  {mostViewedNews.map((news, index) => (
                    <div key={news.id} className="flex gap-3">
                      <div className="text-2xl font-bold text-muted-foreground w-8">
                        {index + 1}
                      </div>
                      <div>
                        <Link 
                          to={`/news/${news.slug}`}
                          className="font-medium hover:underline line-clamp-2"
                          style={{ color: news.category?.color || '#333' }}
                        >
                          {news.title || "Notícia sem título"}
                        </Link>
                        <div className="text-xs text-muted-foreground mt-1">
                          Views
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <AdPlaceholder size="rectangle" id="ad-sidebar-rect-1" />
              
              <div className="bg-muted p-4 rounded-lg text-center">
                <h3 className="font-medium mb-2">Assine nossa newsletter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Receba as principais notícias diretamente no seu email
                </p>
                <form className="flex flex-col gap-2">
                  <input 
                    type="email" 
                    placeholder="Seu e-mail" 
                    className="w-full p-2 rounded border"
                  />
                  <button 
                    type="submit"
                    className="bg-primary text-white rounded px-4 py-2 text-sm"
                  >
                    Assinar
                  </button>
                </form>
              </div>
              
              <AdPlaceholder size="sidebar" id="ad-sidebar-tall-1" />
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <Separator />
            
            {categoryEntries.slice(2, 4).map(([category, news], index) => (
              <CategoryNewsCarousel key={`cat-footer-${category}-${index}`} category={category} news={news} />
            ))}
            
            <AdPlaceholder size="banner" id="ad-footer-banner-1" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
