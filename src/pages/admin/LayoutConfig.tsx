
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { useLayoutBlocks } from "@/hooks/useLayoutBlocks";

export default function LayoutConfig() {
  const { blocks, loading, addBlock, removeBlock, moveBlock } = useLayoutBlocks();
  const { data: categories } = useCategories();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newBlockType, setNewBlockType] = useState<'carousel' | 'section'>('section');
  const [newBlockCategory, setNewBlockCategory] = useState("");

  const handleAddBlock = async () => {
    if (!newBlockCategory) {
      toast({
        title: "Erro",
        description: "Selecione uma categoria",
        variant: "destructive",
      });
      return;
    }

    const result = await addBlock(newBlockType, newBlockCategory);
    if (result) {
      setOpen(false);
      setNewBlockCategory("");
    }
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
                <Button onClick={handleAddBlock}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ) : blocks.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground">
                    Nenhum bloco adicionado. Clique em "Adicionar Bloco" para começar.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {blocks.map((block) => (
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
                            {block.type === 'carousel' ? 'Carrossel' : 'Seção'}: {getCategoryName(block.category_slug)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {block.category_slug} • Posição: {block.order_position + 1}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => moveBlock(block.id, 'up')}
                          disabled={block.order_position === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => moveBlock(block.id, 'down')}
                          disabled={block.order_position === blocks.length - 1}
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
              )}
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
                  
                  {/* Main News Grid - Standard component */}
                  <div className="h-20 bg-blue-50 border border-blue-200 w-full mb-2 rounded flex items-center justify-center text-xs">
                    Últimas Notícias
                  </div>
                  
                  {/* Blocks representation */}
                  {blocks.map((block) => (
                    <div 
                      key={block.id}
                      className={`h-10 w-full mb-2 rounded flex items-center justify-center text-xs ${
                        block.type === 'carousel' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                          : 'bg-green-100 text-green-800 border border-green-300'
                      }`}
                    >
                      {block.type === 'carousel' ? 'Carrossel' : 'Seção'}: {getCategoryName(block.category_slug)}
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
