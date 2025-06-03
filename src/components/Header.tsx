
import { Facebook, Instagram, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
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

export default function Header() {
  const { getConfig } = useSupabaseConfig();
  const [settings, setSettings] = useState<SiteSettings>({
    logo: { url: "", height: 60 },
    socialLinks: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com"
    },
    colors: {
      primary: "#1a73e8",
      secondary: "#f8f9fa"
    }
  });

  // Load settings from Supabase
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getConfig('frontend_settings');
        console.log("Header - Configuração carregada:", config);
        
        if (config && typeof config === 'object') {
          const configData = config as Record<string, any>;
          const newSettings = {
            logo: {
              url: configData.logo?.url || "",
              height: Number(configData.logo?.height) || 60
            },
            socialLinks: {
              facebook: configData.socialLinks?.facebook || "https://facebook.com",
              instagram: configData.socialLinks?.instagram || "https://instagram.com",
              twitter: configData.socialLinks?.twitter || "https://twitter.com"
            },
            colors: {
              primary: configData.colors?.primary || "#1a73e8",
              secondary: configData.colors?.secondary || "#f8f9fa"
            }
          };
          
          console.log("Header - Aplicando configurações:", newSettings);
          setSettings(newSettings);
          
          // Apply colors immediately
          if (newSettings.colors.primary) {
            document.documentElement.style.setProperty('--primary', newSettings.colors.primary);
          }
          if (newSettings.colors.secondary) {
            document.documentElement.style.setProperty('--secondary', newSettings.colors.secondary);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar configurações do site:", error);
      }
    };

    loadConfig();
  }, [getConfig]);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <a href="/" className="inline-block">
              {settings.logo.url ? (
                <img 
                  src={settings.logo.url} 
                  alt="Logo do Site" 
                  style={{ height: `${settings.logo.height}px` }}
                  className="w-auto max-h-20"
                  onError={(e) => {
                    console.error("Erro ao carregar logo:", e);
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.parentElement?.querySelector('.fallback-logo');
                    if (!fallback) {
                      const span = document.createElement('span');
                      span.className = "text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent fallback-logo";
                      span.textContent = "ChromaNews";
                      e.currentTarget.parentElement?.appendChild(span);
                    }
                  }}
                />
              ) : (
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  ChromaNews
                </span>
              )}
            </a>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar notícias..."
                className="pl-8 rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-5 w-5"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5 0-.278-.028-.556-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                  </svg>
                </a>
              </Button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
