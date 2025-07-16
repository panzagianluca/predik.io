"use client";

import { Search, Menu, LogOut, Wallet, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/AuthButton";
import { useAuth } from "../../lib/auth/AuthProvider";
import { LoginModal } from "@/components/LoginModal";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Market } from "@/types/market";

// Mock markets data for search - in real app this would be fetched from API
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
    description: "¿El tipo de cambio USD/ARS superará los $2000 pesos argentinos antes del 31 de diciembre de 2025?",
    yesPrice: 0.72,
    noPrice: 0.28,
    volume: 67000,
    endDate: "2025-12-31",
    participants: 670,
    createdAt: "2024-01-20",
    status: 'active'
  },
  {
    id: 4,
    type: 'multiple',
    title: "¿Cuántos goles hará Messi en el Mundial 2026?",
    category: "Deporte",
    description: "¿Cuántos goles marcará Lionel Messi en la Copa del Mundo 2026 (fase de grupos + eliminatorias)?",
    options: [
      { id: 'no-juega', text: 'No jugará', price: 0.20, color: '#6b7280' },
      { id: '0-goles', text: '0 goles', price: 0.15, color: '#ef4444' },
      { id: '1-2-goles', text: '1-2 goles', price: 0.35, color: '#f59e0b' },
      { id: '3-plus', text: '3+ goles', price: 0.30, color: '#22c55e' }
    ],
    volume: 58000,
    endDate: "2026-07-15",
    participants: 580,
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
    volume: 45000,
    endDate: "2025-12-31",
    participants: 450,
    createdAt: "2024-02-01",
    status: 'active'
  },
  {
    id: 6,
    type: 'multiple',
    title: "¿Qué país ganará la Copa América 2024?",
    category: "Deporte",
    description: "¿Qué selección nacional ganará la Copa América 2024?",
    options: [
      { id: 'argentina', text: 'Argentina', price: 0.40, color: '#22c55e' },
      { id: 'brasil', text: 'Brasil', price: 0.35, color: '#f59e0b' },
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

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Market[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const filtered = mockMarkets.filter(market =>
      market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filtered);
    setShowResults(true);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchResultClick = () => {
    setShowResults(false);
    setSearchQuery("");
  };

// User Menu Section Component
function UserMenuSection() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user) {
    return (
      <Button 
        onClick={() => setShowAuthModal(true)}
        className="bg-[#A855F7] hover:bg-[#9333EA] text-white cursor-pointer" 
        size="sm"
      >
        Acceder
      </Button>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <AuthButton />
      
      {/* User dropdown */}
      <div className="relative group">
        <Button variant="ghost" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
        
        {/* Dropdown menu */}
        <div className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <div className="py-1">
            <Link href="/perfil" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors">
              <Menu className="mr-2 h-4 w-4" />
              Perfil
            </Link>
            <Link href="/portafolio" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors">
              <Wallet className="mr-2 h-4 w-4" />
              Portafolio
            </Link>
            <Link href="/proponer" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors">
              💡 Proponer Mercado
            </Link>
            <Link href="/terminos" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors">
              Términos
            </Link>
            <Link href="/privacidad" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors">
              Privacidad
            </Link>
            <button 
              onClick={handleSignOut}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              type="button"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/predik.svg" 
            alt="Predik" 
            width={120} 
            height={24}
            className="h-6 w-auto"
          />
        </Link>

        {/* Search Bar */}
        <div className="mx-8 flex-1" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar mercados..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
              className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            
            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white border border-input rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.slice(0, 6).map((market, index) => (
                  <Link
                    key={market.id}
                    href={`/mercado/${market.id}`}
                    onClick={handleSearchResultClick}
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-border last:border-b-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center rounded-full bg-[rgb(var(--primary))]/10 px-2 py-0.5 text-xs font-medium text-[rgb(var(--primary))]">
                            {market.category}
                          </span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            {market.type === 'binary' ? 'SÍ/NO' : 'Múltiples'}
                          </span>
                        </div>
                        <p className="font-medium text-sm truncate">{market.title}</p>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {market.description}
                        </p>
                      </div>
                      <div className="ml-3 text-right">
                        {market.type === 'binary' ? (
                          <div className="text-xs">
                            <div className="text-green-600 font-medium">SÍ ${(market.yesPrice * 100).toFixed(0)}¢</div>
                            <div className="text-red-600 font-medium">NO ${(market.noPrice * 100).toFixed(0)}¢</div>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            {market.options.length} opciones
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
                
                {searchResults.length > 6 && (
                  <div className="px-4 py-2 text-xs text-muted-foreground text-center bg-gray-50">
                    +{searchResults.length - 6} resultados más
                  </div>
                )}
              </div>
            )}
            
            {/* No Results */}
            {showResults && searchQuery && searchResults.length === 0 && (
              <div className="absolute top-full mt-1 w-full bg-white border border-input rounded-md shadow-lg z-50 px-4 py-3">
                <p className="text-sm text-muted-foreground text-center">
                  No se encontraron mercados para "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowHowItWorks(true)}
            className="hidden md:flex items-center gap-1 text-purple-600 hover:text-purple-600 cursor-pointer 
            text-sm"
          >
            <HelpCircle size={16} />
            ¿Cómo Funciona?
          </button>
          
          <UserMenuSection />
        </div>
      </div>
    </header>
    
    {/* How It Works Modal */}
    <HowItWorksModal 
      isOpen={showHowItWorks}
      onClose={() => setShowHowItWorks(false)}
    />
    
    {/* Login Modal */}
    <LoginModal 
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
    />
    </>
  );
}

// How It Works Modal Component
function HowItWorksModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-48 h-48 md:w-96 md:h-96">
              <Image src="/images/step1-pick-market.png" alt="Elegí un Mercado" fill className="object-contain" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">1. Elegí un Mercado</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Navegá entre los mercados disponibles y elegí uno que te interese. Podés hacer predicciones sobre política, deportes, economía y muchos temas más.
              </p>
            </div>
            <Button onClick={nextStep} className="w-full bg-[#A855F7] hover:bg-[#9333EA] cursor-pointer">
              Siguiente
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-48 h-48 md:w-96 md:h-96">
              <Image src="/images/step2-place-bet.png" alt="Hacé tu Predicción" fill className="object-contain" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">2. Hacé tu Predicción</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Usá tus <strong>Prediks gratuitos</strong> para comprar acciones de "SÍ" o "NO". Los Prediks son una moneda completamente ficticia, <strong>sin valor monetario real</strong>.
              </p>
            </div>
            <Button onClick={nextStep} className="w-full bg-[#A855F7] hover:bg-[#9333EA] cursor-pointer">
              Siguiente
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-48 h-48 md:w-96 md:h-96">
              <Image src="/images/step3-profit.png" alt="Ganá Prediks" fill className="object-contain" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">3. Ganá Prediks</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Si acertás tu predicción, ganás más Prediks. Si no acertás, perdés algunos (pero siempre podés conseguir más gratis). ¡Todo es puro entretenimiento!
              </p>
            </div>
            <Button onClick={nextStep} className="w-full bg-[#A855F7] hover:bg-[#9333EA] cursor-pointer">
              Empezar Ahora
            </Button>
          </div>
        );
      case 4:
        return (
          <div className="text-center space-y-6">
            {/* Logo - 3x bigger, matching LoginModal */}
            <div className="relative mx-auto w-72 h-36">
              <Image 
                src="/predik.svg" 
                alt="Predik" 
                fill
                className="object-contain"
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl">El futuro tiene precio.</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Accedé para empezar a hacer predicciones y ganar.
              </p>
            </div>
            
            {/* Google Sign In Button */}
            <Button
              onClick={onClose}
              className="w-full bg-[#A855F7] hover:bg-[#9333EA] flex items-center justify-center gap-2 cursor-pointer"
            >
              <div className="bg-white rounded-full p-1">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              Continuar con Google
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur only */}
      <div 
        className="absolute inset-0 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal - reduced width by 20% */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
        >
          ×
        </button>
        
        {/* Content */}
        {renderStep()}
      </div>
    </div>
  );
}
