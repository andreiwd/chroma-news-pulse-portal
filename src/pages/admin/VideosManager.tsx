import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Youtube, Plus, Edit, Trash, Eye } from "lucide-react";
import { useSupabaseConfig } from "@/hooks/useSupabaseConfig";

interface VideoConfig {
  id: string;
  url: string;
  title: string;
  showOnHome: boolean;
  order: number;
}

interface VideoSettings {
  youtubeVideos: VideoConfig[];
  youtubeAccentColor: string;
  backgroundOpacity: number;
}

export default function VideosManager() {
  const { toast } = useToast();
  const { getConfig, setConfig, loading } = useSupabaseConfig();
  const [videos, setVideos] = useState<VideoConfig[]>([]);
  const [accentColor, setAccentColor] = useState("#ea384c");
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.3);
  
  const [formData, setFormData] = useState<Omit<VideoConfig, 'id'>>({
    url: '',
    title: '',
    showOnHome: true,
    order: 0
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Load videos from config
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const config = await getConfig('video_settings');
        if (config) {
          const videoSettings = config as unknown as VideoSettings;
          if (videoSettings.youtubeVideos && Array.isArray(videoSettings.youtubeVideos)) {
            setVideos(videoSettings.youtubeVideos);
          }
          if (videoSettings.youtubeAccentColor) {
            setAccentColor(videoSettings.youtubeAccentColor);
          }
          if (videoSettings.backgroundOpacity !== undefined) {
            setBackgroundOpacity(videoSettings.backgroundOpacity);
          }
        }
      } catch (error) {
        console.error("Error loading video settings:", error);
      }
    };

    loadVideos();
  }, [getConfig]);

  // Save videos to config
  const saveVideoSettings = async (newVideos: VideoConfig[], newColor?: string, newOpacity?: number) => {
    const settings: VideoSettings = {
      youtubeVideos: newVideos,
      youtubeAccentColor: newColor || accentColor,
      backgroundOpacity: newOpacity !== undefined ? newOpacity : backgroundOpacity
    };
    
    const success = await setConfig('video_settings', settings);
    if (success) {
      setVideos(newVideos);
      if (newColor) setAccentColor(newColor);
      if (newOpacity !== undefined) setBackgroundOpacity(newOpacity);
    }
    return success;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let newVideos: VideoConfig[];
    
    if (editingId) {
      // Editar vídeo existente
      newVideos = videos.map(video => 
        video.id === editingId ? { ...formData, id: editingId } : video
      );
      
    } else {
      // Adicionar novo vídeo
      const newVideo = {
        ...formData,
        id: Date.now().toString()
      };
      
      newVideos = [...videos, newVideo];
    }
    
    const success = await saveVideoSettings(newVideos, accentColor, backgroundOpacity);
    if (success) {
      toast({
        title: editingId ? "Vídeo atualizado" : "Vídeo adicionado",
        description: `O vídeo "${formData.title}" foi ${editingId ? "atualizado" : "adicionado"} com sucesso.`
      });
    }
    
    resetForm();
    setDialogOpen(false);
  };
  
  const handleEdit = (video: VideoConfig) => {
    setFormData({
      url: video.url,
      title: video.title,
      showOnHome: video.showOnHome,
      order: video.order
    });
    setEditingId(video.id);
    setDialogOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    const newVideos = videos.filter(video => video.id !== id);
    const success = await saveVideoSettings(newVideos, accentColor, backgroundOpacity);
    
    if (success) {
      toast({
        title: "Vídeo removido",
        description: "O vídeo foi removido com sucesso."
      });
    }
  };
  
  const resetForm = () => {
    setFormData({
      url: '',
      title: '',
      showOnHome: true,
      order: 0
    });
    setEditingId(null);
  };

  const toggleVideoStatus = async (id: string) => {
    const newVideos = videos.map(video => 
      video.id === id ? { ...video, showOnHome: !video.showOnHome } : video
    );
    
    const success = await saveVideoSettings(newVideos, accentColor, backgroundOpacity);
    
    if (success) {
      const video = videos.find(video => video.id === id);
      const status = video?.showOnHome ? "ativado" : "desativado";
      
      toast({
        title: `Vídeo ${status}`,
        description: `O vídeo "${video?.title}" foi ${status} com sucesso.`
      });
    }
  };

  const handleAccentColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    await saveVideoSettings(videos, newColor, backgroundOpacity);
    
    toast({
      title: "Cor atualizada",
      description: "A cor de destaque dos vídeos foi atualizada."
    });
  };

  const handleOpacityChange = async (newOpacity: number[]) => {
    const opacity = newOpacity[0];
    await saveVideoSettings(videos, accentColor, opacity);
    
    toast({
      title: "Opacidade atualizada", 
      description: `Opacidade do fundo definida para ${Math.round(opacity * 100)}%.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Vídeos</h1>
          <p className="text-muted-foreground">
            Configure vídeos do YouTube para exibição no site
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Adicionar Vídeo</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Vídeo" : "Adicionar Novo Vídeo"}
              </DialogTitle>
              <DialogDescription>
                Preencha os detalhes do vídeo do YouTube abaixo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video-url">URL do Vídeo</Label>
                <Input
                  id="video-url"
                  name="url"
                  type="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-title">Título do Vídeo</Label>
                <Input
                  id="video-title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: Rick Astley - Never Gonna Give You Up"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-order">Ordem de Exibição</Label>
                <Input
                  id="video-order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleInputChange}
                  placeholder="Ex: 1"
                  required
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  id="video-showOnHome"
                  name="showOnHome"
                  type="checkbox"
                  checked={formData.showOnHome}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="video-showOnHome">Exibir na Home</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : editingId ? "Salvar alterações" : "Adicionar vídeo"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Aparência</CardTitle>
          <CardDescription>
            Personalize a aparência da seção de vídeos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="accent-color">Cor de Destaque</Label>
            <div className="flex items-center space-x-3">
              <input
                id="accent-color"
                type="color"
                value={accentColor}
                onChange={handleAccentColorChange}
                className="w-12 h-10 rounded border border-input cursor-pointer"
              />
              <Input
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                onBlur={handleAccentColorChange}
                placeholder="#ea384c"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="background-opacity">
              Opacidade do Fundo: {Math.round(backgroundOpacity * 100)}%
            </Label>
            <Slider
              id="background-opacity"
              min={0}
              max={1}
              step={0.1}
              value={[backgroundOpacity]}
              onValueChange={handleOpacityChange}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Controla a intensidade da cor de fundo da seção de vídeos
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vídeos configurados</CardTitle>
          <CardDescription>
            Lista de vídeos do YouTube cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                Nenhum vídeo cadastrado. Clique em "Adicionar Vídeo" para começar.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Exibir na Home</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">{video.title}</TableCell>
                    <TableCell>{video.order}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleVideoStatus(video.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                          video.showOnHome
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {video.showOnHome ? "Sim" : "Não"}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(video)}
                          title="Editar"
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(video.id)}
                          title="Excluir"
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
