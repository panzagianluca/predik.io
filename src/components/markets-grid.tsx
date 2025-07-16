"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Market } from "@/types/market";
import { Users, DollarSign, Archive, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRealMarkets } from "@/hooks/useRealMarkets";

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

  // Get real markets data
  const { markets: realMarkets, loading: marketsLoading, error: marketsError, refetch } = useRealMarkets();

  // Filter and sort markets
  const getFilteredAndSortedMarkets = useCallback(() => {
    let filtered = realMarkets;

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
  }, [realMarkets, selectedCategory, selectedSort, showClosed]);

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
                  : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
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
                  : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
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
            className={`text-xs font-medium ${showClosed ? "text-gray-600 hover:text-gray-600" : "border-gray-300 text-gray-600 hover:text-gray-600 hover:bg-gray-100"}`}
          >
            <Archive size={14} className="mr-1" />
            Cerrados
          </Button>
        </div>
      </div>

      {/* Error State */}
      {marketsError && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">❌ Error cargando mercados: {marketsError}</p>
          <Button 
            onClick={refetch}
            variant="outline"
            size="sm"
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* Initial Loading State */}
      {marketsLoading && displayedMarkets.length === 0 && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando mercados desde la base de datos...</p>
        </div>
      )}

      {/* Markets Grid - Masonry Style */}
      {!marketsLoading || displayedMarkets.length > 0 ? (
        <>
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
          {displayedMarkets.length === 0 && !marketsLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron mercados para los filtros seleccionados</p>
            </div>
          )}
        </>
      ) : null}
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
