
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useState } from "react";
import { useCategories } from "@/hooks/useNews";
import { Skeleton } from "./ui/skeleton";

export default function Navigation() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data: categories, isLoading } = useCategories();

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
                categories?.map((category) => (
                  <NavigationMenuItem key={category.id}>
                    <NavigationMenuTrigger 
                      className="text-sm font-bold hover:bg-transparent whitespace-nowrap"
                      style={{ 
                        color: category.color || `var(--category-${category.slug})`,
                        borderBottom: activeCategory === category.name 
                          ? `3px solid ${category.color || `var(--category-${category.slug})`}` 
                          : 'none' 
                      }}
                      onClick={() => setActiveCategory(category.name)}
                    >
                      {category.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-2 p-4">
                        {/* If we had subcategories, we'd map them here */}
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              href={`/category/${category.slug}`}
                              className={cn(
                                "block select-none rounded-md p-3 text-center text-sm font-medium leading-none no-underline outline-none transition-colors",
                                "hover:bg-opacity-80"
                              )}
                              style={{ 
                                backgroundColor: `${category.color}20` || `var(--category-${category.slug}-light)`,
                                color: category.color || `var(--category-${category.slug})`
                              }}
                            >
                              Ver todas as notícias
                            </a>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
