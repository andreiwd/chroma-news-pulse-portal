
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Verificar se existe um token no localStorage
    const token = localStorage.getItem("admin_token");
    setIsAuthenticated(!!token);
  }, []);
  
  // Estado de carregamento até que a verificação de autenticação seja concluída
  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>Verificando autenticação...</p>
    </div>;
  }
  
  // Redirecionar para a página de login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/painel" replace />;
  }
  
  // Se estiver autenticado, renderizar as rotas filhas
  return <>{children}</>;
};

export default PrivateRoute;
