
import NewsTicker from "@/components/NewsTicker";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import FeaturedNewsCarousel from "@/components/FeaturedNewsCarousel";
import NewsCard from "@/components/NewsCard";
import newsData from "@/data/newsData";

// Group news by category
const getNewsByCategory = () => {
  const categories = [...new Set(newsData.map(item => item.category))];
  const newsByCategory: Record<string, typeof newsData> = {};
  
  categories.forEach(category => {
    newsByCategory[category] = newsData
      .filter(news => news.category === category)
      .sort((a, b) => {
        // Sort by date if available
        if (a.publishedAt && b.publishedAt) {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        }
        return 0;
      })
      .slice(0, 4); // Limit to 4 news items per category
  });
  
  return newsByCategory;
};

// Get breaking news or highlighted news
const getHighlightedNews = () => {
  return newsData
    .filter(item => item.isBreaking || item.isHighlight)
    .sort((a, b) => {
      // Prioritize breaking news
      if (a.isBreaking && !b.isBreaking) return -1;
      if (!a.isBreaking && b.isBreaking) return 1;
      return 0;
    })
    .slice(0, 6);
};

// Get most viewed news
const getMostViewedNews = () => {
  return [...newsData]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);
};

const getCategoryColor = (category: string) => {
  const colors = {
    tech: "text-category-tech",
    sports: "text-category-sports",
    politics: "text-category-politics",
    economy: "text-category-economy",
    entertainment: "text-category-entertainment",
    science: "text-category-science",
    health: "text-category-health",
    environment: "text-category-environment",
  };
  return colors[category as keyof typeof colors] || "text-primary";
};

export default function Index() {
  const highlightedNews = getHighlightedNews();
  const mostViewedNews = getMostViewedNews();
  const newsByCategory = getNewsByCategory();
  
  return (
    <div className="min-h-screen flex flex-col">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="flex-1">
        <section className="container py-6">
          <h2 className="text-2xl font-bold mb-4">Destaques</h2>
          <FeaturedNewsCarousel highlightedNews={highlightedNews} />
        </section>
        
        <div className="container py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main content */}
            <div className="flex-1">
              {Object.entries(newsByCategory).map(([category, news]) => (
                <section key={category} className="mb-12" id={category}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 
                      className={`text-xl font-bold ${getCategoryColor(category)}`}
                      style={{ color: `var(--category-${category})` }}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h2>
                    <a 
                      href={`/category/${category}`} 
                      className="text-sm hover:underline"
                      style={{ color: `var(--category-${category})` }}
                    >
                      Ver mais
                    </a>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {news.map((item) => (
                      <NewsCard key={item.id} news={item} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
            
            {/* Sidebar - Most viewed news */}
            <div className="lg:w-80 space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Mais Lidas</h3>
                <div className="space-y-4">
                  {mostViewedNews.map((news, index) => (
                    <div key={news.id} className="flex gap-3">
                      <div className="text-2xl font-bold text-muted-foreground w-8">
                        {index + 1}
                      </div>
                      <div>
                        <a 
                          href={`/news/${news.id}`}
                          className="font-medium hover:underline line-clamp-2"
                          style={{ color: `var(--category-${news.category})` }}
                        >
                          {news.title}
                        </a>
                        <div className="text-xs text-muted-foreground mt-1">
                          {news.views?.toLocaleString()} visualizações
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Ad space or newsletter signup could go here */}
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
