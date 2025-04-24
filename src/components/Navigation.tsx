
import { cn } from "@/lib/utils";

const categories = [
  { name: "Tecnologia", color: "tech" },
  { name: "Esportes", color: "sports" },
  { name: "Política", color: "politics" },
  { name: "Economia", color: "economy" },
  { name: "Entretenimento", color: "entertainment" },
];

export default function Navigation() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <ul className="flex items-center gap-6 overflow-x-auto py-4">
          {categories.map((category) => (
            <li key={category.name}>
              <a
                href={`#${category.name.toLowerCase()}`}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-category-" + category.color,
                  "border-b-2 border-transparent pb-1 hover:border-category-" + category.color
                )}
                style={{ color: `var(--category-${category.color})` }}
              >
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
