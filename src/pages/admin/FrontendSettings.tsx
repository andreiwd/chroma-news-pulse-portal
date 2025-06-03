
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseConfig } from "@/hooks/useSupabaseConfig";
import { Upload, X } from "lucide-react";

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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  // Load settings from Supabase
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const config = await getConfig('frontend_settings');
        if (config) {
          const configData = config as any;
          setSettings({
            logo: {
              url: configData.logo?.url || '',
              height: Number(configData.logo?.height) || 60
            },
            socialLinks: {
              facebook: configData.socialLinks?.facebook || 'https://facebook.com',
              twitter: configData.socialLinks?.twitter || 'https://twitter.com',
              instagram: configData.socialLinks?.instagram || 'https://instagram.com'
            },
            colors: {
              primary: configData.colors?.primary || '#1a73e8',
              secondary: configData.colors?.secondary || '#f8f9fa'
            }
          });
          if (configData.logo?.url) {
            setLogoPreview(configData.logo.url);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };

    loadSettings();
  }, [getConfig]);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setSettings(prev => ({
          ...prev,
          logo: {
            ...prev.logo,
            url: result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setSettings(prev => ({
      ...prev,
      logo: {
        ...prev.logo,
        url: ''
      }
    }));
  };

  const updateLogoUrl = (url: string) => {
    setSettings(prev => ({
      ...prev,
      logo: {
        ...prev.logo,
        url: url
      }
    }));
    setLogoPreview(url);
  };

  const updateLogoHeight = (height: number) => {
    setSettings(prev => ({
      ...prev,
      logo: {
        ...prev.logo,
        height: height
      }
    }));
  };

  const updateSocialLink = (platform: keyof SiteSettings['socialLinks'], url: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: url
      }
    }));
  };

  const updateColor = (colorType: keyof SiteSettings['colors'], color: string) => {
    setSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: color
      }
    }));
    
    // Apply color immediately to preview
    document.documentElement.style.setProperty(`--${colorType}`, color);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await setConfig('frontend_settings', settings);
      
      if (success) {
        toast({
          title: "Configurações salvas",
          description: "As configurações foram salvas com sucesso!",
        });
        
        // Apply colors to CSS variables
        document.documentElement.style.setProperty('--primary', settings.colors.primary);
        document.documentElement.style.setProperty('--secondary', settings.colors.secondary);
        
        // Reload page after a short delay to ensure changes are applied
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Site</h1>
        <p className="text-muted-foreground mt-2">
          Personalize a aparência e configurações visuais do seu site
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Logo do Site</CardTitle>
            <CardDescription>
              Faça upload ou cole a URL do logo que será exibido no cabeçalho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="space-y-4">
              <Label htmlFor="logo-upload">Upload de Logo</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button type="button" variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Escolher Arquivo
                  </Button>
                </div>
                {logoPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeLogo}
                    className="flex items-center gap-2 text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                    Remover
                  </Button>
                )}
              </div>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="logo-url">Ou cole a URL do Logo</Label>
              <Input
                id="logo-url"
                type="url"
                value={settings.logo.url}
                onChange={(e) => updateLogoUrl(e.target.value)}
                placeholder="https://exemplo.com/logo.png"
                className="w-full"
              />
            </div>
            
            {/* Height Input */}
            <div className="space-y-2">
              <Label htmlFor="logo-height">Altura do Logo (pixels)</Label>
              <Input
                id="logo-height"
                type="number"
                min="20"
                max="200"
                value={settings.logo.height}
                onChange={(e) => updateLogoHeight(Number(e.target.value))}
                placeholder="60"
                className="w-full max-w-[200px]"
              />
            </div>

            {/* Logo Preview */}
            {logoPreview && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                <Label className="text-sm font-medium block mb-2">Preview do Logo:</Label>
                <img 
                  src={logoPreview} 
                  alt="Preview do logo" 
                  style={{ height: `${settings.logo.height}px` }}
                  className="w-auto max-w-full border rounded"
                  onError={() => {
                    toast({
                      title: "Erro",
                      description: "Não foi possível carregar a imagem do logo.",
                      variant: "destructive",
                    });
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Cores do Tema</CardTitle>
            <CardDescription>
              Personalize as cores principais do seu site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="primary-color">Cor Primária</Label>
                <div className="flex gap-3 items-center">
                  <input
                    id="primary-color"
                    type="color"
                    value={settings.colors.primary}
                    onChange={(e) => updateColor('primary', e.target.value)}
                    className="w-12 h-10 rounded border border-input cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={settings.colors.primary}
                    onChange={(e) => updateColor('primary', e.target.value)}
                    placeholder="#1a73e8"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="secondary-color">Cor Secundária</Label>
                <div className="flex gap-3 items-center">
                  <input
                    id="secondary-color"
                    type="color"
                    value={settings.colors.secondary}
                    onChange={(e) => updateColor('secondary', e.target.value)}
                    className="w-12 h-10 rounded border border-input cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={settings.colors.secondary}
                    onChange={(e) => updateColor('secondary', e.target.value)}
                    placeholder="#f8f9fa"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
            <CardDescription>
              Configure os links das redes sociais que aparecem no cabeçalho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                type="url"
                value={settings.socialLinks.facebook}
                onChange={(e) => updateSocialLink('facebook', e.target.value)}
                placeholder="https://facebook.com/seusite"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter/X</Label>
              <Input
                id="twitter"
                type="url"
                value={settings.socialLinks.twitter}
                onChange={(e) => updateSocialLink('twitter', e.target.value)}
                placeholder="https://twitter.com/seusite"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                type="url"
                value={settings.socialLinks.instagram}
                onChange={(e) => updateSocialLink('instagram', e.target.value)}
                placeholder="https://instagram.com/seusite"
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full py-6 text-lg font-semibold"
          size="lg"
        >
          {loading ? "Salvando..." : "Salvar Todas as Configurações"}
        </Button>
      </form>
    </div>
  );
}
