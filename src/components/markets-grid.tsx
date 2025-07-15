"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Market } from "@/types/market";

// Mock data for demonstration
const mockMarkets: Market[] = [
  {
    id: 1,
    type: 'binary',
    title: "¿Milei será reelecto en 2027?",
    category: "Política",
    description: "¿Javier Milei será reelecto como presidente de Argentina en las elecciones de 2027?",
    yesPrice: 0.65,
    noPrice: 0.35,
    volume: 125000,
    endDate: "2027-10-30",
    participants: 1250,
    createdAt: "2024-01-15",
    status: 'active'
  },
  {
    id: 2,
    type: 'multiple',
    title: "¿Quién ganará las elecciones presidenciales de 2027?",
    category: "Política", 
    description: "¿Qué candidato ganará las elecciones presidenciales de Argentina en 2027?",
    options: [
      { id: 'milei', text: 'Javier Milei', price: 0.45, color: '#f59e0b' },
      { id: 'massa', text: 'Sergio Massa', price: 0.25, color: '#3b82f6' },
      { id: 'bullrich', text: 'Patricia Bullrich', price: 0.15, color: '#ef4444' },
      { id: 'otros', text: 'Otro candidato', price: 0.15, color: '#6b7280' }
    ],
    volume: 89000,
    endDate: "2027-10-30", 
    participants: 890,
    createdAt: "2024-01-10",
    status: 'active'
  },
  {
    id: 3,
    type: 'binary',
    title: "¿El dólar superará los $2000 pesos en 2025?",
    category: "Economía",
    description: "¿El tipo de cambio oficial USD/ARS superará los $2000 pesos durante 2025?",
    yesPrice: 0.58,
    noPrice: 0.42,
    volume: 210000,
    endDate: "2025-12-31",
    participants: 2100,
    createdAt: "2024-01-20",
    status: 'active'
  },
  {
    id: 4,
    type: 'multiple',
    title: "¿Cuántos goles hará Messi en el Mundial 2026?",
    category: "Deporte",
    description: "¿Cuántos goles marcará Lionel Messi en el Mundial de fútbol de 2026?",
    options: [
      { id: 'no-juega', text: 'No jugará', price: 0.35, color: '#6b7280' },
      { id: '0-goles', text: '0 goles', price: 0.25, color: '#ef4444' },
      { id: '1-2-goles', text: '1-2 goles', price: 0.25, color: '#f59e0b' },
      { id: '3-mas-goles', text: '3+ goles', price: 0.15, color: '#10b981' }
    ],
    volume: 156000,
    endDate: "2026-07-15",
    participants: 1800,
    createdAt: "2024-01-25",
    status: 'active'
  },
  {
    id: 5,
    type: 'binary',
    title: "¿La inflación será menor al 50% en 2025?",
    category: "Economía",
    description: "¿La inflación anual de Argentina será menor al 50% en 2025?",
    yesPrice: 0.38,
    noPrice: 0.62,
    volume: 178000,
    endDate: "2025-12-31",
    participants: 1650,
    createdAt: "2024-02-01",
    status: 'active'
  },
  {
    id: 6,
    type: 'multiple',
    title: "¿Qué equipo ganará el próximo Mundial de Fútbol?",
    category: "Deporte",
    description: "¿Qué selección nacional ganará el Mundial de fútbol de 2026?",
    options: [
      { id: 'argentina', text: 'Argentina', price: 0.30, color: '#3b82f6' },
      { id: 'brasil', text: 'Brasil', price: 0.25, color: '#10b981' },
      { id: 'francia', text: 'Francia', price: 0.20, color: '#8b5cf6' },
      { id: 'españa', text: 'España', price: 0.15, color: '#ef4444' },
      { id: 'otros', text: 'Otro país', price: 0.10, color: '#6b7280' }
    ],
    volume: 45000,
    endDate: "2026-07-15",
    participants: 450,
    createdAt: "2024-02-05",
    status: 'active'
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

function MarketCard({ market }: { market: Market }) {
  return (
    <Link href={`/mercado/${market.id}`}>
      <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        {/* Category Badge */}
        <div className="mb-3 flex justify-between items-center">
          <span className="inline-flex items-center rounded-full bg-[rgb(var(--primary))]/10 px-2.5 py-0.5 text-xs font-medium text-[rgb(var(--primary))]">
            {market.category}
          </span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {market.type === 'binary' ? 'SÍ/NO' : 'Múltiples'}
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
        {market.type === 'binary' ? (
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
        ) : (
          <div className="space-y-2 mb-4">
            {market.options.slice(0, 3).map((option) => (
              <div key={option.id} className="flex justify-between items-center">
                <span className="text-sm truncate mr-2">{option.text}</span>
                <span 
                  className="text-sm font-semibold px-2 py-1 rounded text-white"
                  style={{ backgroundColor: option.color }}
                >
                  ${(option.price * 100).toFixed(0)}¢
                </span>
              </div>
            ))}
            {market.options.length > 3 && (
              <div className="text-xs text-muted-foreground text-center">
                +{market.options.length - 3} opciones más
              </div>
            )}
          </div>
        )}

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
