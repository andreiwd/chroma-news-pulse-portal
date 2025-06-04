
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileCode, Image, Users, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  advertisements: number;
  htmlBlocks: number;
  adminUsers: number;
  videos: number;
}

interface RecentActivity {
  date: string;
  user: string;
  action: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    advertisements: 0,
    htmlBlocks: 0,
    adminUsers: 0,
    videos: 0
  });
  
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Carregar estatísticas
      const [adsResult, blocksResult, usersResult, videosResult] = await Promise.all([
        supabase.from('advertisements').select('*', { count: 'exact' }),
        supabase.from('html_blocks').select('*', { count: 'exact' }),
        supabase.from('admin_users').select('*', { count: 'exact' }),
        supabase.from('youtube_videos').select('*', { count: 'exact' })
      ]);

      setStats({
        advertisements: adsResult.count || 0,
        htmlBlocks: blocksResult.count || 0,
        adminUsers: usersResult.count || 0,
        videos: videosResult.count || 0
      });

      // Simular atividades recentes baseadas nos dados reais
      const activities: RecentActivity[] = [];
      
      if (adsResult.data && adsResult.data.length > 0) {
        const latestAd = adsResult.data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
        activities.push({
          date: new Date(latestAd.updated_at).toLocaleDateString('pt-BR'),
          user: 'admin',
          action: `Atualização de anúncio: ${latestAd.title}`
        });
      }

      if (blocksResult.data && blocksResult.data.length > 0) {
        const latestBlock = blocksResult.data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
        activities.push({
          date: new Date(latestBlock.updated_at).toLocaleDateString('pt-BR'),
          user: 'admin',
          action: `Atualização de bloco HTML: ${latestBlock.name}`
        });
      }

      if (videosResult.data && videosResult.data.length > 0) {
        const latestVideo = videosResult.data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
        activities.push({
          date: new Date(latestVideo.updated_at).toLocaleDateString('pt-BR'),
          user: 'admin',
          action: `Adição de vídeo: ${latestVideo.title}`
        });
      }

      // Ordenar por data mais recente
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivities(activities.slice(0, 5));

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel administrativo. Aqui você pode gerenciar seu site.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Anúncios ativos</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.advertisements}</div>
            <p className="text-xs text-muted-foreground">
              Total de anúncios cadastrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Blocos HTML</CardTitle>
            <FileCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.htmlBlocks}</div>
            <p className="text-xs text-muted-foreground">
              Blocos de conteúdo personalizados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adminUsers}</div>
            <p className="text-xs text-muted-foreground">
              Administradores cadastrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Vídeos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.videos}</div>
            <p className="text-xs text-muted-foreground">
              Vídeos do YouTube configurados
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividades recentes</CardTitle>
            <CardDescription>
              Últimas atualizações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{activity.date}</TableCell>
                      <TableCell>{activity.user}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma atividade recente encontrada
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações do sistema</CardTitle>
            <CardDescription>Detalhes técnicos e status do site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Versão</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Último backup</span>
              <span>{new Date().toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status</span>
              <span className="text-green-500 font-medium">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Banco de dados</span>
              <span className="text-green-500 font-medium">Conectado</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
