import { MarketsGrid } from "@/components/markets-grid";

export default function Home() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          El futuro tiene precio
        </h1>
        <p className="text-lg text-muted-foreground">
          Apostá a política, fútbol, dólar y más!
        </p>
      </div>
      
      <MarketsGrid />
    </div>
  );
}
