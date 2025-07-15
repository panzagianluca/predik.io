"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Market } from "@/types/market";
import { Users, DollarSign, Archive, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

// Mock data for demonstration - Expanded to 26 markets
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
  },
  {
    id: 7,
    type: 'binary',
    title: "¿River ganará la Libertadores 2025?",
    category: "Deporte",
    description: "¿Club Atlético River Plate ganará la Copa Libertadores 2025?",
    yesPrice: 0.22,
    noPrice: 0.78,
    volume: 89000,
    endDate: "2025-11-30",
    participants: 890,
    createdAt: "2024-01-10",
    status: 'active'
  },
  {
    id: 8,
    type: 'multiple',
    title: "¿Qué será el clima este verano?",
    category: "Clima",
    description: "¿Cómo será la temperatura promedio del verano 2024-2025 en Buenos Aires?",
    options: [
      { id: 'muy-calido', text: 'Muy cálido (>28°C)', price: 0.40, color: '#ef4444' },
      { id: 'normal', text: 'Normal (24-28°C)', price: 0.35, color: '#f59e0b' },
      { id: 'fresco', text: 'Fresco (<24°C)', price: 0.25, color: '#3b82f6' }
    ],
    volume: 34000,
    endDate: "2025-03-20",
    participants: 340,
    createdAt: "2024-12-01",
    status: 'active'
  },
  {
    id: 9,
    type: 'binary',
    title: "¿Habrá recesión en 2025?",
    category: "Economía",
    description: "¿Argentina entrará en recesión técnica durante 2025?",
    yesPrice: 0.47,
    noPrice: 0.53,
    volume: 156000,
    endDate: "2025-12-31",
    participants: 1200,
    createdAt: "2024-01-08",
    status: 'active'
  },
  {
    id: 10,
    type: 'binary',
    title: "¿Boca será campeón este año?",
    category: "Deporte",
    description: "¿Club Atlético Boca Juniors ganará el campeonato argentino 2025?",
    yesPrice: 0.35,
    noPrice: 0.65,
    volume: 112000,
    endDate: "2025-12-15",
    participants: 980,
    createdAt: "2024-02-15",
    status: 'active'
  },
  {
    id: 11,
    type: 'multiple',
    title: "¿Cuál será la película más taquillera?",
    category: "Entretenimiento",
    description: "¿Qué película será la más taquillera de 2025 a nivel mundial?",
    options: [
      { id: 'marvel', text: 'Película de Marvel', price: 0.30, color: '#ef4444' },
      { id: 'disney', text: 'Película de Disney', price: 0.25, color: '#3b82f6' },
      { id: 'sequel', text: 'Secuela/Remake', price: 0.25, color: '#f59e0b' },
      { id: 'original', text: 'Historia original', price: 0.20, color: '#10b981' }
    ],
    volume: 67000,
    endDate: "2025-12-31",
    participants: 670,
    createdAt: "2024-01-20",
    status: 'active'
  },
  {
    id: 12,
    type: 'binary',
    title: "¿Llueve más de 3 días seguidos en enero?",
    category: "Clima",
    description: "¿Habrá 3 o más días consecutivos de lluvia en Buenos Aires durante enero 2025?",
    yesPrice: 0.42,
    noPrice: 0.58,
    volume: 23000,
    endDate: "2025-01-31",
    participants: 230,
    createdAt: "2024-12-20",
    status: 'active'
  },
  {
    id: 13,
    type: 'binary',
    title: "¿Tesla supera los $300 por acción?",
    category: "Tecnología",
    description: "¿Las acciones de Tesla superarán los $300 USD antes del final de 2025?",
    yesPrice: 0.61,
    noPrice: 0.39,
    volume: 189000,
    endDate: "2025-12-31",
    participants: 1890,
    createdAt: "2024-01-05",
    status: 'active'
  },
  {
    id: 14,
    type: 'multiple',
    title: "¿Qué criptomoneda subirá más?",
    category: "Tecnología",
    description: "¿Qué criptomoneda tendrá mayor ganancia porcentual en 2025?",
    options: [
      { id: 'bitcoin', text: 'Bitcoin', price: 0.35, color: '#f59e0b' },
      { id: 'ethereum', text: 'Ethereum', price: 0.30, color: '#3b82f6' },
      { id: 'altcoin', text: 'Otra altcoin', price: 0.25, color: '#10b981' },
      { id: 'stablecoin', text: 'Stablecoin', price: 0.10, color: '#6b7280' }
    ],
    volume: 134000,
    endDate: "2025-12-31",
    participants: 1340,
    createdAt: "2024-01-12",
    status: 'active'
  },
  {
    id: 15,
    type: 'binary',
    title: "¿Cristina será candidata en 2027?",
    category: "Política",
    description: "¿Cristina Fernández de Kirchner será candidata presidencial en las elecciones de 2027?",
    yesPrice: 0.54,
    noPrice: 0.46,
    volume: 201000,
    endDate: "2027-08-31",
    participants: 2010,
    createdAt: "2024-01-18",
    status: 'active'
  },
  {
    id: 16,
    type: 'binary',
    title: "¿Aparece vida extraterrestre en 2025?",
    category: "Ciencia",
    description: "¿Se confirma oficialmente la existencia de vida extraterrestre durante 2025?",
    yesPrice: 0.08,
    noPrice: 0.92,
    volume: 78000,
    endDate: "2025-12-31",
    participants: 780,
    createdAt: "2024-01-01",
    status: 'active'
  },
  {
    id: 17,
    type: 'multiple',
    title: "¿Cuál será el streaming más popular?",
    category: "Entretenimiento",
    description: "¿Qué plataforma de streaming tendrá más suscriptores a fin de 2025?",
    options: [
      { id: 'netflix', text: 'Netflix', price: 0.40, color: '#ef4444' },
      { id: 'disney', text: 'Disney+', price: 0.25, color: '#3b82f6' },
      { id: 'amazon', text: 'Amazon Prime', price: 0.20, color: '#f59e0b' },
      { id: 'otros', text: 'Otro', price: 0.15, color: '#6b7280' }
    ],
    volume: 45000,
    endDate: "2025-12-31",
    participants: 450,
    createdAt: "2024-02-10",
    status: 'active'
  },
  {
    id: 18,
    type: 'binary',
    title: "¿Lollapalooza vuelve a Argentina?",
    category: "Entretenimiento",
    description: "¿El festival Lollapalooza regresará a Argentina en 2025?",
    yesPrice: 0.73,
    noPrice: 0.27,
    volume: 56000,
    endDate: "2025-12-31",
    participants: 560,
    createdAt: "2024-01-25",
    status: 'active'
  },
  {
    id: 19,
    type: 'binary',
    title: "¿Hace más de 40°C en Buenos Aires?",
    category: "Clima",
    description: "¿La temperatura en Buenos Aires superará los 40°C durante el verano 2024-2025?",
    yesPrice: 0.68,
    noPrice: 0.32,
    volume: 34000,
    endDate: "2025-03-20",
    participants: 340,
    createdAt: "2024-12-15",
    status: 'active'
  },
  {
    id: 20,
    type: 'multiple',
    title: "¿Quién ganará el Martín Fierro 2025?",
    category: "Entretenimiento",
    description: "¿Qué programa ganará el Martín Fierro al mejor programa de televisión 2025?",
    options: [
      { id: 'mirtha', text: 'La Noche de Mirtha', price: 0.30, color: '#f59e0b' },
      { id: 'tinelli', text: 'Programa de Tinelli', price: 0.25, color: '#3b82f6' },
      { id: 'susana', text: 'Susana Giménez', price: 0.25, color: '#ef4444' },
      { id: 'otro', text: 'Otro programa', price: 0.20, color: '#10b981' }
    ],
    volume: 42000,
    endDate: "2025-05-15",
    participants: 420,
    createdAt: "2024-02-01",
    status: 'active'
  },
  {
    id: 21,
    type: 'binary',
    title: "¿OpenAI lanza GPT-5 en 2025?",
    category: "Tecnología",
    description: "¿OpenAI lanzará oficialmente GPT-5 durante el año 2025?",
    yesPrice: 0.76,
    noPrice: 0.24,
    volume: 167000,
    endDate: "2025-12-31",
    participants: 1670,
    createdAt: "2024-01-03",
    status: 'active'
  },
  {
    id: 22,
    type: 'binary',
    title: "¿Racing desciende este año?",
    category: "Deporte",
    description: "¿Racing Club descenderá a la Primera Nacional en 2025?",
    yesPrice: 0.15,
    noPrice: 0.85,
    volume: 67000,
    endDate: "2025-12-15",
    participants: 670,
    createdAt: "2024-02-20",
    status: 'active'
  },
  {
    id: 23,
    type: 'multiple',
    title: "¿Cuál será el precio del Bitcoin?",
    category: "Tecnología",
    description: "¿En qué rango estará el precio del Bitcoin al final de 2025?",
    options: [
      { id: 'bajo-50k', text: 'Menos de $50k', price: 0.20, color: '#ef4444' },
      { id: '50k-100k', text: '$50k - $100k', price: 0.35, color: '#f59e0b' },
      { id: '100k-150k', text: '$100k - $150k', price: 0.30, color: '#10b981' },
      { id: 'mas-150k', text: 'Más de $150k', price: 0.15, color: '#8b5cf6' }
    ],
    volume: 234000,
    endDate: "2025-12-31",
    participants: 2340,
    createdAt: "2024-01-07",
    status: 'active'
  },
  {
    id: 24,
    type: 'binary',
    title: "¿Vuelve el servicio militar obligatorio?",
    category: "Política",
    description: "¿Argentina reinstaurará el servicio militar obligatorio durante 2025?",
    yesPrice: 0.23,
    noPrice: 0.77,
    volume: 89000,
    endDate: "2025-12-31",
    participants: 890,
    createdAt: "2024-01-30",
    status: 'active'
  },
  {
    id: 25,
    type: 'binary',
    title: "¿Llueve en el día de la independencia?",
    category: "Clima",
    description: "¿Llueve en Buenos Aires el 9 de julio de 2025?",
    yesPrice: 0.31,
    noPrice: 0.69,
    volume: 12000,
    endDate: "2025-07-09",
    participants: 120,
    createdAt: "2024-06-01",
    status: 'active'
  },
  {
    id: 26,
    type: 'multiple',
    title: "¿Qué empresa será más valiosa?",
    category: "Tecnología",
    description: "¿Qué empresa tendrá la mayor capitalización de mercado a fin de 2025?",
    options: [
      { id: 'apple', text: 'Apple', price: 0.35, color: '#6b7280' },
      { id: 'microsoft', text: 'Microsoft', price: 0.30, color: '#3b82f6' },
      { id: 'nvidia', text: 'NVIDIA', price: 0.25, color: '#10b981' },
      { id: 'otra', text: 'Otra empresa', price: 0.10, color: '#ef4444' }
    ],
    volume: 178000,
    endDate: "2025-12-31",
    participants: 1780,
    createdAt: "2024-01-14",
    status: 'active'
  }
];

const categories = ["Todos", "Política", "Deporte", "Economía", "Clima", "Tecnología", "Entretenimiento", "Ciencia"];

type SortOption = 'recent' | 'ending-soon' | 'volume' | 'trending';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'trending', label: 'Trending' },
  { value: 'recent', label: 'Más Recientes' },
  { value: 'ending-soon', label: 'Cerca a Terminar' },
  { value: 'volume', label: 'Mayor Volumen' }
];

export function MarketsGrid() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedSort, setSelectedSort] = useState<SortOption>('trending');
  const [showClosed, setShowClosed] = useState(false);
  const [displayedMarkets, setDisplayedMarkets] = useState<Market[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Filter and sort markets
  const getFilteredAndSortedMarkets = useCallback(() => {
    let filtered = mockMarkets;

    // Filter by category
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(market => market.category === selectedCategory);
    }

    // Filter by status
    if (showClosed) {
      filtered = filtered.filter(market => market.status === 'closed');
    } else {
      filtered = filtered.filter(market => market.status === 'active');
    }

    // Sort markets
    switch (selectedSort) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'ending-soon':
        filtered.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
        break;
      case 'volume':
        filtered.sort((a, b) => b.volume - a.volume);
        break;
      case 'trending':
        // For trending, we'll sort by a combination of recent activity and participants
        filtered.sort((a, b) => {
          const aScore = a.participants * 0.7 + (Date.now() - new Date(a.createdAt).getTime()) * -0.3;
          const bScore = b.participants * 0.7 + (Date.now() - new Date(b.createdAt).getTime()) * -0.3;
          return bScore - aScore;
        });
        break;
    }

    return filtered;
  }, [selectedCategory, selectedSort, showClosed]);

  // Load more markets
  const loadMore = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    const filteredMarkets = getFilteredAndSortedMarkets();
    const currentLength = displayedMarkets.length;
    const nextBatch = filteredMarkets.slice(currentLength, currentLength + 9);
    
    setTimeout(() => {
      setDisplayedMarkets(prev => {
        // Check for duplicates before adding
        const existingIds = new Set(prev.map(m => m.id));
        const uniqueNextBatch = nextBatch.filter(m => !existingIds.has(m.id));
        return [...prev, ...uniqueNextBatch];
      });
      const newLength = currentLength + nextBatch.length;
      setHasMore(newLength < filteredMarkets.length);
      setIsLoading(false);
    }, 500); // Simulate loading delay
  }, [displayedMarkets.length, getFilteredAndSortedMarkets, isLoading]);

  // Reset markets when filters change
  useEffect(() => {
    const filteredMarkets = getFilteredAndSortedMarkets();
    setDisplayedMarkets(filteredMarkets.slice(0, 9));
    setHasMore(filteredMarkets.length > 9);
  }, [getFilteredAndSortedMarkets]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  return (
    <div className="space-y-6">
      {/* Filters - Combined in one row */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Category Filter */}
        <div className="flex rounded-lg border p-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                selectedCategory === category
                  ? 'bg-[rgb(var(--primary))] text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort Filter */}
        <div className="flex rounded-lg border p-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedSort(option.value)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
                selectedSort === option.value
                  ? 'bg-[rgb(var(--primary))] text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {option.value === 'trending' && <TrendingUp size={12} />}
              {option.label}
            </button>
          ))}
        </div>
        
        {/* Cerrados filter */}
        <div className="ml-auto">
          <Button
            variant={showClosed ? "default" : "outline"}
            size="sm"
            onClick={() => setShowClosed(!showClosed)}
            className={`text-xs font-medium ${showClosed ? "" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
          >
            <Archive size={14} className="mr-1" />
            Cerrados
          </Button>
        </div>
      </div>

      {/* Markets Grid - Masonry Style */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {displayedMarkets.map((market, index) => (
          <div key={`${market.id}-${index}`} className="break-inside-avoid mb-6">
            <MarketCard market={market} />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-muted-foreground mt-2">Cargando más mercados...</p>
        </div>
      )}

      {/* Load more trigger */}
      {hasMore && !isLoading && (
        <div ref={observerRef} className="h-4" />
      )}

      {/* No more markets message */}
      {!hasMore && displayedMarkets.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay más mercados para mostrar</p>
        </div>
      )}

      {/* No markets found */}
      {displayedMarkets.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron mercados para los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
}

function MarketCard({ market }: { market: Market }) {
  return (
    <Link href={`/mercado/${market.id}`}>
      <div className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
        {/* Image Placeholder with Overlay */}
        <div className="relative h-32 bg-gradient-to-br from-purple-100 to-purple-200">
          {/* Placeholder image area */}
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Imagen</span>
          </div>
          
          {/* Overlay with Category and Type */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-purple-600 shadow-sm">
              {market.category}
            </span>
            <span className="text-xs text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
              {market.type === 'binary' ? 'SÍ/NO' : 'Múltiples'}
            </span>
          </div>
        </div>

        <div className="p-4">
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
                  {(market.yesPrice * 100).toFixed(0)}%
                </div>
              </div>
              <div className="rounded-md bg-red-50 border border-red-200 p-2 text-center">
                <div className="text-xs text-red-700 font-medium">NO</div>
                <div className="text-lg font-bold text-red-800">
                  {(market.noPrice * 100).toFixed(0)}%
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
                    {(option.price * 100).toFixed(0)}%
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

          {/* Bottom Stats Row */}
          <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-3 mt-4">
            <div className="flex items-center gap-1">
              <DollarSign size={12} />
              <span>${market.volume.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>{market.participants}</span>
            </div>
            <span>Cierra: {new Date(market.endDate).toLocaleDateString('es-AR')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
