import { notFound } from 'next/navigation';
import { MarketDetails } from '@/components/market-details';
import { Market } from '@/types/market';

// This would normally come from your database
async function getMarket(id: string): Promise<Market | null> {
  // Mock data - same as in markets-grid but you'd fetch from DB
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

  const market = mockMarkets.find(m => m.id === parseInt(id));
  return market || null;
}

export default async function MarketPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const market = await getMarket(id);
  
  if (!market) {
    notFound();
  }

  return <MarketDetails market={market} />;
}
