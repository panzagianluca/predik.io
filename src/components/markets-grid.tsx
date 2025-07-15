"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data for demonstration
const mockMarkets = [
  {
    id: 1,
    title: "¿Milei será reelecto en 2027?",
    category: "Política",
    description: "¿Javier Milei será reelecto como presidente de Argentina en las elecciones de 2027?",
    yesPrice: 0.65,
    noPrice: 0.35,
    volume: 125000,
    endDate: "2027-10-30",
    participants: 1250
  },
  {
    id: 2,
    title: "¿Argentina ganará la Copa América 2024?",
    category: "Deporte",
    description: "¿La selección argentina de fútbol ganará la Copa América 2024?",
    yesPrice: 0.72,
    noPrice: 0.28,
    volume: 89000,
    endDate: "2024-07-15",
    participants: 890
  },
  {
    id: 3,
    title: "¿El dólar superará los $2000 pesos en 2025?",
    category: "Economía",
    description: "¿El tipo de cambio oficial USD/ARS superará los $2000 pesos durante 2025?",
    yesPrice: 0.58,
    noPrice: 0.42,
    volume: 210000,
    endDate: "2025-12-31",
    participants: 2100
  },
  {
    id: 4,
    title: "¿Messi jugará el Mundial 2026?",
    category: "Deporte",
    description: "¿Lionel Messi participará en el Mundial de fútbol de 2026?",
    yesPrice: 0.45,
    noPrice: 0.55,
    volume: 156000,
    endDate: "2026-06-01",
    participants: 1800
  },
  {
    id: 5,
    title: "¿La inflación será menor al 50% en 2025?",
    category: "Economía",
    description: "¿La inflación anual de Argentina será menor al 50% en 2025?",
    yesPrice: 0.38,
    noPrice: 0.62,
    volume: 178000,
    endDate: "2025-12-31",
    participants: 1650
  },
  {
    id: 6,
    title: "¿Habrá un nuevo récord de temperatura en Buenos Aires?",
    category: "Clima",
    description: "¿Se registrará un nuevo récord de temperatura máxima en Buenos Aires durante 2025?",
    yesPrice: 0.52,
    noPrice: 0.48,
    volume: 45000,
    endDate: "2025-12-31",
    participants: 450
  }
];

const categories = ["Todos", "Política", "Deporte", "Economía", "Clima"];

export function MarketsGrid() {
  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === "Todos" ? "default" : "outline"}
            size="sm"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Markets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
    </div>
  );
}

function MarketCard({ market }: { market: typeof mockMarkets[0] }) {
  return (
    <Link href={`/mercado/${market.id}`}>
      <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-flex items-center rounded-full bg-[rgb(var(--primary))]/10 px-2.5 py-0.5 text-xs font-medium text-[rgb(var(--primary))]">
            {market.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {market.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {market.description}
        </p>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="rounded-md bg-green-50 border border-green-200 p-2 text-center">
            <div className="text-xs text-green-700 font-medium">SÍ</div>
            <div className="text-lg font-bold text-green-800">
              ${(market.yesPrice * 100).toFixed(0)}¢
            </div>
          </div>
          <div className="rounded-md bg-red-50 border border-red-200 p-2 text-center">
            <div className="text-xs text-red-700 font-medium">NO</div>
            <div className="text-lg font-bold text-red-800">
              ${(market.noPrice * 100).toFixed(0)}¢
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Vol: ${market.volume.toLocaleString()}</span>
          <span>{market.participants} traders</span>
        </div>

        {/* End Date */}
        <div className="mt-2 text-xs text-muted-foreground">
          Cierra: {new Date(market.endDate).toLocaleDateString('es-AR')}
        </div>
      </div>
    </Link>
  );
}
