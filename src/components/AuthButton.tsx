'use client'

import { useAuth } from '../../lib/auth/AuthProvider'
import Image from 'next/image'

export function AuthButton() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {user.user_metadata?.avatar_url && (
          <Image 
            src={user.user_metadata.avatar_url} 
            alt="Profile" 
            width={24}
            height={24}
            className="w-6 h-6 rounded-full"
          />
        )}
        <span className="text-sm text-muted-foreground hidden sm:block">
          {user.user_metadata?.full_name || user.email}
        </span>
      </div>
    )
  }

  return null // When not logged in, don't show anything (modal will be shown instead)
}
