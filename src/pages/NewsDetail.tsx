import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import NewsTicker from "@/components/NewsTicker";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import RelatedNews from "@/components/RelatedNews";
import { useNewsDetail, useNews } from "@/hooks/useNews";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function NewsDetail() {
  const { id } = useParams();
  const { data: article, isLoading, error } = useNewsDetail(id || "");
  const { data: relatedNewsData } = useNews(1, article?.category?.slug || "", "");
  
  const relatedArticles = relatedNewsData?.data?.filter(item => item.id !== article?.id)?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NewsTicker />
        <Header />
        <Navigation />
        <main className="container py-6">
          <div className="max-w-4xl mx-auto mt-4">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-[400px] w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <NewsTicker />
        <Header />
        <Navigation />
        <main className="container py-10 text-center">
          <h1 className="text-2xl font-bold">Notícia não encontrada</h1>
          <p className="mt-4">A notícia que você está procurando não existe ou foi removida.</p>
          <Button className="mt-6" asChild>
            <Link to="/">Voltar para a página inicial</Link>
          </Button>
        </main>
      </div>
    );
  }

  const publishedDate = article.published_at ? 
    new Date(article.published_at) : null;

  const formattedDate = publishedDate ? 
    formatDistanceToNow(publishedDate, { addSuffix: true, locale: ptBR }) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="container py-6">
        <Breadcrumbs 
          items={[
            { label: article.category?.name || "Categorias", href: `/category/${article.category?.slug}` },
            { label: article.title }
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left sidebar ad */}
          <aside className="hidden lg:block lg:col-span-2">
            <AdPlaceholder 
              size="sidebar"
              id="ad-news-left-sidebar"
              className="sticky top-24"
              height={600}
            />
          </aside>

          {/* Main article content */}
          <article className="lg:col-span-8">
            <header className="mb-6">
              <span 
                className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-3"
                style={{ 
                  backgroundColor: `${article.category?.color}20` || `var(--category-${article.category?.slug}-light)`,
                  color: article.category?.color || `var(--category-${article.category?.slug})`
                }}
              >
                {article.category?.name}
              </span>
              
              <h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                style={{ color: article.category?.color || `var(--category-${article.category?.slug})` }}
              >
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                {formattedDate && <span>{formattedDate}</span>}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {article.tags?.map(tag => (
                    <Badge key={tag.id} variant="outline">{tag.name}</Badge>
                  ))}
                </div>
                
                <Button variant="outline" size="sm" 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: article.title,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      // Would add a toast notification here
                    }
                  }}
                >
                  <Share className="h-4 w-4 mr-2" /> Compartilhar
                </Button>
              </div>
            </header>
            
            <figure className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={article.featured_image} 
                alt={article.title} 
                className="w-full h-auto max-h-[500px] object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://placehold.co/800x450/333/white?text=News";
                }}
              />
            </figure>

            {/* Ad banner before content */}
            <AdPlaceholder 
              size="banner"
              id="ad-news-before-content"
              className="mb-8"
            />
            
            <div className="prose prose-lg max-w-none">
              <p className="lead text-xl mb-6">{article.excerpt}</p>
              
              <div 
                dangerouslySetInnerHTML={{ __html: article.content }} 
                className="text-justify"
              />
            </div>

            {/* Ad banner after content */}
            <AdPlaceholder 
              size="banner"
              id="ad-news-after-content"
              className="mt-8 mb-8"
            />
          </article>

          {/* Right sidebar */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              <AdPlaceholder 
                size="rectangle"
                id="ad-news-right-sidebar-1"
              />

              <AdPlaceholder 
                size="rectangle"
                id="ad-news-right-sidebar-2"
                className="mt-6"
              />
            </div>
          </aside>
        </div>
        
        <section className="mt-12">
          <RelatedNews articles={relatedArticles} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
