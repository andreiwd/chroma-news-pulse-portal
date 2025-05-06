
import { useEffect, useState } from 'react';

interface FeaturedVideoProps {
  className?: string;
}

interface VideoConfig {
  url: string;
  title: string;
  showOnHome: boolean;
}

export default function FeaturedYouTubeVideo({ className = "" }: FeaturedVideoProps) {
  const [videoConfig, setVideoConfig] = useState<VideoConfig>({
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Default video (for testing)
    title: "Vídeo em Destaque",
    showOnHome: true
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar configurações salvas
    const storedSettings = localStorage.getItem('siteSettings');
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        if (settings.featuredYoutubeVideo) {
          setVideoConfig(settings.featuredYoutubeVideo);
        }
      } catch (error) {
        console.error("Error parsing site settings:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Se não houver vídeo configurado ou não estiver ativo, não renderizar nada
  if (isLoading) {
    return null;
  }

  // Use a default video if none is configured but showOnHome is true
  const shouldShowVideo = videoConfig.showOnHome;
  if (!shouldShowVideo) {
    return null;
  }

  // Função para extrair ID do vídeo do YouTube
  const getYoutubeEmbedUrl = (url: string): string => {
    if (!url) return 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Default fallback
    
    // Se já for uma URL de incorporação, retorne-a
    if (url.includes('youtube.com/embed/')) return url;
    
    try {
      // Detecta vários formatos de URL do YouTube
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      
      return match && match[2].length === 11
        ? `https://www.youtube.com/embed/${match[2]}`
        : 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Default fallback
    } catch (error) {
      return 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Default fallback
    }
  };

  const videoTitle = String(videoConfig.title || "Vídeo em Destaque");
  const videoUrl = getYoutubeEmbedUrl(String(videoConfig.url || ""));

  return (
    <section className={`py-6 ${className}`}>
      <div className="container">
        <h2 className="text-2xl font-bold mb-4">{videoTitle}</h2>
        <div className="rounded-lg overflow-hidden shadow-md">
          <div className="aspect-video w-full">
            <iframe
              src={videoUrl}
              title={videoTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
