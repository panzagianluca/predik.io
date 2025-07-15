"use client";

import { Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-[rgb(var(--primary))]">
            Predik
          </div>
        </Link>

        {/* Search Bar */}
        <div className="mx-8 flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar mercados..."
              className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Iniciar Sesión
          </Button>
          
          {/* User dropdown placeholder - will implement with actual auth */}
          <div className="relative group">
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
            
            {/* Dropdown menu (hidden for now) */}
            <div className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-background shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="py-1">
                <Link href="/perfil" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Link>
                <Link href="/proponer" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted">
                  💡 Proponer Mercado
                </Link>
                <Link href="/terminos" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted">
                  Términos
                </Link>
                <Link href="/privacidad" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted">
                  Privacidad
                </Link>
                <button className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
