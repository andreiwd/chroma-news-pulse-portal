
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Youtube, Pencil, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseConfig } from "@/hooks/useSupabaseConfig";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

interface YoutubeVideo {
  id: string;
  title: string;
  url: string;
  showOnHome: boolean;
  order: number;
}

interface VideoSettings {
  youtubeVideos: YoutubeVideo[];
  youtubeAccentColor: string;
}

export default function VideosManager() {
  const { toast } = useToast();
  const { getConfig, setConfig, loading } = useSupabaseConfig();
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<YoutubeVideo | null>(null);
  const [accentColor, setAccentColor] = useState("#9b87f5");

  const form = useForm({
    defaultValues: {
      id: "",
      title: "",
      url: "",
      showOnHome: true,
      order: 0,
    },
  });

  // Carregar vídeos salvos
  useEffect(() => {
    const loadConfig = async () => {
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
        }
      } catch (error) {
        console.error("Erro ao carregar configurações de vídeos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, [getConfig]);

  // Salvar vídeos
  const saveVideos = async (updatedVideos: YoutubeVideo[]) => {
    const videoSettings: VideoSettings = {
      youtubeVideos: updatedVideos,
      youtubeAccentColor: accentColor
    };
    
    await setConfig('video_settings', videoSettings);
  };

  // Salvar cor de destaque
  const saveAccentColor = async (color: string) => {
    const videoSettings: VideoSettings = {
      youtubeVideos: videos,
      youtubeAccentColor: color
    };
    
    await setConfig('video_settings', videoSettings);
  };

  // Editar vídeo
  const handleEdit = (video: YoutubeVideo) => {
    setEditingVideo(video);
    form.reset({
      id: video.id,
      title: video.title,
      url: video.url,
      showOnHome: video.showOnHome,
      order: video.order,
    });
    setIsDialogOpen(true);
  };

  // Adicionar vídeo
  const handleAdd = () => {
    setEditingVideo(null);
    form.reset({
      id: crypto.randomUUID(),
      title: "",
      url: "",
      showOnHome: true,
      order: videos.length,
    });
    setIsDialogOpen(true);
  };

  // Excluir vídeo
  const handleDelete = async (id: string) => {
    const updatedVideos = videos.filter((video) => video.id !== id);
    setVideos(updatedVideos);
    await saveVideos(updatedVideos);
    toast({
      title: "Vídeo excluído",
      description: "O vídeo foi excluído com sucesso.",
    });
  };

  // Alternar visibilidade do vídeo
  const toggleVideoVisibility = async (id: string) => {
    const updatedVideos = videos.map((video) =>
      video.id === id ? { ...video, showOnHome: !video.showOnHome } : video
    );
    setVideos(updatedVideos);
    await saveVideos(updatedVideos);
  };

  // Salvar formulário
  const onSubmit = async (data: any) => {
    if (editingVideo) {
      // Atualizar vídeo existente
      const updatedVideos = videos.map((video) =>
        video.id === data.id ? { ...data } : video
      );
      setVideos(updatedVideos);
      await saveVideos(updatedVideos);
      toast({
        title: "Vídeo atualizado",
        description: "O vídeo foi atualizado com sucesso.",
      });
    } else {
      // Adicionar novo vídeo
      const newVideos = [...videos, data];
      setVideos(newVideos);
      await saveVideos(newVideos);
      toast({
        title: "Vídeo adicionado",
        description: "O vídeo foi adicionado com sucesso.",
      });
    }
    setIsDialogOpen(false);
  };

  // Atualizar cor de destaque
  const handleColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setAccentColor(newColor);
    await saveAccentColor(newColor);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Vídeos</h2>
          <p className="text-muted-foreground">
            Gerencie os vídeos do YouTube que serão exibidos no site.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2" size={16} />
          Adicionar Vídeo
        </Button>
      </div>

      <div className="bg-card border rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium mb-2">Personalização</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="accentColor" className="text-sm font-medium mb-1 block">
              Cor de destaque
            </label>
            <Input
              id="accentColor"
              type="color"
              value={accentColor}
              onChange={handleColorChange}
              className="h-10 w-20"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm mb-1">Prévia:</p>
            <div 
              className="h-10 rounded flex items-center justify-center"
              style={{ backgroundColor: accentColor }}
            >
              <Youtube className="mr-2 text-white" size={16} />
              <span className="text-white font-medium">Vídeos em Destaque</span>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-muted/40 border-dashed border-2 rounded-lg p-8 text-center">
          <Youtube className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="text-lg font-medium mb-2">Nenhum vídeo adicionado</h3>
          <p className="text-muted-foreground mb-4">
            Adicione vídeos do YouTube para exibir na página inicial.
          </p>
          <Button onClick={handleAdd}>Adicionar vídeo</Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vídeo</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="w-[100px] text-center">Visível</TableHead>
              <TableHead className="w-[100px] text-center">Ordem</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell className="font-medium">{video.title}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate block"
                  >
                    {video.url}
                  </a>
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={video.showOnHome}
                    onCheckedChange={() => toggleVideoVisibility(video.id)}
                  />
                </TableCell>
                <TableCell className="text-center">{video.order}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(video)}
                    >
                      <Pencil size={16} />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(video.id)}
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingVideo ? "Editar vídeo" : "Adicionar vídeo"}
            </DialogTitle>
            <DialogDescription>
              {editingVideo
                ? "Altere os dados do vídeo selecionado."
                : "Preencha os dados para adicionar um novo vídeo."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Digite o título do vídeo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do YouTube</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </FormControl>
                    <FormDescription>
                      Use o formato padrão do YouTube (watch?v=) ou incorporado (embed/).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="showOnHome"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Exibir no site</FormLabel>
                        <FormDescription>
                          Mostrar este vídeo no carrossel
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordem</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Define a ordem de exibição
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <input type="hidden" {...form.register("id")} />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {editingVideo ? "Salvar alterações" : "Adicionar vídeo"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
