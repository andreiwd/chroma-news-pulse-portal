
import { useEffect, useState } from 'react';
import { Youtube } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface FeaturedVideoProps {
  className?: string;
}

interface VideoConfig {
  id: string;
  url: string;
  title: string;
  showOnHome: boolean;
  order: number;
}

export default function FeaturedYouTubeVideo({ className = "" }: FeaturedVideoProps) {
  const [videos, setVideos] = useState<VideoConfig[]>([]);
  const [accentColor, setAccentColor] = useState("#9b87f5");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoConfig | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Carregar configurações salvas
    const storedSettings = localStorage.getItem('siteSettings');
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        if (settings.youtubeVideos && Array.isArray(settings.youtubeVideos)) {
          const visibleVideos = settings.youtubeVideos
            .filter((video: VideoConfig) => video.showOnHome)
            .sort((a: VideoConfig, b: VideoConfig) => a.order - b.order);
          setVideos(visibleVideos);
        }
        if (settings.youtubeAccentColor) {
          setAccentColor(settings.youtubeAccentColor);
        }
      } catch (error) {
        console.error("Error parsing site settings:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Se não houver vídeos configurados ou isLoading, não renderizar nada
  if (isLoading || videos.length === 0) {
    return null;
  }

  // Função para extrair ID do vídeo do YouTube
  const getYoutubeVideoId = (url: string): string => {
    if (!url) return ''; 
    
    try {
      // Detecta vários formatos de URL do YouTube
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = String(url).match(regExp);
      
      return match && match[2].length === 11 ? match[2] : '';
    } catch (error) {
      return '';
    }
  };

  // Função para obter o link da miniatura
  const getThumbnailUrl = (url: string): string => {
    const videoId = getYoutubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
  };

  // Função para obter o link de incorporação
  const getEmbedUrl = (url: string): string => {
    const videoId = getYoutubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';
  };

  // Abrir modal com o vídeo selecionado
  const openVideoModal = (video: VideoConfig) => {
    setSelectedVideo(video);
    setIsDialogOpen(true);
  };

  return (
    <section 
      className={`py-4 relative ${className}`}
      style={{ backgroundColor: accentColor, maxHeight: '200px' }}
    >
      <div className="container">
        <div className="relative">
          {/* Badge centralizada */}
          <Badge 
            className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-0 z-10 py-1.5 px-3 bg-white/90 text-black flex items-center gap-1.5"
            variant="outline"
          >
            <Youtube size={16} className="text-red-500" />
            <span className="font-medium">Vídeos em Destaque</span>
          </Badge>

          {/* Carrossel de miniaturas */}
          <div className="pt-4">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {videos.map((video) => (
                  <CarouselItem 
                    key={video.id} 
                    className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                  >
                    <div 
                      className="relative cursor-pointer group overflow-hidden rounded-md shadow-md"
                      onClick={() => openVideoModal(video)}
                    >
                      <div className="aspect-video w-full bg-black overflow-hidden">
                        <img 
                          src={getThumbnailUrl(String(video.url))} 
                          alt={String(video.title)} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Youtube size={40} className="text-white" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-xs text-white font-medium line-clamp-1">
                          {String(video.title || "")}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-1" />
              <CarouselNext className="right-1" />
            </Carousel>
          </div>
        </div>
      </div>

      {/* Modal de vídeo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
            <DialogClose className="absolute right-4 top-4" />
          </DialogHeader>
          <div className="aspect-video w-full p-4">
            {selectedVideo && (
              <iframe
                src={getEmbedUrl(String(selectedVideo.url))}
                title={String(selectedVideo.title)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-md"
              ></iframe>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
