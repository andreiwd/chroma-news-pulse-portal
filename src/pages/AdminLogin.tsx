
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Tentando fazer login com:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro de autenticação:', error);
        throw error;
      }

      console.log('Login realizado com sucesso. Verificando permissões de admin...');
      console.log('Dados do usuário:', data.user);

      // Verificar se o usuário é administrador
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('active', true);

      console.log('Resultado da consulta admin_users:', { adminUser, adminError });

      if (adminError) {
        console.error('Erro ao consultar admin_users:', adminError);
        await supabase.auth.signOut();
        throw new Error(`Erro na verificação de permissões: ${adminError.message}`);
      }

      if (!adminUser || adminUser.length === 0) {
        console.log('Usuário não encontrado na tabela admin_users ou inativo');
        await supabase.auth.signOut();
        throw new Error('Acesso negado. Usuário não autorizado ou inativo.');
      }

      console.log('Usuário autorizado:', adminUser[0]);
      
      localStorage.setItem("admin_token", data.session?.access_token || "");
      localStorage.setItem("admin_user", JSON.stringify(adminUser[0]));
      
      toast({
        title: "Login efetuado",
        description: "Bem-vindo ao painel administrativo."
      });
      
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error('Erro completo:', error);
      toast({
        title: "Erro de autenticação",
        description: error.message || "Erro ao fazer login.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Taquaritinga Notícias</h1>
          <p className="text-muted-foreground">Painel Administrativo</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email"
                  required
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link 
                    to="/admin/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  autoComplete="current-password"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Link to="/" className="text-sm text-primary hover:underline">
              Voltar para o site
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
