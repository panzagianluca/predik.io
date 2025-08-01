// Component code is separate from the directive
'use client'

import { useAuth } from '../../lib/auth/AuthProvider'
import { Button } from './ui/button'
import { useEffect } from 'react'
import Image from 'next/image'

// Renamed parameter to avoid Server Action error with "use client" directive
export function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: any }) {
  const { signInWithGoogle, loading } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur only */}
      <div 
        className="absolute inset-0 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal - identical to HowItWorksModal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
        >
          ×
        </button>
        
        {/* Content */}
        <div className="text-center space-y-6">
          {/* Logo - 3x bigger */}
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
          onClick={handleSignIn}
          disabled={loading}
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
            {loading ? 'Accediendo...' : 'Acceder con Google'}
          </Button>
        </div>
      </div>
    </div>
  );
}
