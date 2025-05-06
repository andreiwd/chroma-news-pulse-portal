import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Image, Link as LinkIcon, Layout } from "lucide-react";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo: string;
  favicon: string;
  keywords: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
  header: {
    showSearch: boolean;
    showSocialLinks: boolean;
    transparentOnHome: boolean;
  };
  footer: {
    showNewsletter: boolean;
    copyrightText: string;
    showSocialLinks: boolean;
  };
}

export default function FrontendSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Taquaritinga Notícias",
    siteDescription: "Portal de notícias de Taquaritinga e região",
    primaryColor: "#3b82f6",
    secondaryColor: "#1d4ed8",
    accentColor: "#f97316",
    logo: "/logo.png",
    favicon: "/favicon.ico",
    keywords: "notícias, taquaritinga, jornalismo, informação",
    socialLinks: {
      facebook: "https://facebook.com/taquaritinganoticias",
      twitter: "https://twitter.com/tqnoticias",
      instagram: "https://instagram.com/taquaritinganoticias",
      youtube: "https://youtube.com/taquaritinganoticias"
    },
    header: {
      showSearch: true,
      showSocialLinks: true,
      transparentOnHome: false
    },
    footer: {
      showNewsletter: true,
      copyrightText: "© 2025 Taquaritinga Notícias. Todos os direitos reservados.",
      showSocialLinks: true
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Lidar com inputs aninhados (usando a notação dot)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      if (parent === 'socialLinks') {
        setSettings({
          ...settings,
          socialLinks: {
            ...settings.socialLinks,
            [child]: value
          }
        });
      } else if (parent === 'header') {
        setSettings({
          ...settings,
          header: {
            ...settings.header,
            [child]: type === 'checkbox' ? checked : value
          }
        });
      } else if (parent === 'footer') {
        setSettings({
          ...settings,
          footer: {
            ...settings.footer,
            [child]: type === 'checkbox' ? checked : value
          }
        });
      }
    } else {
      setSettings({
        ...settings,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  const handleSocialLinkChange = (platform: keyof SiteSettings['socialLinks'], value: string) => {
    setSettings({
      ...settings,
      socialLinks: {
        ...settings.socialLinks,
        [platform]: value
      }
    });
  };
  
  const handleSaveSettings = () => {
    // Aqui você faria uma chamada à API para salvar as configurações
    // Por enquanto vamos apenas simular com um timeout
    
    toast({
      title: "Salvando configurações...",
      description: "Por favor, aguarde."
    });
    
    setTimeout(() => {
      toast({
        title: "Configurações salvas",
        description: "As alterações foram aplicadas com sucesso."
      });
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personalização do Frontend</h1>
        <p className="text-muted-foreground">
          Configure a aparência e comportamento do site público
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6 grid max-w-[600px] grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Layout size={16} />
            <span>Geral</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette size={16} />
            <span>Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Image size={16} />
            <span>Mídia</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <LinkIcon size={16} />
            <span>Social</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure informações básicas do site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nome do Site</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Descrição do Site</Label>
                  <Input
                    id="siteDescription"
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keywords">Palavras-chave (SEO)</Label>
                <Input
                  id="keywords"
                  name="keywords"
                  value={settings.keywords}
                  onChange={handleInputChange}
                  placeholder="Separadas por vírgula"
                />
                <p className="text-sm text-muted-foreground">
                  Palavras-chave são utilizadas para melhorar o SEO do seu site.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-medium">Cabeçalho</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="header.showSearch"
                        name="header.showSearch"
                        checked={settings.header.showSearch}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="header.showSearch">Exibir busca</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="header.showSocialLinks"
                        name="header.showSocialLinks"
                        checked={settings.header.showSocialLinks}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="header.showSocialLinks">Exibir redes sociais</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="header.transparentOnHome"
                        name="header.transparentOnHome"
                        checked={settings.header.transparentOnHome}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="header.transparentOnHome">Cabeçalho transparente na home</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Rodapé</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="footer.showNewsletter"
                        name="footer.showNewsletter"
                        checked={settings.footer.showNewsletter}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="footer.showNewsletter">Exibir newsletter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="footer.showSocialLinks"
                        name="footer.showSocialLinks"
                        checked={settings.footer.showSocialLinks}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="footer.showSocialLinks">Exibir redes sociais</Label>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="footer.copyrightText">Texto de copyright</Label>
                      <Input
                        id="footer.copyrightText"
                        name="footer.copyrightText"
                        value={settings.footer.copyrightText}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings}>Salvar configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Configure cores e estilo visual do site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      name="primaryColor"
                      value={settings.primaryColor}
                      onChange={handleInputChange}
                    />
                    <input 
                      type="color" 
                      value={settings.primaryColor}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          primaryColor: e.target.value
                        });
                      }}
                      className="h-9 w-9 border rounded cursor-pointer"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondaryColor"
                      name="secondaryColor"
                      value={settings.secondaryColor}
                      onChange={handleInputChange}
                    />
                    <input 
                      type="color" 
                      value={settings.secondaryColor}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          secondaryColor: e.target.value
                        });
                      }}
                      className="h-9 w-9 border rounded cursor-pointer"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Cor de Destaque</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="accentColor"
                      name="accentColor"
                      value={settings.accentColor}
                      onChange={handleInputChange}
                    />
                    <input 
                      type="color" 
                      value={settings.accentColor}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          accentColor: e.target.value
                        });
                      }}
                      className="h-9 w-9 border rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">Visualização de Cores</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div style={{ backgroundColor: settings.primaryColor }} className="h-20 rounded-md flex items-center justify-center text-white">
                      Cor Primária
                    </div>
                    <div style={{ backgroundColor: settings.secondaryColor }} className="h-20 rounded-md flex items-center justify-center text-white">
                      Cor Secundária
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }} className="h-20 rounded-md flex items-center justify-center">
                      <span style={{ color: settings.primaryColor }}>Texto em cor primária</span>
                    </div>
                    <div style={{ backgroundColor: settings.accentColor }} className="h-20 rounded-md flex items-center justify-center text-white">
                      Cor de Destaque
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings}>Salvar configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Mídia</CardTitle>
              <CardDescription>
                Configure logo, favicon e outras mídias do site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="logo">URL da Logo</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={settings.logo}
                    onChange={handleInputChange}
                    placeholder="/images/logo.png"
                  />
                  <div className="mt-2 p-4 border rounded-md flex items-center justify-center">
                    {settings.logo ? (
                      <img 
                        src={settings.logo} 
                        alt="Logo do site" 
                        className="max-h-16 max-w-full" 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://via.placeholder.com/200x80?text=Logo+não+encontrado";
                        }}
                      />
                    ) : (
                      <div className="h-16 w-full bg-muted flex items-center justify-center text-muted-foreground">
                        Logo não definida
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dimensão recomendada: 200x80px
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="favicon">URL do Favicon</Label>
                  <Input
                    id="favicon"
                    name="favicon"
                    value={settings.favicon}
                    onChange={handleInputChange}
                    placeholder="/favicon.ico"
                  />
                  <div className="mt-2 p-4 border rounded-md flex items-center justify-center">
                    {settings.favicon ? (
                      <img 
                        src={settings.favicon} 
                        alt="Favicon do site" 
                        className="h-8 w-8" 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://via.placeholder.com/32?text=?";
                        }}
                      />
                    ) : (
                      <div className="h-8 w-8 bg-muted flex items-center justify-center text-muted-foreground text-xs">
                        ?
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dimensão recomendada: 32x32px
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">Configurações de Imagens</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="default-thumbnail">Imagem de Destaque Padrão</Label>
                    <Input
                      id="default-thumbnail"
                      placeholder="/images/default-thumbnail.jpg"
                    />
                    <p className="text-sm text-muted-foreground">
                      Exibida quando uma notícia não possui imagem
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="og-image">Imagem para Compartilhamento (OG Image)</Label>
                    <Input
                      id="og-image"
                      placeholder="/images/og-image.jpg"
                    />
                    <p className="text-sm text-muted-foreground">
                      Exibida quando o site é compartilhado nas redes sociais
                    </p>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings}>Salvar configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>
                Configure as redes sociais do site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={settings.socialLinks.facebook}
                    onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/seusite"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={settings.socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/seusite"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={settings.socialLinks.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/seusite"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={settings.socialLinks.youtube}
                    onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                    placeholder="https://youtube.com/c/seucanal"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">Configurações de Compartilhamento</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="show-share-buttons"
                      checked={true}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="show-share-buttons">Exibir botões de compartilhamento nos artigos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="enable-comments"
                      checked={true}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="enable-comments">Habilitar comentários do Facebook</Label>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings}>Salvar configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
