
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  Image, 
  FileCode,
  Settings,
  Sun
} from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ to, icon, label, active }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted"
      )}
    >
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </Link>
  );
}

export default function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    {
      to: "/admin/dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
    },
    {
      to: "/admin/ads",
      icon: <Image size={18} />,
      label: "Anúncios",
    },
    {
      to: "/admin/weather",
      icon: <Sun size={18} />,
      label: "Previsão do Tempo",
    },
    {
      to: "/admin/blocks",
      icon: <FileCode size={18} />,
      label: "Blocos HTML",
    },
    {
      to: "/admin/settings",
      icon: <Settings size={18} />,
      label: "Configurações",
    }
  ];
  
  return (
    <div className="bg-background rounded-lg shadow p-4">
      <div className="space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={currentPath === item.to}
          />
        ))}
      </div>
    </div>
  );
}
