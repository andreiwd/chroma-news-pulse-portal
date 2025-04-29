
import { Article } from "@/types/api";
import NewsCard from "@/components/NewsCard";

interface MainNewsGridProps {
  mainLatestNews: Article[];
}

export default function MainNewsGrid({ mainLatestNews }: MainNewsGridProps) {
  return (
    <>
      <section>
        <h2 className="text-2xl font-bold mb-4">Principais Notícias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mainLatestNews.slice(0, 4).map((article, index) => {
            if (!article) return null;
            
            return (
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
            );
          })}
        </div>
      </section>
      
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {mainLatestNews.length > 5 && mainLatestNews[5] && <NewsCard news={mainLatestNews[5]} />}
          </div>
          
          <div className="space-y-4">
            {mainLatestNews.slice(6, 9).map(news => {
              if (!news) return null;
              return <NewsCard key={news.id} news={news} variant="minimal" />;
            })}
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-bold mb-4">Reportagens Especiais</h2>
        <div className="space-y-4">
          {mainLatestNews.slice(9, 12).map(news => {
            if (!news) return null;
            return <NewsCard key={news.id} news={news} variant="horizontal" />;
          })}
        </div>
      </section>
    </>
  );
}
