
import { Facebook, Instagram, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";

export default function Header() {
  const [logo, setLogo] = useState<string>("/logo.png");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com"
  });

  // Load settings from localStorage if available
  useEffect(() => {
    const storedSettings = localStorage.getItem('siteSettings');
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        if (settings.logo) setLogo(settings.logo);
        if (settings.socialLinks) {
          setSocialLinks({
            facebook: settings.socialLinks.facebook || "https://facebook.com",
            instagram: settings.socialLinks.instagram || "https://instagram.com",
            tiktok: settings.socialLinks.youtube || "https://tiktok.com"
          });
        }
      } catch (error) {
        console.error("Error parsing site settings:", error);
      }
    }
  }, []);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-2">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <a href="/" className="inline-block">
              <img 
                src={logo} 
                alt="ChromaNews" 
                className="max-h-16 w-auto"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML += `
                    <span class="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      ChromaNews
                    </span>
                  `;
                }}
              />
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
                <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer">
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
                    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
                    <path d="M16 8v8"/>
                    <path d="M12 16v-8"/>
                    <path d="M20 12V8a4 4 0 0 0-4-4h-1"/>
                    <path d="M13 5.1v0"/>
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
