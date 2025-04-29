
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function NewsletterSignup() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Assinatura realizada com sucesso!",
        description: "Você receberá nossas notícias no e-mail informado.",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-muted p-4 rounded-lg text-center">
      <h3 className="font-medium mb-2">Assine nossa newsletter</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Receba as principais notícias diretamente no seu email
      </p>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Seu e-mail" 
          className="w-full p-2 rounded border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button 
          type="submit"
          className="bg-primary text-white rounded px-4 py-2 text-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processando..." : "Assinar"}
        </button>
      </form>
    </div>
  );
}
