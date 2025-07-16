'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '../supabase/client'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
        
        // Check profile on initial load if user exists
        if (session?.user) {
          console.log('🔄 Initial session found, ensuring profile exists...')
          try {
            await ensureUserProfile(session.user)
          } catch (error) {
            console.error('❌ Failed to ensure profile on initial load:', error)
          }
        }
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('🔔 Auth event:', event, 'Session:', !!session, 'User ID:', session?.user?.id)
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Check and create profile for any auth event with a valid session
        if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED')) {
          console.log('� User session detected, checking profile...', {
            event,
            userId: session.user.id,
            email: session.user.email
          })
          
          try {
            await ensureUserProfile(session.user)
          } catch (error) {
            console.error('❌ Failed to ensure user profile:', error)
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const ensureUserProfile = async (user: User) => {
    console.log('🔍 Ensuring user profile exists for:', user.id)
    
    try {
      // First, check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('users_profile')
        .select('id, username, balance')
        .eq('id', user.id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = not found, which is expected for new users
        console.error('❌ Error checking profile:', checkError)
        throw checkError
      }

      if (existingProfile) {
        console.log('✅ Profile already exists:', existingProfile.username, `$${existingProfile.balance}`)
        return existingProfile
      }

      // Profile doesn't exist, create it
      console.log('🆕 Profile not found, creating new profile...')
      await createUserProfile(user)
      
    } catch (error) {
      console.error('❌ Error in ensureUserProfile:', error)
      throw error
    }
  }

  const createUserProfile = async (user: User) => {
    console.log('🔄 Starting automatic createUserProfile for user:', user.id)
    
    try {
      // Use the same database function that worked in manual testing
      const baseUsername = (user.user_metadata.full_name || user.email?.split('@')[0] || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
      
      console.log('� Creating profile using database function...')
      
      const { data, error } = await supabase
        .rpc('create_user_profile', {
          p_user_id: user.id,
          p_full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'Anonymous User',
          p_username: baseUsername,
          p_avatar_url: user.user_metadata.avatar_url || null,
          p_auth_provider: 'google'
        })

      if (error) {
        console.error('❌ Automatic profile creation - Database function error:', error)
        throw error
      }

      if (data?.success) {
        console.log('✅ Automatic profile created successfully:', data)
        return data
      } else {
        console.log('ℹ️ Profile creation response:', data)
        // Don't throw error if profile already exists
        if (data?.message && data.message.includes('already exists')) {
          console.log('✅ Profile already exists, continuing...')
          return data
        } else {
          console.error('❌ Automatic profile creation failed:', data?.error)
          throw new Error(data?.error || 'Profile creation failed')
        }
      }
    } catch (error) {
      console.error('❌ Error in automatic createUserProfile:', error)
      throw error
    }
  }

  const generateUsername = (name: string): string => {
    // This function is no longer used - username generation is now handled in createUserProfile
    const baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const randomSuffix = Math.floor(Math.random() * 1000)
    return `${baseUsername}${randomSuffix}`
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        }
      })
      if (error) {
        console.error('Error signing in with Google:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in signInWithGoogle:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in signOut:', error)
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
