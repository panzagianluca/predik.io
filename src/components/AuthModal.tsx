'use client'

import { useAuth } from '../../lib/auth/AuthProvider'
import { Button } from './ui/button'

// Simple AuthModal button
export function AuthModal() {
  const { signInWithGoogle, loading } = useAuth()
  
  return (
    <Button 
      onClick={() => signInWithGoogle()}
      className="bg-[#A855F7] hover:bg-[#9333EA] text-white" 
      size="sm"
    >
      {loading ? 'Accediendo...' : 'Acceder'}
    </Button>
  )
}
