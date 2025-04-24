
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import NewsTicker from "@/components/NewsTicker";
import Breadcrumbs from "@/components/Breadcrumbs";
import newsData from "@/data/newsData";
import { Badge } from "@/components/ui/badge";
import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import RelatedNews from "@/components/RelatedNews";
import { useMemo } from "react";

export default function NewsDetail() {
  const { id } = useParams();
  const article = newsData.find(news => news.id === Number(id));
  
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    
    // Find articles with the same category or tags
    return newsData
      .filter(news => 
        news.id !== article.id && 
        (news.category === article.category || 
         (article.tags && news.tags && news.tags.some(tag => article.tags?.includes(tag))))
      )
      .slice(0, 4);
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <NewsTicker />
        <Header />
        <Navigation />
        <main className="container py-10 text-center">
          <h1 className="text-2xl font-bold">Notícia não encontrada</h1>
          <p className="mt-4">A notícia que você está procurando não existe ou foi removida.</p>
          <Button className="mt-6" asChild>
            <a href="/">Voltar para a página inicial</a>
          </Button>
        </main>
      </div>
    );
  }

  const publishedDate = article.publishedAt ? 
    new Date(article.publishedAt).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="container py-6">
        <Breadcrumbs 
          items={[
            { label: article.category.charAt(0).toUpperCase() + article.category.slice(1), href: `/category/${article.category}` },
            { label: article.title }
          ]}
        />
        
        <article className="max-w-4xl mx-auto mt-4">
          <header className="mb-6">
            {article.isBreaking && (
              <Badge variant="destructive" className="mb-4 animate-pulse">
                ÚLTIMA HORA
              </Badge>
            )}
            
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: `var(--category-${article.category})` }}
            >
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              {article.author && <span>Por <strong>{article.author}</strong></span>}
              {publishedDate && <span>{publishedDate}</span>}
              {article.views && <span>{article.views.toLocaleString()} visualizações</span>}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {article.tags?.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
              
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" /> Compartilhar
              </Button>
            </div>
          </header>
          
          <figure className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-auto max-h-[500px] object-cover"
            />
            <figcaption className="text-sm text-muted-foreground p-2 bg-muted/20">
              {article.title}
            </figcaption>
          </figure>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl mb-6">{article.excerpt}</p>
            
            {article.content?.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </article>
        
        <section className="max-w-4xl mx-auto mt-12">
          <RelatedNews articles={relatedArticles} />
        </section>
      </main>
    </div>
  );
}
