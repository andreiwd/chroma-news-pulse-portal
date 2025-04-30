
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useState, useEffect } from "react";
import { useCategories } from "@/hooks/useNews";
import { Skeleton } from "./ui/skeleton";
import { Link, useLocation } from "react-router-dom";
import { Category } from "@/types/api";

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
  const categories: Category[] = Array.isArray(categoriesData) 
    ? categoriesData.filter((cat): cat is Category => 
        Boolean(cat) && 
        typeof cat === 'object' && 
        'name' in cat && 
        'id' in cat && 
        'slug' in cat
      )
    : [];

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  return (
    <nav className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
      <div className="container">
        <div className="overflow-x-auto no-scrollbar">
          <NavigationMenu className="max-w-none justify-start py-2">
            <NavigationMenuList className="flex space-x-2 px-1">
              {isLoading ? (
                // Skeleton loaders while categories are loading
                <>
                  {[...Array(6)].map((_, i) => (
                    <NavigationMenuItem key={i}>
                      <div className="h-10 flex items-center">
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </NavigationMenuItem>
                  ))}
                </>
              ) : (
                // Render actual categories when loaded
                categories.map((category) => {
                  // Ensure we have a valid ID for the key
                  const categoryId = category.id?.toString() || `category-${Math.random()}`;
                  // Safely access properties with fallbacks
                  const categoryName = category.name || '';
                  const categorySlug = category.slug || '';
                  const categoryColor = category.color || `var(--category-${categorySlug || "default"})`;
                  const isActive = activeCategory === categorySlug;
                  
                  return (
                    <NavigationMenuItem key={categoryId}>
                      <NavigationMenuTrigger 
                        className="text-sm font-bold hover:bg-transparent whitespace-nowrap"
                        style={{ 
                          color: categoryColor,
                          borderBottom: isActive 
                            ? `3px solid ${categoryColor}` 
                            : 'none' 
                        }}
                        onClick={() => handleCategoryClick(categorySlug)}
                      >
                        {categoryName}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-2 p-4">
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/category/${categorySlug}`}
                                className={cn(
                                  "block select-none rounded-md p-3 text-center text-sm font-medium leading-none no-underline outline-none transition-colors",
                                  "hover:bg-opacity-80"
                                )}
                                style={{ 
                                  backgroundColor: `${categoryColor}20` || `var(--category-${categorySlug || "default"}-light)`,
                                  color: categoryColor
                                }}
                              >
                                Ver todas as notícias de {categoryName}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li className="mt-2">
                            <div className="grid grid-cols-2 gap-2">
                              {/* Opções adicionais de navegação por subcategoria, se houver */}
                              <Link
                                to={`/category/${categorySlug}/latest`}
                                className={cn(
                                  "block select-none rounded-md p-3 text-center text-sm font-medium leading-none no-underline outline-none transition-colors",
                                  "hover:bg-muted"
                                )}
                              >
                                Últimas notícias
                              </Link>
                              <Link
                                to={`/category/${categorySlug}/trending`}
                                className={cn(
                                  "block select-none rounded-md p-3 text-center text-sm font-medium leading-none no-underline outline-none transition-colors",
                                  "hover:bg-muted"
                                )}
                              >
                                Em alta
                              </Link>
                            </div>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                })
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
