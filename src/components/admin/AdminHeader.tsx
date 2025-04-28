
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminHeader() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    // Remover o token de autenticação
    localStorage.removeItem('admin_token');
    
    // Notificar o usuário
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
    
    // Redirecionar para a tela de login
    navigate('/painel');
  };
  
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-screen-xl mx-auto py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="flex items-center">
              <span className="text-xl font-bold">Painel Administrativo</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" target="_blank" className="text-sm hover:underline">
              Ver site
            </Link>
            
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-1"
            >
              <LogOut size={16} />
              <span>Sair</span>
            </Button>
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-primary-foreground"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-primary/20">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                target="_blank"
                className="px-4 py-2 hover:bg-primary-foreground/10 rounded"
              >
                Ver site
              </Link>
              
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center justify-center gap-1"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
