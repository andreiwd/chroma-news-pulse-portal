
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, Edit, Plus, Trash } from "lucide-react";

interface Ad {
  id: string;
  name: string;
  position: string;
  code: string;
  active: boolean;
}

export default function AdsManager() {
  const { toast } = useToast();
  const [ads, setAds] = useState<Ad[]>([
    {
      id: '1',
      name: 'Banner Topo',
      position: 'header',
      code: '<script>console.log("Banner Topo");</script>',
      active: true
    },
    {
      id: '2',
      name: 'Lateral Direita',
      position: 'sidebar',
      code: '<script>console.log("Lateral Direita");</script>',
      active: true
    },
    {
      id: '3',
      name: 'Rodapé',
      position: 'footer',
      code: '<script>console.log("Rodapé");</script>',
      active: false
    }
  ]);
  
  const [formData, setFormData] = useState<Omit<Ad, 'id'>>({
    name: '',
    position: '',
    code: '',
    active: true
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
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
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Editar anúncio existente
      setAds(ads.map(ad => 
        ad.id === editingId ? { ...formData, id: editingId } : ad
      ));
      
      toast({
        title: "Anúncio atualizado",
        description: `O anúncio "${formData.name}" foi atualizado com sucesso.`
      });
    } else {
      // Adicionar novo anúncio
      const newAd = {
        ...formData,
        id: Date.now().toString()
      };
      
      setAds([...ads, newAd]);
      
      toast({
        title: "Anúncio adicionado",
        description: `O anúncio "${formData.name}" foi adicionado com sucesso.`
      });
    }
    
    resetForm();
    setDialogOpen(false);
  };
  
  const handleEdit = (ad: Ad) => {
    setFormData({
      name: ad.name,
      position: ad.position,
      code: ad.code,
      active: ad.active
    });
    setEditingId(ad.id);
    setDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setAds(ads.filter(ad => ad.id !== id));
    
    toast({
      title: "Anúncio removido",
      description: "O anúncio foi removido com sucesso."
    });
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      code: '',
      active: true
    });
    setEditingId(null);
  };
  
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) resetForm();
  };
  
  const toggleAdStatus = (id: string) => {
    setAds(ads.map(ad => 
      ad.id === id ? { ...ad, active: !ad.active } : ad
    ));
    
    const ad = ads.find(ad => ad.id === id);
    const status = ad?.active ? "desativado" : "ativado";
    
    toast({
      title: `Anúncio ${status}`,
      description: `O anúncio "${ad?.name}" foi ${status} com sucesso.`
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciador de Anúncios</h1>
          <p className="text-muted-foreground">
            Gerencie os anúncios que serão exibidos no site
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Novo Anúncio</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Anúncio" : "Adicionar Novo Anúncio"}
              </DialogTitle>
              <DialogDescription>
                Preencha os detalhes do anúncio abaixo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ad-name">Nome do Anúncio</Label>
                <Input
                  id="ad-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Banner Topo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-position">Posição</Label>
                <Input
                  id="ad-position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Ex: header, sidebar, footer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-code">Código do Anúncio</Label>
                <textarea
                  id="ad-code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Cole o código HTML/JavaScript aqui"
                  className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  id="ad-active"
                  name="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="ad-active">Anúncio ativo</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingId ? "Salvar alterações" : "Adicionar anúncio"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Anúncios configurados</CardTitle>
          <CardDescription>
            Lista de anúncios cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ads.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                Nenhum anúncio cadastrado. Clique em "Novo Anúncio" para começar.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Posição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell className="font-medium">{ad.name}</TableCell>
                    <TableCell>{ad.position}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ad.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {ad.active ? "Ativo" : "Inativo"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleAdStatus(ad.id)}
                          title={ad.active ? "Desativar" : "Ativar"}
                        >
                          <Check size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(ad)}
                          title="Editar"
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(ad.id)}
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
      
      <Card>
        <CardHeader>
          <CardTitle>Código Global do Google Ads</CardTitle>
          <CardDescription>
            Configure o código global do Google Ads para todo o site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <textarea
              placeholder="Cole o código do Google Ads aqui"
              className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
            <Button>Salvar código global</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
