
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchNews } from "@/hooks/useNews";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  
  const query = searchParams.get("q") || "";
  const { data: searchResults, isLoading } = useSearchNews(query, currentPage);

  useEffect(() => {
    setSearchInput(query);
    setCurrentPage(1);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const articles = searchResults?.data || [];
  const totalPages = searchResults?.last_page || 1;

  return (
    <div className="min-h-screen flex flex-col bg-background" lang="pt-BR">
      <Header />
      <Navigation />
      
      <main className="flex-1">
        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-foreground">
              {query ? `Resultados para: "${query}"` : "Buscar Notícias"}
            </h1>
            
            <form onSubmit={handleSearch} className="relative mb-8">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Digite sua busca..."
                className="pl-10 py-3 text-lg"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-2"
                disabled={!searchInput.trim()}
              >
                Buscar
              </Button>
            </form>

            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-foreground">Buscando notícias...</p>
              </div>
            )}

            {!isLoading && query && (
              <div className="mb-6">
                <p className="text-muted-foreground">
                  {articles.length > 0 
                    ? `${articles.length} resultado(s) encontrado(s)` 
                    : "Nenhum resultado encontrado"
                  }
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {articles.length > 0 ? (
                  <div className="grid gap-6">
                    {articles.map((article) => (
                      <NewsCard 
                        key={article.id} 
                        news={article} 
                        variant="horizontal"
                      />
                    ))}
                  </div>
                ) : query && !isLoading ? (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Nenhum resultado encontrado</h3>
                    <p className="text-muted-foreground mb-6">
                      Tente usar palavras-chave diferentes ou verifique a ortografia.
                    </p>
                  </div>
                ) : null}

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <span className="px-4 py-2 text-sm text-muted-foreground">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <AdPlaceholder size="rectangle" id="search-ad-1" />
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="font-semibold mb-4 text-card-foreground">Dicas de Busca</h3>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Use palavras-chave específicas</li>
                    <li>• Tente sinônimos</li>
                    <li>• Verifique a ortografia</li>
                    <li>• Use termos mais gerais</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
