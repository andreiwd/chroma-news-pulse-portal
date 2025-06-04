
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Verificando autenticação...');
        
        // Verificar se existe um token no localStorage
        const token = localStorage.getItem("admin_token");
        const adminUser = localStorage.getItem("admin_user");
        
        if (!token || !adminUser) {
          console.log('Token ou dados do usuário admin não encontrados');
          setIsAuthenticated(false);
          return;
        }

        // Verificar se a sessão do Supabase ainda é válida
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          setIsAuthenticated(false);
          return;
        }

        if (!session) {
          console.log('Sessão do Supabase expirada');
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          setIsAuthenticated(false);
          return;
        }

        console.log('Usuário autenticado e sessão válida');
        setIsAuthenticated(true);
        
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);
  
  // Estado de carregamento até que a verificação de autenticação seja concluída
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  // Redirecionar para a página de login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/painel" replace />;
  }
  
  // Se estiver autenticado, renderizar as rotas filhas
  return <>{children}</>;
};

export default PrivateRoute;
