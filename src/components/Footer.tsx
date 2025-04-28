
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { useCategories } from "@/hooks/useNews";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { Category } from "@/types/api";

export default function Footer() {
  const { data: categoriesData } = useCategories();
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  // Ensure categories is always an array
  const safeCategories: Category[] = Array.isArray(categoriesData) ? categoriesData : [];
  
  // Split categories into two columns
  const midPoint = Math.ceil(safeCategories.length / 2);
  const firstColumn = safeCategories.slice(0, midPoint);
  const secondColumn = safeCategories.slice(midPoint);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we'd normally send the form data to a backend
    console.log("Contact form submitted:", contactForm);
    toast({
      title: "Mensagem enviada",
      description: "Agradecemos seu contato. Responderemos em breve!",
    });
    // Reset form
    setContactForm({ name: "", email: "", message: "" });
  };

  return (
    <footer className="bg-muted/30 border-t mt-10">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* About section */}
          <div className="md:col-span-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
              ChromaNews
            </h3>
            <p className="text-muted-foreground mb-4">
              Seu portal de notícias completo e confiável. Trazendo as últimas atualizações e as histórias mais relevantes para você.
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4" />
              <span>contato@chromanews.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>(11) 99999-9999</span>
            </div>
          </div>
          
          {/* Quick Links - Categories */}
          <div className="md:col-span-4">
            <h4 className="font-bold mb-4 border-b pb-2">Categorias</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                {firstColumn.map(category => (
                  <Link 
                    key={category.id} 
                    to={`/category/${category.slug}`}
                    className="block py-1 hover:underline"
                    style={{ color: category.color || 'inherit' }}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <div>
                {secondColumn.map(category => (
                  <Link 
                    key={category.id} 
                    to={`/category/${category.slug}`}
                    className="block py-1 hover:underline"
                    style={{ color: category.color || 'inherit' }}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="md:col-span-4">
            <h4 className="font-bold mb-4 border-b pb-2">Fale Conosco</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Input 
                  type="text" 
                  placeholder="Seu nome"
                  name="name"
                  value={contactForm.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <Input 
                  type="email" 
                  placeholder="Seu e-mail"
                  name="email"
                  value={contactForm.email}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <Textarea 
                  placeholder="Sua mensagem"
                  name="message"
                  value={contactForm.message}
                  onChange={handleFormChange}
                  rows={3}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Enviar Mensagem
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ChromaNews. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
