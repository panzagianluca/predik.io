import { MarketsGrid } from "@/components/markets-grid";

export default function Home() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Mercados de Predicción
        </h1>
        <p className="text-lg text-muted-foreground">
          Predice el futuro de Argentina y gana con dinero de demostración
        </p>
      </div>
      
      <MarketsGrid />
    </div>
  );
}
