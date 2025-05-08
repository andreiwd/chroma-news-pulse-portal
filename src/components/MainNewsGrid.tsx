
import { Article } from "@/types/api";
import NewsCard from "@/components/NewsCard";
import { Link } from "react-router-dom";

interface MainNewsGridProps {
  mainLatestNews: Article[];
}

export default function MainNewsGrid({ mainLatestNews }: MainNewsGridProps) {
  if (!mainLatestNews || mainLatestNews.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* Top Grid Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4 pb-2 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">Últimas Notícias</h2>
          <Link to="/news" className="text-sm text-primary hover:underline">Ver todas</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mainLatestNews.slice(0, 4).map((article, index) => {
            if (!article) return null;
            
            return (
              <div 
                key={article.id || `main-grid-${index}`}
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
    </div>
  );
}
