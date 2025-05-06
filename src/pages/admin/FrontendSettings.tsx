
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import FeaturedYouTubeVideo from "@/components/FeaturedYouTubeVideo";

interface SiteSettings {
  logo: {
    url: string;
    height: number;
  };
  ogImage: {
    url: string;
    width: number;
    height: number;
  };
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  colors: {
    primary: string;
    secondary: string;
  };
  featuredYoutubeVideo: {
    url: string;
    title: string;
    showOnHome: boolean;
  };
}

export default function FrontendSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>({
    logo: {
      url: "",
      height: 60
    },
    ogImage: {
      url: "",
      width: 1200,
      height: 630
    },
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: ""
    },
    colors: {
      primary: "#1a73e8",
      secondary: "#f8f9fa"
    },
    featuredYoutubeVideo: {
      url: "",
      title: "Vídeo em Destaque",
      showOnHome: false
    }
  });

  useEffect(() => {
    // Carregar configurações salvas
    const storedSettings = localStorage.getItem('siteSettings');
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (error) {
        console.error("Error parsing stored settings:", error);
      }
    }
  }, []);

  // Generic type-safe handleInputChange function
  const handleInputChange = <K extends keyof SiteSettings>(
    section: K,
    field: keyof SiteSettings[K],
    value: string | number | boolean
  ) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // Salvar as configurações no localStorage
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    toast({
      title: "Configurações salvas",
      description: "As alterações foram aplicadas com sucesso."
    });
  };

  // Preview section for YouTube video
  const videoPreview = settings.featuredYoutubeVideo.url ? (
    <div className="mt-4 p-4 border rounded-md">
      <h4 className="text-sm font-medium mb-2">Prévia:</h4>
      <FeaturedYouTubeVideo />
    </div>
  ) : null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configurações do Frontend</h1>
      
      <Tabs defaultValue="logo" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="og-images">OG Images</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="colors">Cores</TabsTrigger>
          <TabsTrigger value="video">Vídeo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logo">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Logo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="logo-url" className="text-sm font-medium">URL do Logo</label>
                <input
                  id="logo-url"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={settings.logo.url}
                  onChange={(e) => handleInputChange('logo', 'url', e.target.value)}
                  placeholder="URL da imagem do logo"
                />
                <p className="text-xs text-gray-500">
                  Recomendado: Imagem transparente (PNG)
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="logo-height" className="text-sm font-medium">Altura do Logo (em pixels)</label>
                <input
                  id="logo-height"
                  type="number"
                  className="w-full p-2 border rounded"
                  value={settings.logo.height}
                  onChange={(e) => handleInputChange('logo', 'height', parseInt(e.target.value))}
                  min="20"
                  max="200"
                />
                <p className="text-xs text-gray-500">
                  O cabeçalho se adaptará automaticamente à altura do logo
                </p>
              </div>

              <div className="mt-4">
                <button 
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Fazer upload do logo
                </button>
                <input 
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      // Aqui você faria o upload para um servidor e obteria a URL
                      // Por enquanto, vamos simular com uma URL local
                      const fileUrl = URL.createObjectURL(e.target.files[0]);
                      handleInputChange('logo', 'url', fileUrl);
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="og-images">
          <Card>
            <CardHeader>
              <CardTitle>Imagens para Compartilhamento (OG Images)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="og-url" className="text-sm font-medium">URL da OG Image</label>
                <input
                  id="og-url"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={settings.ogImage.url}
                  onChange={(e) => handleInputChange('ogImage', 'url', e.target.value)}
                  placeholder="URL da imagem para compartilhamento"
                />
                <p className="text-xs text-gray-500">
                  Tamanho recomendado: 1200x630 pixels (proporção 1.91:1)
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="og-width" className="text-sm font-medium">Largura (pixels)</label>
                  <input
                    id="og-width"
                    type="number"
                    className="w-full p-2 border rounded"
                    value={settings.ogImage.width}
                    onChange={(e) => handleInputChange('ogImage', 'width', parseInt(e.target.value))}
                    min="600"
                    max="2000"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="og-height" className="text-sm font-medium">Altura (pixels)</label>
                  <input
                    id="og-height"
                    type="number"
                    className="w-full p-2 border rounded"
                    value={settings.ogImage.height}
                    onChange={(e) => handleInputChange('ogImage', 'height', parseInt(e.target.value))}
                    min="314"
                    max="1050"
                  />
                </div>
              </div>

              <div className="mt-4">
                <button 
                  onClick={() => document.getElementById('og-image-upload')?.click()}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Fazer upload da OG Image
                </button>
                <input 
                  id="og-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      // Aqui você faria o upload para um servidor e obteria a URL
                      const fileUrl = URL.createObjectURL(e.target.files[0]);
                      handleInputChange('ogImage', 'url', fileUrl);
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="facebook" className="text-sm font-medium">Facebook</label>
                <input
                  id="facebook"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={settings.socialLinks.facebook}
                  onChange={(e) => handleInputChange('socialLinks', 'facebook', e.target.value)}
                  placeholder="URL da página do Facebook"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="twitter" className="text-sm font-medium">Twitter</label>
                <input
                  id="twitter"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={settings.socialLinks.twitter}
                  onChange={(e) => handleInputChange('socialLinks', 'twitter', e.target.value)}
                  placeholder="URL da página do Twitter"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="instagram" className="text-sm font-medium">Instagram</label>
                <input
                  id="instagram"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={settings.socialLinks.instagram}
                  onChange={(e) => handleInputChange('socialLinks', 'instagram', e.target.value)}
                  placeholder="URL da página do Instagram"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Cores do Site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="primary-color" className="text-sm font-medium">Cor Primária</label>
                <div className="flex items-center gap-2">
                  <input
                    id="primary-color"
                    type="color"
                    className="w-12 h-10 border rounded"
                    value={settings.colors.primary}
                    onChange={(e) => handleInputChange('colors', 'primary', e.target.value)}
                  />
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded"
                    value={settings.colors.primary}
                    onChange={(e) => handleInputChange('colors', 'primary', e.target.value)}
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="secondary-color" className="text-sm font-medium">Cor Secundária</label>
                <div className="flex items-center gap-2">
                  <input
                    id="secondary-color"
                    type="color"
                    className="w-12 h-10 border rounded"
                    value={settings.colors.secondary}
                    onChange={(e) => handleInputChange('colors', 'secondary', e.target.value)}
                  />
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded"
                    value={settings.colors.secondary}
                    onChange={(e) => handleInputChange('colors', 'secondary', e.target.value)}
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle>Vídeo em Destaque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="video-url" className="text-sm font-medium">URL do Vídeo do YouTube</label>
                <input
                  id="video-url"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={settings.featuredYoutubeVideo.url}
                  onChange={(e) => handleInputChange('featuredYoutubeVideo', 'url', e.target.value)}
                  placeholder="Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                />
                <p className="text-xs text-gray-500">
                  Cole a URL completa do vídeo do YouTube que deseja exibir
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="video-title" className="text-sm font-medium">Título do Vídeo</label>
                <input
                  id="video-title"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={settings.featuredYoutubeVideo.title}
                  onChange={(e) => handleInputChange('featuredYoutubeVideo', 'title', e.target.value)}
                  placeholder="Título do vídeo"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  id="show-video"
                  type="checkbox"
                  checked={settings.featuredYoutubeVideo.showOnHome}
                  onChange={(e) => handleInputChange('featuredYoutubeVideo', 'showOnHome', e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="show-video" className="text-sm font-medium">
                  Exibir vídeo na página inicial
                </label>
              </div>

              {videoPreview}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <button 
          onClick={handleSaveSettings}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}
