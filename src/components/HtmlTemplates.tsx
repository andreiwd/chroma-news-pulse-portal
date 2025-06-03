
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CustomHtmlBlock from "./CustomHtmlBlock";

export interface HtmlTemplate {
  id: string;
  name: string;
  description: string;
  position: string;
  content: string;
}

export const htmlTemplates: HtmlTemplate[] = [
  {
    id: "alert-info",
    name: "Aviso Informativo",
    description: "Um aviso azul para informações importantes",
    position: "main-content",
    content: `<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
  <div class="flex items-start">
    <div class="flex-shrink-0">
      <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-blue-800">Informação Importante</h3>
      <p class="mt-1 text-sm text-blue-700">Este é um exemplo de aviso informativo que pode ser usado para destacar informações importantes para os usuários.</p>
    </div>
  </div>
</div>`
  },
  {
    id: "alert-warning",
    name: "Aviso de Atenção",
    description: "Um aviso amarelo para alertas importantes",
    position: "main-content",
    content: `<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
  <div class="flex items-start">
    <div class="flex-shrink-0">
      <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-yellow-800">Atenção</h3>
      <p class="mt-1 text-sm text-yellow-700">Este é um aviso de atenção que pode ser usado para alertar sobre situações importantes.</p>
    </div>
  </div>
</div>`
  },
  {
    id: "cta-banner",
    name: "Banner Call-to-Action",
    description: "Banner promocional com botão de ação",
    position: "main-content",
    content: `<div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-6">
  <div class="flex items-center justify-between">
    <div>
      <h3 class="text-xl font-bold mb-2">Não perca nenhuma notícia!</h3>
      <p class="text-blue-100">Receba as últimas notícias diretamente no seu email.</p>
    </div>
    <div class="ml-6">
      <button class="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
        Inscrever-se
      </button>
    </div>
  </div>
</div>`
  },
  {
    id: "news-highlight",
    name: "Destaque de Notícia",
    description: "Card especial para destacar uma notícia importante",
    position: "sidebar",
    content: `<div class="bg-white border-l-4 border-red-500 shadow-md rounded-r-lg p-4 mb-4">
  <div class="flex items-start">
    <div class="flex-shrink-0">
      <span class="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">URGENTE</span>
    </div>
    <div class="ml-3">
      <h4 class="text-lg font-semibold text-gray-900 mb-2">Título da Notícia Importante</h4>
      <p class="text-gray-600 text-sm mb-3">Resumo da notícia que será destacada neste espaço especial...</p>
      <a href="#" class="text-red-600 text-sm font-medium hover:text-red-800">Ler mais →</a>
    </div>
  </div>
</div>`
  },
  {
    id: "social-share",
    name: "Botões de Compartilhamento",
    description: "Conjunto de botões para redes sociais",
    position: "after-header",
    content: `<div class="bg-gray-100 py-3">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-center space-x-4">
      <span class="text-sm text-gray-600 font-medium">Siga-nos:</span>
      <a href="#" class="text-blue-600 hover:text-blue-800 transition-colors">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
        </svg>
      </a>
      <a href="#" class="text-blue-700 hover:text-blue-900 transition-colors">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>
      <a href="#" class="text-pink-600 hover:text-pink-800 transition-colors">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
        </svg>
      </a>
    </div>
  </div>
</div>`
  }
];

interface HtmlTemplatesProps {
  onSelectTemplate: (template: HtmlTemplate) => void;
}

export default function HtmlTemplates({ onSelectTemplate }: HtmlTemplatesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {htmlTemplates.map((template) => (
        <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                <CardDescription className="text-xs mt-1">{template.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye size={14} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Preview: {template.name}</DialogTitle>
                      <DialogDescription>{template.description}</DialogDescription>
                    </DialogHeader>
                    <div className="border rounded-md p-4 bg-white">
                      <CustomHtmlBlock
                        id={`template-preview-${template.id}`}
                        title={template.name}
                        html={template.content}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onSelectTemplate(template)}
                  className="text-xs"
                >
                  Usar
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
