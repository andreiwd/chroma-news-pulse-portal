
import { Link, useLocation } from "react-router-dom";
import { useCategories } from "@/hooks/useNews";
import { Skeleton } from "./ui/skeleton";
import { Menu, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Category } from "@/types/api";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export default function Navigation() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data: categoriesData, isLoading } = useCategories();

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

  // Ensure categories is always an array of valid Category objects
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  console.log("Navigation component - categories:", categories);

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
