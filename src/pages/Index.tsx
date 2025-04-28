
import { useEffect } from "react";
import NewsTicker from "@/components/NewsTicker";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import FeaturedNewsCarousel from "@/components/FeaturedNewsCarousel";
import NewsCard from "@/components/NewsCard";
import CategoryNewsCarousel from "@/components/CategoryNewsCarousel";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNews, useLatestNews } from "@/hooks/useNews";
import { Link } from "react-router-dom";
import { Article } from "@/types/api";

export default function Index() {
  const { data: newsData, isLoading: isNewsLoading } = useNews(1, "", "");
  const { data: latestNewsData, isLoading: isLatestNewsLoading } = useLatestNews();
  
  // Get news articles from API response
  const allNews: Article[] = newsData?.data || [];
  const latestNews = latestNewsData || [];
  
  // Group news by category
  const getNewsByCategory = () => {
    if (!allNews.length) return {};
    
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
  
  // Get most viewed news (sort by ID for now as the API might not have a views field)
  const getMostViewedNews = () => {
    return [...allNews].slice(0, 5);
  };
  
  // Create necessary variables from the data
  const newsByCategory = getNewsByCategory();
  const mostViewedNews = getMostViewedNews();
  const mainLatestNews = allNews.slice(0, 12);

  return (
    <div className="min-h-screen flex flex-col">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="flex-1 overflow-hidden">
        {/* Featured Section with Carousel */}
        <section className="py-6 bg-gradient-to-b from-background to-muted/20">
          <div className="container">
            <h2 className="sr-only">Destaques</h2>
            <FeaturedNewsCarousel />
          </div>
        </section>

        {/* Main Content with Categories and Sidebar */}
        <div className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left sidebar */}
            <div className="lg:col-span-2">
              {/* Ad space */}
              <div className="ad-placeholder rounded-lg p-4 h-[600px] sticky top-24">
                <div className="text-center">
                  <p className="font-medium">Anúncio</p>
                  <p className="text-sm">160 x 600</p>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg mt-6">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Últimas Notícias</h3>
                <div className="space-y-3">
                  {latestNews.slice(0, 5).map((news) => (
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
                        {news.title}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-1">
                        {news.published_at && new Date(news.published_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Main content - featured articles and category sections */}
            <div className="lg:col-span-7 space-y-8">
              {/* Featured Articles in 2-column grid */}
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
              
              {/* Center ad banner */}
              <div className="ad-placeholder rounded-lg p-4 h-[120px]">
                <div className="text-center">
                  <p className="font-medium">Banner Anúncio</p>
                  <p className="text-sm">970 x 120</p>
                </div>
              </div>

              {/* Category Carousel - Full Width */}
              {Object.entries(newsByCategory).slice(0, 1).map(([category, news]) => (
                <CategoryNewsCarousel key={category} category={category} news={news} />
              ))}
              
              {/* Mixed layout section */}
              <section>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Featured Article */}
                  <div className="md:col-span-2">
                    {mainLatestNews.length > 5 && <NewsCard news={mainLatestNews[5]} />}
                  </div>
                  
                  {/* Side articles in minimal view */}
                  <div className="space-y-4">
                    {mainLatestNews.slice(6, 9).map(news => (
                      <NewsCard key={news.id} news={news} variant="minimal" />
                    ))}
                  </div>
                </div>
              </section>

              {/* Category Carousel - Another Category */}
              {Object.entries(newsByCategory).slice(1, 2).map(([category, news]) => (
                <CategoryNewsCarousel key={category} category={category} news={news} />
              ))}
              
              {/* Horizontal Articles */}
              <section>
                <h2 className="text-xl font-bold mb-4">Reportagens Especiais</h2>
                <div className="space-y-4">
                  {mainLatestNews.slice(9, 12).map(news => (
                    <NewsCard key={news.id} news={news} variant="horizontal" />
                  ))}
                </div>
              </section>
            </div>

            {/* Right sidebar - Most viewed news and ads */}
            <div className="lg:col-span-3 space-y-6">
              {/* Most viewed news */}
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
                          {news.title}
                        </Link>
                        <div className="text-xs text-muted-foreground mt-1">
                          Views
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Ad spaces */}
              <div className="ad-placeholder rounded-lg p-4 h-[250px]">
                <div className="text-center">
                  <p className="font-medium">Anúncio</p>
                  <p className="text-sm">300 x 250</p>
                </div>
              </div>
              
              {/* Newsletter signup */}
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
              
              {/* Second ad space */}
              <div className="ad-placeholder rounded-lg p-4 h-[600px]">
                <div className="text-center">
                  <p className="font-medium">Anúncio</p>
                  <p className="text-sm">300 x 600</p>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width category carousels at the bottom */}
          <div className="mt-8 space-y-8">
            <Separator />
            
            {Object.entries(newsByCategory).slice(2, 4).map(([category, news]) => (
              <CategoryNewsCarousel key={category} category={category} news={news} />
            ))}
            
            {/* Final ad banner */}
            <div className="ad-placeholder rounded-lg p-4 h-[250px]">
              <div className="text-center">
                <p className="font-medium">Banner Anúncio</p>
                <p className="text-sm">970 x 250</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
