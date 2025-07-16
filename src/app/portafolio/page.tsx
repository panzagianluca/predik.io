"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Portfolio } from '@/components/portfolio';
import { TradeHistory } from '@/components/trade-history';
import { useAuth } from '../../../lib/auth/AuthProvider';
import { 
  Wallet, 
  History
} from 'lucide-react';

export default function PortafolioPage() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'history'>('portfolio');
  const { user } = useAuth();

  const tabs = [
    { id: 'portfolio', label: 'Posiciones', icon: Wallet },
    { id: 'history', label: 'Historial', icon: History },
  ];

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Debes iniciar sesión para ver tu portfolio</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mi Portafolio</h1>
          <p className="text-muted-foreground">
            Gestiona tus inversiones y analiza tu rendimiento
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border mb-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-[rgb(var(--primary))] text-[rgb(var(--primary))]'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'portfolio' && <Portfolio userId={user.id} />}
          {activeTab === 'history' && <TradeHistory userId={user.id} />}
        </div>
      </div>
    </div>
  );
}
