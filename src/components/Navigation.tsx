
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { Menu, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import axios from "axios";
import { Category } from "@/types/api";

export default function Navigation() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
        
        // Mapear para o formato Category
        const processedCategories = fetchedCategories.map((cat: any) => ({
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
        console.error("Error fetching categories for navigation:", error);
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
                      key={`mobile-cat-${category.id || 'unknown'}`}
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
        
        {/* Desktop Menu - Simplified */}
        <div className="hidden lg:flex space-x-1 py-3 overflow-x-auto">
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
                  key={`desktop-cat-${category.id || 'unknown'}`}
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
