
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Edit, Plus, Trash } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import CustomHtmlBlock from "@/components/CustomHtmlBlock";

interface HtmlBlock {
  id: string;
  name: string;
  position: string;
  content: string;
  active: boolean;
}

export default function HtmlBlocksManager() {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<HtmlBlock[]>([
    {
      id: '1',
      name: 'Aviso Importante',
      position: 'top-header',
      content: '<div class="bg-red-500 text-white p-2 text-center">Aviso importante para todos os leitores</div>',
      active: true
    },
    {
      id: '2',
      name: 'Caixa de apoio',
      position: 'sidebar',
      content: '<div class="bg-blue-100 p-4 rounded"><h3 class="font-bold">Apoie nosso trabalho</h3><p>Sua contribuição é importante.</p></div>',
      active: true
    },
    {
      id: '3',
      name: 'Informações de contato',
      position: 'footer',
      content: '<div class="text-center"><p>Contato: (16) 99999-9999</p><p>Email: contato@exemplo.com</p></div>',
      active: true
    }
  ]);
  
  const [formData, setFormData] = useState<Omit<HtmlBlock, 'id'>>({
    name: '',
    position: '',
    content: '',
    active: true
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewBlock, setPreviewBlock] = useState<HtmlBlock | null>(null);
  
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
      // Editar bloco existente
      setBlocks(blocks.map(block => 
        block.id === editingId ? { ...formData, id: editingId } : block
      ));
      
      toast({
        title: "Bloco HTML atualizado",
        description: `O bloco "${formData.name}" foi atualizado com sucesso.`
      });
    } else {
      // Adicionar novo bloco
      const newBlock = {
        ...formData,
        id: Date.now().toString()
      };
      
      setBlocks([...blocks, newBlock]);
      
      toast({
        title: "Bloco HTML adicionado",
        description: `O bloco "${formData.name}" foi adicionado com sucesso.`
      });
    }
    
    resetForm();
    setDialogOpen(false);
  };
  
  const handleEdit = (block: HtmlBlock) => {
    setFormData({
      name: block.name,
      position: block.position,
      content: block.content,
      active: block.active
    });
    setEditingId(block.id);
    setDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
    
    toast({
      title: "Bloco HTML removido",
      description: "O bloco foi removido com sucesso."
    });
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      content: '',
      active: true
    });
    setEditingId(null);
  };
  
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) resetForm();
  };
  
  const toggleBlockStatus = (id: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, active: !block.active } : block
    ));
    
    const block = blocks.find(block => block.id === id);
    const status = block?.active ? "desativado" : "ativado";
    
    toast({
      title: `Bloco HTML ${status}`,
      description: `O bloco "${block?.name}" foi ${status} com sucesso.`
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blocos HTML</h1>
          <p className="text-muted-foreground">
            Gerencie blocos HTML personalizados para o site
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Novo Bloco HTML</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Bloco HTML" : "Adicionar Novo Bloco HTML"}
              </DialogTitle>
              <DialogDescription>
                Preencha os detalhes do bloco HTML abaixo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="block-name">Nome do Bloco</Label>
                <Input
                  id="block-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Aviso Importante"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="block-position">Posição</Label>
                <Input
                  id="block-position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Ex: header, sidebar, footer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="block-content">Código HTML</Label>
                <textarea
                  id="block-content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Digite ou cole o código HTML aqui"
                  className="flex h-36 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Dica: Use classes Tailwind CSS para estilos.
                </p>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  id="block-active"
                  name="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="block-active">Bloco ativo</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingId ? "Salvar alterações" : "Adicionar bloco"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Blocos HTML configurados</CardTitle>
          <CardDescription>
            Lista de blocos HTML personalizados cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {blocks.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                Nenhum bloco HTML cadastrado. Clique em "Novo Bloco HTML" para começar.
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
                {blocks.map((block) => (
                  <TableRow key={block.id}>
                    <TableCell className="font-medium">{block.name}</TableCell>
                    <TableCell>{block.position}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        block.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {block.active ? "Ativo" : "Inativo"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Drawer>
                          <DrawerTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setPreviewBlock(block)}
                              title="Visualizar"
                            >
                              <Eye size={18} />
                            </Button>
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>Visualização do Bloco HTML</DrawerTitle>
                              <DrawerDescription>
                                Veja como o bloco "{block.name}" ficará no site.
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 border-t">
                              <div className="mb-4">
                                <h4 className="font-medium mb-2">Resultado:</h4>
                                <div className="border rounded-md p-4">
                                  <CustomHtmlBlock
                                    id={`preview-${block.id}`}
                                    title={block.name}
                                    html={block.content}
                                  />
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Código HTML:</h4>
                                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                                  {block.content}
                                </pre>
                              </div>
                            </div>
                          </DrawerContent>
                        </Drawer>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(block)}
                          title="Editar"
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(block.id)}
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
