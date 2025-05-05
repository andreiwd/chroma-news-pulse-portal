
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CategoryEmptyState() {
  return (
    <div className="text-center py-10">
      <p className="text-xl">Nenhuma notícia encontrada nesta categoria.</p>
      <Button className="mt-4" asChild>
        <Link to="/">Voltar para a página inicial</Link>
      </Button>
    </div>
  );
}
