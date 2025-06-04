
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { Menu, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import axios from "axios";
import { Category } from "@/types/api";
import { useSupabaseConfig } from "@/hooks/useSupabaseConfig";

interface SiteSettings {
  logo: {
    url: string;
    height: number;
  };
}

const DEFAULT_SETTINGS: SiteSettings = {
  logo: { url: "", height: 40 }
};

export default function Navigation() {
  const location = useLocation();
  const { getConfig } = useSupabaseConfig();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Load logo settings
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getConfig('frontend_settings');
        
        if (config && typeof config === 'object') {
          const configData = config as Record<string, any>;
          const newSettings: SiteSettings = {
            logo: {
              url: configData.logo?.url || "",
              height: 40 // Smaller height for navigation
            }
          };
          
          setSettings(newSettings);
        }
      } catch (error) {
        console.error("Erro ao carregar configurações do logo:", error);
      }
    };
    
    loadConfig();
  }, [getConfig]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Buscar categorias diretamente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://taquaritinganoticias.criarsite.online/api/categories');
        
        // Processar a resposta para garantir que temos um array
        let fetchedCategories = [];
        
        if (Array.isArray(response.data)) {
          fetchedCategories = response.data;
        } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
          fetchedCategories = response.data.data;
        }
        
        // Mapear para o formato Category e garantir valores válidos
        const processedCategories = fetchedCategories
          .filter((cat: any) => cat && typeof cat === 'object' && cat.slug) // Filtra categorias inválidas
          .map((cat: any) => ({
            id: Number(cat.id) || 0,
            name: String(cat.name || ""),
            slug: String(cat.slug || ""),
            description: String(cat.description || ""),
            color: String(cat.color || "#333333"),
            text_color: String(cat.text_color || "#FFFFFF"),
            active: Boolean(cat.active),
            order: Number(cat.order) || 0
          }));
        
        setCategories(processedCategories);
      } catch (error) {
        console.error("Erro ao buscar categorias para navegação:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Set active category based on URL
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/category/')) {
      const categorySlug = path.split('/')[2];
      setActiveCategory(categorySlug);
    } else {
      setActiveCategory(null);
    }
  }, [location]);
  
  return (
    <nav className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full dark:bg-gray-900 dark:border-gray-800">
      <div className="container">
        {/* Logo - only shows when scrolled */}
        {isScrolled && (
          <div className="flex justify-center py-2 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="inline-block">
              {settings.logo.url ? (
                <img 
                  src={settings.logo.url} 
                  alt="Logo do Site" 
                  style={{ height: `${settings.logo.height}px` }}
                  className="w-auto max-h-10"
                  onError={(e) => {
                    console.error("Erro ao carregar logo:", e);
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                    const fallback = target.parentElement?.querySelector('.fallback-logo') as HTMLElement;
                    if (!fallback) {
                      const span = document.createElement('span');
                      span.className = "text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent fallback-logo";
                      span.textContent = "ChromaNews";
                      target.parentElement?.appendChild(span);
                    }
                  }}
                />
              ) : (
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  ChromaNews
                </span>
              )}
            </Link>
          </div>
        )}

        {/* Mobile Menu */}
        <div className="block lg:hidden py-2">
          <Sheet>
            <SheetTrigger className="flex items-center justify-center w-full py-2">
              <Menu className="h-6 w-6 mr-2" />
              <span className="font-medium">Categorias</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </SheetTrigger>
            <SheetContent side="top" className="max-h-[80vh] overflow-y-auto pt-12 dark:bg-gray-900">
              <div className="grid grid-cols-2 gap-3 py-4">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-md" />
                  ))
                ) : (
                  categories.map((category) => (
                    <Link 
                      key={`mobile-cat-${category.id}-${category.slug}`}
                      to={`/category/${category.slug}`}
                      className="flex items-center justify-center p-3 rounded-md font-medium text-center transition-all"
                      style={{ 
                        backgroundColor: `${category.color}20`,
                        color: category.color
                      }}
                    >
                      {category.name}
                    </Link>
                  ))
                )}
                <Link 
                  to="/categories"
                  className="flex items-center justify-center p-3 rounded-md font-medium text-center col-span-2 bg-primary/10 text-primary dark:bg-primary/20"
                >
                  Ver todas as categorias
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Desktop Menu - Com fundo sutil */}
        <div className="hidden lg:flex space-x-1 py-3 overflow-x-auto bg-gray-50/50 dark:bg-gray-800/30 rounded-md">
          {isLoading ? (
            // Skeleton loaders
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-10 px-3 flex items-center">
                <Skeleton className="h-6 w-24" />
              </div>
            ))
          ) : (
            // Render actual categories
            categories.slice(0, 8).map((category) => {
              const isActive = activeCategory === category.slug;
              
              return (
                <Button
                  key={`desktop-cat-${category.id}-${category.slug}`}
                  variant="ghost"
                  className="font-medium"
                  style={{ 
                    color: category.color,
                    borderBottom: isActive ? `3px solid ${category.color}` : 'none',
                    borderRadius: isActive ? '0' : undefined
                  }}
                  asChild
                >
                  <Link to={`/category/${category.slug}`}>
                    {category.name}
                  </Link>
                </Button>
              );
            })
          )}
          
          {/* "Ver Todas" button */}
          <Button
            variant="ghost"
            className="font-medium text-primary"
            asChild
          >
            <Link to="/categories">
              Ver Todas
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
