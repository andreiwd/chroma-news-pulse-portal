
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseConfig } from "@/hooks/useSupabaseConfig";

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
}

const defaultSettings: SiteSettings = {
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
  }
};

export default function FrontendSettings() {
  const { toast } = useToast();
  const { getConfig, setConfig, loading } = useSupabaseConfig();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getConfig('frontend_settings');
        if (config) {
          // Safely merge with defaults to ensure all properties exist
          const savedSettings = config as unknown as Partial<SiteSettings>;
          setSettings({
            logo: { ...defaultSettings.logo, ...savedSettings.logo },
            ogImage: { ...defaultSettings.ogImage, ...savedSettings.ogImage },
            socialLinks: { ...defaultSettings.socialLinks, ...savedSettings.socialLinks },
            colors: { ...defaultSettings.colors, ...savedSettings.colors }
          });
        }
      } catch (error) {
        console.error("Error loading frontend settings:", error);
      }
    };

    loadConfig();
  }, [getConfig]);

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

  const handleSaveSettings = async () => {
    const success = await setConfig('frontend_settings', settings);
    if (success) {
      toast({
        title: "Configurações salvas",
        description: "As alterações foram aplicadas com sucesso."
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configurações do Frontend</h1>
      
      <Tabs defaultValue="logo" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="og-images">OG Images</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="colors">Cores</TabsTrigger>
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
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <button 
          onClick={handleSaveSettings}
          disabled={loading}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </div>
  );
}
