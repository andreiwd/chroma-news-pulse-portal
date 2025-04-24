
import NewsTicker from "@/components/NewsTicker";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const newsData = [
  {
    id: 1,
    title: "Inteligência Artificial revoluciona setor de saúde",
    excerpt: "Nova tecnologia permite diagnósticos mais precisos e tratamentos personalizados",
    category: "tech",
    image: "https://source.unsplash.com/800x400/?technology,ai",
  },
  {
    id: 2,
    title: "Brasil se destaca em competição internacional",
    excerpt: "Seleção brasileira conquista título inédito em torneio mundial",
    category: "sports",
    image: "https://source.unsplash.com/800x400/?soccer,sport",
  },
  {
    id: 3,
    title: "Senado aprova nova reforma econômica",
    excerpt: "Medidas prometem impulsionar crescimento e geração de empregos",
    category: "politics",
    image: "https://source.unsplash.com/800x400/?government,politics",
  },
  {
    id: 4,
    title: "Mercado financeiro bate recorde histórico",
    excerpt: "Índices econômicos atingem maior patamar dos últimos 10 anos",
    category: "economy",
    image: "https://source.unsplash.com/800x400/?finance,market",
  },
  {
    id: 5,
    title: "Novo filme quebra recordes de bilheteria",
    excerpt: "Produção nacional supera expectativas e conquista público internacional",
    category: "entertainment",
    image: "https://source.unsplash.com/800x400/?movie,cinema",
  },
];

const getCategoryColor = (category: string) => {
  const colors = {
    tech: "text-category-tech",
    sports: "text-category-sports",
    politics: "text-category-politics",
    economy: "text-category-economy",
    entertainment: "text-category-entertainment",
  };
  return colors[category as keyof typeof colors] || "text-primary";
};

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <NewsTicker />
      <Header />
      <Navigation />
      
      <main className="flex-1 container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsData.map((news) => (
            <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle className={`${getCategoryColor(news.category)}`}>
                  {news.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {news.excerpt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
