
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCategories } from "@/hooks/useNews";
import { LayoutBlock, LayoutConfig } from "@/types/layoutConfig";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";

export default function LayoutConfig() {
  const [config, setConfig] = useState<LayoutConfig>({ blocks: [] });
  const { data: categories } = useCategories();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newBlockType, setNewBlockType] = useState<'carousel' | 'section'>('section');
  const [newBlockCategory, setNewBlockCategory] = useState("");

  // Load saved configuration from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('homepage_layout');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error("Error parsing saved layout config:", e);
      }
    }
  }, []);

  const saveConfig = () => {
    localStorage.setItem('homepage_layout', JSON.stringify(config));
    toast({
      title: "Configuração salva",
      description: "As alterações foram salvas com sucesso e serão aplicadas na página inicial.",
    });
  };

  const addBlock = () => {
    if (!newBlockCategory) {
      toast({
        title: "Erro",
        description: "Selecione uma categoria",
        variant: "destructive",
      });
      return;
    }

    const newBlock: LayoutBlock = {
      id: `block-${Date.now()}`,
      type: newBlockType,
      categorySlug: newBlockCategory,
      order: config.blocks.length,
    };

    setConfig(prev => ({
      blocks: [...prev.blocks, newBlock]
    }));

    setOpen(false);
    toast({
      title: "Bloco adicionado",
      description: "Clique em Salvar para aplicar as alterações.",
    });
  };

  const removeBlock = (id: string) => {
    setConfig(prev => ({
      blocks: prev.blocks.filter(block => block.id !== id)
    }));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const blockIndex = config.blocks.findIndex(block => block.id === id);
    if (blockIndex === -1) return;

    const newBlocks = [...config.blocks];
    const block = newBlocks[blockIndex];

    // Remove the block from its current position
    newBlocks.splice(blockIndex, 1);

    // Insert it at the new position
    const newIndex = direction === 'up' 
      ? Math.max(0, blockIndex - 1) 
      : Math.min(newBlocks.length, blockIndex + 1);

    newBlocks.splice(newIndex, 0, block);

    // Update order values for all blocks
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index
    }));

    setConfig({ blocks: updatedBlocks });
  };

  const getCategoryName = (slug: string): string => {
    if (!categories) return slug;
    const category = categories.find(cat => cat.slug === slug);
    return category ? category.name : slug;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuração da Página Inicial</h1>
          <p className="text-muted-foreground">
            Configure a disposição de blocos na página inicial do site
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Bloco
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Bloco</DialogTitle>
                <DialogDescription>
                  Configure as propriedades do novo bloco de conteúdo
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="block-type">Tipo de Bloco</Label>
                  <Select 
                    value={newBlockType}
                    onValueChange={(value) => setNewBlockType(value as 'carousel' | 'section')}
                  >
                    <SelectTrigger id="block-type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carousel">Carrossel de Notícias</SelectItem>
                      <SelectItem value="section">Seção de Notícias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="block-category">Categoria</Label>
                  <Select 
                    value={newBlockCategory}
                    onValueChange={setNewBlockCategory}
                  >
                    <SelectTrigger id="block-category">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.slug} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addBlock}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button onClick={saveConfig}>Salvar Configuração</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Layout Config Panel */}
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Blocos de Conteúdo</CardTitle>
              <CardDescription>
                Arraste para reordenar ou adicione novos blocos para personalizar a página inicial
              </CardDescription>
            </CardHeader>
            <CardContent>
              {config.blocks.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground">
                    Nenhum bloco adicionado. Clique em "Adicionar Bloco" para começar.
                  </p>
                </div>
              )}
              <ul className="space-y-2">
                {config.blocks.map((block) => (
                  <li 
                    key={block.id} 
                    className="flex items-center justify-between p-3 bg-muted/40 rounded-md border"
                  >
                    <div className="flex items-center">
                      <div className="bg-primary/10 w-10 h-10 flex items-center justify-center rounded mr-3">
                        {block.type === 'carousel' ? '🎠' : '📰'}
                      </div>
                      <div>
                        <p className="font-medium">
                          {block.type === 'carousel' ? 'Carrossel' : 'Seção'}: {getCategoryName(block.categorySlug)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {block.categorySlug} • Posição: {block.order + 1}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveBlock(block.id, 'up')}
                        disabled={block.order === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => moveBlock(block.id, 'down')}
                        disabled={block.order === config.blocks.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeBlock(block.id)}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Os blocos serão mostrados na página inicial na ordem definida acima.
              </p>
            </CardFooter>
          </Card>
        </div>
        
        {/* Preview Panel */}
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Pré-visualização</CardTitle>
              <CardDescription>
                Visualize como os blocos vão aparecer na página inicial
              </CardDescription>
            </CardHeader>
            <CardContent className="relative min-h-[400px] border rounded-md p-4">
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded-md">
                <div className="w-full max-w-[200px] mx-auto">
                  {/* Hero representation */}
                  <div className="h-16 bg-primary/20 w-full mb-2 rounded flex items-center justify-center">
                    Hero
                  </div>
                  
                  {/* Blocks representation */}
                  {config.blocks.map((block, index) => (
                    <div 
                      key={block.id}
                      className={`h-10 w-full mb-2 rounded flex items-center justify-center text-xs ${
                        block.type === 'carousel' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                          : 'bg-green-100 text-green-800 border border-green-300'
                      }`}
                    >
                      {block.type === 'carousel' ? 'Carrossel' : 'Seção'}: {getCategoryName(block.categorySlug)}
                    </div>
                  ))}
                  
                  {/* Footer representation */}
                  <div className="h-6 bg-gray-200 w-full mt-4 rounded flex items-center justify-center text-xs">
                    Footer
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
