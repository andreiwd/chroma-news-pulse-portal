
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulação de verificação de autenticação
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar esta página.",
          variant: "destructive"
        });
        navigate('/painel');
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };
    
    checkAuth();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 p-6">
        <div className="max-w-screen-xl mx-auto">
          <Skeleton className="h-12 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <Skeleton className="h-[calc(100vh-12rem)] w-full" />
            </div>
            <div className="md:col-span-3 space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminHeader />
      
      <div className="max-w-screen-xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminSidebar />
          </div>
          
          <div className="md:col-span-3 space-y-6">
            <div className="bg-background rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4 bg-blue-50">
                  <h3 className="font-medium text-blue-700">Notícias</h3>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Total publicadas</p>
                </Card>
                
                <Card className="p-4 bg-green-50">
                  <h3 className="font-medium text-green-700">Anúncios</h3>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Ativos</p>
                </Card>
                
                <Card className="p-4 bg-purple-50">
                  <h3 className="font-medium text-purple-700">Blocos HTML</h3>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Configurados</p>
                </Card>
              </div>
            </div>
            
            <Tabs defaultValue="ads" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ads">Anúncios</TabsTrigger>
                <TabsTrigger value="html-blocks">Blocos HTML</TabsTrigger>
                <TabsTrigger value="settings">Configurações</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ads" className="bg-background rounded-lg shadow p-6 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Anúncios Recentes</h2>
                  <Button size="sm">
                    <Link to="/admin/ads/new">Adicionar Novo</Link>
                  </Button>
                </div>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum anúncio cadastrado.</p>
                  <Button variant="outline" className="mt-4">
                    <Link to="/admin/ads/new">Cadastrar seu primeiro anúncio</Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="html-blocks" className="bg-background rounded-lg shadow p-6 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Blocos HTML</h2>
                  <Button size="sm">
                    <Link to="/admin/blocks/new">Adicionar Novo</Link>
                  </Button>
                </div>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum bloco HTML cadastrado.</p>
                  <Button variant="outline" className="mt-4">
                    <Link to="/admin/blocks/new">Cadastrar seu primeiro bloco HTML</Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="bg-background rounded-lg shadow p-6 mt-4">
                <h2 className="text-lg font-medium mb-4">Configurações do Site</h2>
                <div className="grid gap-4">
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium">Informações do Site</h3>
                    <p className="text-sm text-muted-foreground mb-4">Configure informações básicas do site</p>
                    <Button variant="outline" size="sm">Editar</Button>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium">Aparência</h3>
                    <p className="text-sm text-muted-foreground mb-4">Configure cores, logo e layout</p>
                    <Button variant="outline" size="sm">Editar</Button>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium">Usuários</h3>
                    <p className="text-sm text-muted-foreground mb-4">Gerencie usuários do painel</p>
                    <Button variant="outline" size="sm">Gerenciar</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
