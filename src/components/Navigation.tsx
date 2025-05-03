
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
import { ChevronDown, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

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

  const handleCategoryClick = (categorySlug: string) => {
    setActiveCategory(categorySlug);
  };

  // For desktop view, show only 7 categories + "Ver Todas"
  const desktopCategories = categories.slice(0, 7);

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
                  categories.map(category => {
                    const categoryId = typeof category.id === 'number' ? String(category.id) : `category-${Math.random()}`;
                    const categoryName = typeof category.name === 'string' ? category.name : '';
                    const categorySlug = typeof category.slug === 'string' ? category.slug : '';
                    const categoryColor = typeof category.color === 'string' ? category.color : `var(--category-${categorySlug || "default"})`;
                    
                    return (
                      <Link 
                        key={categoryId}
                        to={`/category/${categorySlug}`}
                        className="flex items-center justify-center p-3 rounded-md font-medium text-center transition-all"
                        style={{ 
                          backgroundColor: `${categoryColor}20`,
                          color: categoryColor
                        }}
                      >
                        {categoryName}
                      </Link>
                    );
                  })
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
        
        {/* Desktop Menu */}
        <div className="hidden lg:block overflow-x-auto no-scrollbar">
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
                <>
                  {desktopCategories.map((category) => {
                    // Ensure all category properties are strings
                    const categoryId = typeof category.id === 'number' ? String(category.id) : `category-${Math.random()}`;
                    const categoryName = typeof category.name === 'string' ? category.name : '';
                    const categorySlug = typeof category.slug === 'string' ? category.slug : '';
                    const categoryColor = typeof category.color === 'string' ? category.color : `var(--category-${categorySlug || "default"})`;
                    const isActive = activeCategory === categorySlug;
                    
                    return (
                      <NavigationMenuItem key={categoryId}>
                        <NavigationMenuTrigger 
                          className="text-sm font-bold hover:bg-transparent whitespace-nowrap dark:text-gray-200 dark:hover:text-white"
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
                          <ul className="grid w-[400px] gap-2 p-4 dark:bg-gray-800">
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
                                <Link
                                  to={`/category/${categorySlug}/latest`}
                                  className={cn(
                                    "block select-none rounded-md p-3 text-center text-sm font-medium leading-none no-underline outline-none transition-colors",
                                    "hover:bg-muted dark:hover:bg-gray-700"
                                  )}
                                >
                                  Últimas notícias
                                </Link>
                                <Link
                                  to={`/category/${categorySlug}/trending`}
                                  className={cn(
                                    "block select-none rounded-md p-3 text-center text-sm font-medium leading-none no-underline outline-none transition-colors",
                                    "hover:bg-muted dark:hover:bg-gray-700"
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
                  })}
                  
                  {/* "Ver Todas" menu item */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger 
                      className="text-sm font-bold hover:bg-transparent whitespace-nowrap text-primary dark:text-primary"
                      onClick={() => setActiveCategory(null)}
                    >
                      Ver Todas
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[500px] p-4 dark:bg-gray-800">
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to="/categories"
                            className="block select-none rounded-md p-3 text-center text-sm font-medium leading-none no-underline outline-none transition-colors bg-primary/10 text-primary dark:bg-primary/20"
                          >
                            Todas as categorias
                          </Link>
                          <Link
                            to="/news"
                            className="block select-none rounded-md p-3 text-center text-sm font-medium leading-none no-underline outline-none transition-colors hover:bg-muted dark:hover:bg-gray-700"
                          >
                            Todas as notícias
                          </Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
