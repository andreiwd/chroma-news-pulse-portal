
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseConfig } from "@/hooks/useSupabaseConfig";

interface SiteSettings {
  logo: {
    url: string;
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

export default function FrontendSettings() {
  const { toast } = useToast();
  const { getConfig, setConfig, loading } = useSupabaseConfig();
  const [settings, setSettings] = useState<SiteSettings>({
    logo: {
      url: '',
      height: 60
    },
    socialLinks: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com'
    },
    colors: {
      primary: '#1a73e8',
      secondary: '#f8f9fa'
    }
  });

  // Load settings from Supabase
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const config = await getConfig('frontend_settings');
        if (config) {
          const typedConfig = config as unknown as SiteSettings;
          setSettings({
            logo: {
              url: typedConfig.logo?.url || '',
              height: typedConfig.logo?.height || 60
            },
            socialLinks: {
              facebook: typedConfig.socialLinks?.facebook || 'https://facebook.com',
              twitter: typedConfig.socialLinks?.twitter || 'https://twitter.com',
              instagram: typedConfig.socialLinks?.instagram || 'https://instagram.com'
            },
            colors: {
              primary: typedConfig.colors?.primary || '#1a73e8',
              secondary: typedConfig.colors?.secondary || '#f8f9fa'
            }
          });
        }
      } catch (error) {
        console.error("Error loading frontend settings:", error);
      }
    };

    loadSettings();
  }, [getConfig]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      logo: {
        ...prev.logo,
        [name]: name === 'height' ? Number(value) : value
      }
    }));
  };

  const handleSocialLinksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };

  const handleColorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [name]: value
      }
    }));
    
    // Apply color immediately to CSS variables for preview
    if (name === 'primary') {
      document.documentElement.style.setProperty('--primary', value);
    } else if (name === 'secondary') {
      document.documentElement.style.setProperty('--secondary', value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await setConfig('frontend_settings', settings);
    
    if (success) {
      toast({
        title: "Configurações salvas",
        description: "As configurações do frontend foram salvas com sucesso.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Frontend</h1>
        <p className="text-muted-foreground">
          Personalize a aparência e configurações visuais do site
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Logo</CardTitle>
            <CardDescription>
              Configure o logo que será exibido no cabeçalho do site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo-url">URL do Logo</Label>
              <Input
                id="logo-url"
                name="url"
                type="url"
                value={settings.logo.url}
                onChange={handleLogoChange}
                placeholder="https://exemplo.com/logo.png"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo-height">Altura do Logo (px)</Label>
              <Input
                id="logo-height"
                name="height"
                type="number"
                min="20"
                max="200"
                value={settings.logo.height}
                onChange={handleLogoChange}
                placeholder="60"
              />
            </div>
            {settings.logo.url && (
              <div className="mt-4">
                <Label>Preview:</Label>
                <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                  <img 
                    src={settings.logo.url} 
                    alt="Logo preview" 
                    style={{ height: `${settings.logo.height}px` }}
                    className="w-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Cores</CardTitle>
            <CardDescription>
              Personalize as cores principais do tema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Cor Primária</Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  name="primary"
                  type="color"
                  value={settings.colors.primary}
                  onChange={handleColorsChange}
                  className="w-20 h-10"
                />
                <Input
                  name="primary"
                  type="text"
                  value={settings.colors.primary}
                  onChange={handleColorsChange}
                  placeholder="#1a73e8"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Cor Secundária</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary-color"
                  name="secondary"
                  type="color"
                  value={settings.colors.secondary}
                  onChange={handleColorsChange}
                  className="w-20 h-10"
                />
                <Input
                  name="secondary"
                  type="text"
                  value={settings.colors.secondary}
                  onChange={handleColorsChange}
                  placeholder="#f8f9fa"
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
            <CardDescription>
              Configure os links das redes sociais que aparecerão no cabeçalho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                name="facebook"
                type="url"
                value={settings.socialLinks.facebook}
                onChange={handleSocialLinksChange}
                placeholder="https://facebook.com/seusite"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter/X</Label>
              <Input
                id="twitter"
                name="twitter"
                type="url"
                value={settings.socialLinks.twitter}
                onChange={handleSocialLinksChange}
                placeholder="https://twitter.com/seusite"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                name="instagram"
                type="url"
                value={settings.socialLinks.instagram}
                onChange={handleSocialLinksChange}
                placeholder="https://instagram.com/seusite"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : "Salvar Todas as Configurações"}
        </Button>
      </form>
    </div>
  );
}
