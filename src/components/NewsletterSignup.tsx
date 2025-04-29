
export default function NewsletterSignup() {
  return (
    <div className="bg-muted p-4 rounded-lg text-center">
      <h3 className="font-medium mb-2">Assine nossa newsletter</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Receba as principais notícias diretamente no seu email
      </p>
      <form className="flex flex-col gap-2">
        <input 
          type="email" 
          placeholder="Seu e-mail" 
          className="w-full p-2 rounded border"
        />
        <button 
          type="submit"
          className="bg-primary text-white rounded px-4 py-2 text-sm"
        >
          Assinar
        </button>
      </form>
    </div>
  );
}
