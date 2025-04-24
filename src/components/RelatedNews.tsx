
import { NewsArticle } from "@/data/newsData";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface RelatedNewsProps {
  articles: NewsArticle[];
}

export default function RelatedNews({ articles }: RelatedNewsProps) {
  return (
    <div className="bg-muted/30 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-4">Notícias Relacionadas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <div className="flex">
              <div className="w-1/3">
                <img src={article.image} alt={article.title} className="h-full w-full object-cover rounded-l-lg" />
              </div>
              <div className="w-2/3">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium line-clamp-2" style={{ color: `var(--category-${article.category})` }}>
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <a 
                    href={`/news/${article.id}`}
                    className="text-xs text-primary hover:underline"
                  >
                    Leia mais
                  </a>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
