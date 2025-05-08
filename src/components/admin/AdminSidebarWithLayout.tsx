
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  LayoutDashboard, 
  Users, 
  Settings, 
  ImageIcon, 
  CloudSun,
  Code,
  Layout
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AdminSidebarWithLayout() {
  const location = useLocation();
  
  // Navigation items with icons
  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Layout da Home",
      href: "/admin/layout",
      icon: Layout
    },
    {
      name: "Anúncios",
      href: "/admin/ads",
      icon: ImageIcon
    },
    {
      name: "Blocos HTML",
      href: "/admin/blocks",
      icon: Code
    },
    {
      name: "Usuários",
      href: "/admin/users",
      icon: Users
    },
    {
      name: "Vídeos",
      href: "/admin/videos",
      icon: BarChart3
    },
    {
      name: "Clima",
      href: "/admin/weather",
      icon: CloudSun
    },
    {
      name: "Configurações",
      href: "/admin/settings",
      icon: Settings
    }
  ];
  
  return (
    <nav className="space-y-2 sticky top-6">
      <div className="p-3 bg-white rounded-lg border">
        <div className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={location.pathname === item.href ? "default" : "ghost"}
              className={cn(
                "justify-start",
                location.pathname === item.href 
                  ? "" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              asChild
            >
              <Link to={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
