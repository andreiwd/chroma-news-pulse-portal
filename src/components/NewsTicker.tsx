
import { useLatestNews } from "@/hooks/useNews";

export default function NewsTicker() {
  const { data: latestNews, isLoading } = useLatestNews();
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  
  useEffect(() => {
    if (!latestNews?.data?.length) return;
    
    const timer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % latestNews.data.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [latestNews?.data?.length]);

  return (
    <div className="bg-gradient-to-r from-primary/90 to-primary py-2 text-white">
      <div className="container flex items-center space-x-4 overflow-hidden">
        <span className="font-semibold whitespace-nowrap">Últimas Notícias:</span>
        <div className="overflow-hidden h-6">
          {isLoading ? (
            <p className="animate-pulse">Carregando notícias...</p>
          ) : latestNews?.data?.length ? (
            <p
              key={currentNewsIndex}
              className="animate-[tickerFade_4s_ease-in-out_infinite]"
            >
              {latestNews.data[currentNewsIndex]?.title}
            </p>
          ) : (
            <p>Nenhuma notícia encontrada</p>
          )}
        </div>
      </div>
    </div>
  );
}
