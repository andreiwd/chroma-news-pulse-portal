
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

const categories = [
  { name: "Tecnologia", color: "tech", subcategories: ["Inteligência Artificial", "Startups", "Gadgets", "Internet"] },
  { name: "Esportes", color: "sports", subcategories: ["Futebol", "Basquete", "Vôlei", "Olimpíadas"] },
  { name: "Política", color: "politics", subcategories: ["Nacional", "Internacional", "Eleições", "Congresso"] },
  { name: "Economia", color: "economy", subcategories: ["Mercado", "Finanças", "Negócios", "Investimentos"] },
  { name: "Entretenimento", color: "entertainment", subcategories: ["Cinema", "Música", "Televisão", "Celebridades"] },
  { name: "Ciência", color: "science", subcategories: ["Pesquisas", "Espaço", "Arqueologia", "Descobertas"] },
  { name: "Saúde", color: "health", subcategories: ["Medicina", "Bem-estar", "Nutrição", "Pandemia"] },
  { name: "Meio Ambiente", color: "environment", subcategories: ["Clima", "Sustentabilidade", "Conservação", "Energia"] },
];

export default function Navigation() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <nav className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
      <div className="container">
        <div className="overflow-x-auto no-scrollbar">
          <NavigationMenu className="max-w-none justify-start py-2">
            <NavigationMenuList className="flex space-x-2 px-1">
              {categories.map((category) => (
                <NavigationMenuItem key={category.name}>
                  <NavigationMenuTrigger 
                    className="text-sm font-bold hover:bg-transparent whitespace-nowrap"
                    style={{ 
                      color: `var(--category-${category.color})`,
                      borderBottom: activeCategory === category.name 
                        ? `3px solid var(--category-${category.color})` 
                        : 'none' 
                    }}
                    onClick={() => setActiveCategory(category.name)}
                  >
                    {category.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-2 p-4">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory}>
                          <NavigationMenuLink asChild>
                            <a
                              href={`#${category.name.toLowerCase()}-${subcategory.toLowerCase()}`}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                "hover:bg-opacity-80"
                              )}
                              style={{ 
                                color: `var(--category-${category.color})`,
                                borderLeft: `3px solid var(--category-${category.color})`
                              }}
                            >
                              <div className="text-sm font-medium leading-none">{subcategory}</div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            href={`/category/${category.name.toLowerCase()}`}
                            className="block select-none rounded-md p-3 text-center text-sm font-medium leading-none no-underline outline-none transition-colors"
                            style={{ 
                              backgroundColor: `var(--category-${category.color}-light)`,
                              color: `var(--category-${category.color})`
                            }}
                          >
                            Ver todas
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
