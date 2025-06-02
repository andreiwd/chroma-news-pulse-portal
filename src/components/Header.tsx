
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
  const [logo, setLogo] = useState<string>("");
  const [logoHeight, setLogoHeight] = useState<number>(60);
  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com"
  });
  const [colors, setColors] = useState({
    primary: "#1a73e8",
    secondary: "#f8f9fa"
  });

  // Load settings from Supabase
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getConfig('frontend_settings');
        if (config) {
          const settings = config as unknown as SiteSettings;
          if (settings.logo) {
            setLogo(settings.logo.url || "");
            setLogoHeight(settings.logo.height || 60);
          }
          if (settings.socialLinks) {
            setSocialLinks({
              facebook: settings.socialLinks.facebook || "https://facebook.com",
              instagram: settings.socialLinks.instagram || "https://instagram.com",
              twitter: settings.socialLinks.twitter || "https://twitter.com"
            });
          }
          if (settings.colors) {
            setColors({
              primary: settings.colors.primary || "#1a73e8",
              secondary: settings.colors.secondary || "#f8f9fa"
            });
          }
        }
      } catch (error) {
        console.error("Error loading site settings:", error);
      }
    };

    loadConfig();
  }, [getConfig]);

  // Apply custom colors to CSS variables
  useEffect(() => {
    if (colors.primary) {
      document.documentElement.style.setProperty('--primary', colors.primary);
    }
    if (colors.secondary) {
      document.documentElement.style.setProperty('--secondary', colors.secondary);
    }
  }, [colors]);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-2">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <a href="/" className="inline-block">
              {logo ? (
                <img 
                  src={logo} 
                  alt="ChromaNews" 
                  style={{ height: `${logoHeight}px` }}
                  className="w-auto"
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
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
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
