
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CategoryErrorStateProps {
  error: string | null;
}

export default function CategoryErrorState({ error }: CategoryErrorStateProps) {
  return (
    <div className="text-center py-10">
      <p className="text-xl">Ocorreu um erro ao carregar esta categoria.</p>
      <p className="text-sm text-gray-500 mt-2">{error}</p>
      <Button className="mt-4" asChild>
        <Link to="/">Voltar para a página inicial</Link>
      </Button>
    </div>
  );
}
