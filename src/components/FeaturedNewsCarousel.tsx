
import { Card, CardContent } from "./ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useNews } from "@/hooks/useNews";
import { Skeleton } from "./ui/skeleton";
import { Article } from "@/types/api";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function FeaturedNewsCarousel() {
  const { data: newsData, isLoading } = useNews(1, "", "");
  
  const featuredNews: Article[] = newsData?.data?.slice(0, 4) || [];
  
  console.log("Featured news data:", featuredNews);

  if (isLoading) {
    return (
      <div className="w-full mb-6 relative overflow-hidden rounded-xl p-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="lg:col-span-1">
              <div className="grid grid-cols-1 gap-4 h-full">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!featuredNews.length) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="mb-6 relative overflow-hidden rounded-xl p-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Article Carousel */}
            <div className="lg:col-span-2">
              <Carousel>
                <CarouselContent>
                  {featuredNews.map((article, index) => (
                    <CarouselItem key={article?.id || index}>
                      <div className="relative overflow-hidden rounded-lg h-[400px]">
                        <Link to={`/news/${article?.slug}`} className="block h-full">
                          <img
                            src={article?.featured_image || "https://placehold.co/800x450/333/white?text=Featured+News"}
                            alt={article?.title || "Featured news"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = "https://placehold.co/800x450/333/white?text=Featured+News";
                            }}
                          />
                          {/* Text overlay on top of the image */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6">
                            {article?.category && (
                              <span 
                                className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-3"
                                style={{ 
                                  backgroundColor: article?.category?.color || '#333',
                                  color: article?.category?.text_color || '#fff'
                                }}
                              >
                                {article?.category?.name || "Sem categoria"}
                              </span>
                            )}
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                              {article?.title || "Notícia sem título"}
                            </h2>
                            <p className="text-white/80 mb-4 line-clamp-2">
                              {article?.excerpt || "Sem descrição disponível"}
                            </p>
                            <Button variant="secondary" size="sm" asChild>
                              <Link to={`/news/${article?.slug}`}>
                                Leia mais <ArrowRight className="h-3 w-3 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </Link>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>

            {/* Thumbnails */}
            <div className="lg:col-span-1">
              <div className="grid grid-cols-1 gap-4 h-full">
                {featuredNews.map((article, index) => (
                  <Link 
                    key={article?.id || index}
                    to={`/news/${article?.slug}`}
                    className={cn(
                      "w-full text-left transition-all duration-300 hover:bg-muted/50 rounded-lg p-2 flex items-center",
                    )}
                  >
                    <div className="flex gap-3 items-center w-full">
                      <img
                        src={article?.featured_image || "https://placehold.co/100x100/333/white?text=News"}
                        alt={article?.title || "News image"}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "https://placehold.co/100x100/333/white?text=News";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        {article?.category && (
                          <span 
                            className="text-xs font-medium px-2 py-1 rounded-full inline-block mb-2"
                            style={{ 
                              backgroundColor: article?.category?.color || '#333',
                              color: article?.category?.text_color || '#fff'
                            }}
                          >
                            {article?.category?.name || "Sem categoria"}
                          </span>
                        )}
                        <h3 
                          className="text-sm font-medium line-clamp-2"
                          style={{ color: article?.category?.color || 'inherit' }}
                        >
                          {article?.title || "Notícia sem título"}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
