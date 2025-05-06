
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Plus, Shield, Trash, User } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

export default function UsersManager() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'Administrador',
      email: 'admin@exemplo.com',
      role: 'admin',
      lastLogin: '06/05/2025 10:32'
    },
    {
      id: '2',
      name: 'Editor',
      email: 'editor@exemplo.com',
      role: 'editor',
      lastLogin: '05/05/2025 16:45'
    }
  ]);
  
  const [formData, setFormData] = useState<Omit<AdminUser, 'id' | 'lastLogin'>>({
    name: '',
    email: '',
    role: 'editor'
  });
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar senha
    if (!editingId && password !== confirmPassword) {
      toast({
        title: "Erro na validação",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingId) {
      // Editar usuário existente
      setUsers(users.map(user => 
        user.id === editingId ? 
          { ...user, name: formData.name, email: formData.email, role: formData.role } : 
          user
      ));
      
      toast({
        title: "Usuário atualizado",
        description: `As informações do usuário "${formData.name}" foram atualizadas.`
      });
    } else {
      // Adicionar novo usuário
      const newUser = {
        ...formData,
        id: Date.now().toString(),
        lastLogin: 'Nunca'
      };
      
      setUsers([...users, newUser]);
      
      toast({
        title: "Usuário adicionado",
        description: `O usuário "${formData.name}" foi adicionado com sucesso.`
      });
    }
    
    resetForm();
    setDialogOpen(false);
  };
  
  const handleEdit = (user: AdminUser) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setEditingId(user.id);
    setDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    const userToDelete = users.find(user => user.id === id);
    
    if (users.length === 1) {
      toast({
        title: "Operação negada",
        description: "Não é possível remover o único usuário administrador.",
        variant: "destructive"
      });
      return;
    }
    
    if (userToDelete && userToDelete.email === 'admin@exemplo.com') {
      toast({
        title: "Operação negada",
        description: "Não é possível remover o usuário administrador principal.",
        variant: "destructive"
      });
      return;
    }
    
    setUsers(users.filter(user => user.id !== id));
    
    toast({
      title: "Usuário removido",
      description: `O usuário "${userToDelete?.name}" foi removido com sucesso.`
    });
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'editor'
    });
    setPassword('');
    setConfirmPassword('');
    setEditingId(null);
  };
  
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) resetForm();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do painel administrativo
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Novo Usuário</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Usuário" : "Adicionar Novo Usuário"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do usuário abaixo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Nome completo</Label>
                <Input
                  id="user-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome do usuário"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-role">Função</Label>
                <select
                  id="user-role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                >
                  <option value="admin">Administrador</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              
              {!editingId && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="user-password">Senha</Label>
                    <Input
                      id="user-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite a senha"
                      required={!editingId}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-confirm-password">Confirmar senha</Label>
                    <Input
                      id="user-confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme a senha"
                      required={!editingId}
                    />
                  </div>
                </>
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingId ? "Salvar alterações" : "Adicionar usuário"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Usuários cadastrados</CardTitle>
          <CardDescription>
            Lista de usuários com acesso ao painel administrativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Último acesso</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {user.role === 'admin' ? (
                        <>
                          <Shield size={16} className="mr-1 text-primary" />
                          <span>Administrador</span>
                        </>
                      ) : (
                        <>
                          <User size={16} className="mr-1 text-muted-foreground" />
                          <span>Editor</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user)}
                        title="Editar"
                      >
                        <Edit size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                        disabled={user.email === 'admin@exemplo.com'}
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
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>
            Configurações de segurança para acesso ao painel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Autenticação de dois fatores</h3>
                <p className="text-sm text-muted-foreground">
                  Aumenta a segurança exigindo um segundo método de autenticação
                </p>
              </div>
              <Button variant="outline">Configurar</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Tentativas de login</h3>
                <p className="text-sm text-muted-foreground">
                  Limite de tentativas de login por IP
                </p>
              </div>
              <Button variant="outline">Configurar</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Alterar senha padrão</h3>
                <p className="text-sm text-muted-foreground">
                  Altere a senha do administrador principal
                </p>
              </div>
              <Button variant="outline">Alterar</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
