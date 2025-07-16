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
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Create user profile on first sign in
        if (event === 'SIGNED_IN' && session?.user) {
          await createUserProfile(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const createUserProfile = async (user: User) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('users_profile')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!existingProfile) {
        // Create new profile
        const { error } = await supabase
          .from('users_profile')
          .insert({
            id: user.id,
            full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'Anonymous',
            username: generateUsername(user.user_metadata.full_name || user.email?.split('@')[0] || 'user'),
            avatar_url: user.user_metadata.avatar_url || null,
            auth_provider: 'google'
          })

        if (error) {
          console.error('Error creating user profile:', error)
        }
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error)
    }
  }

  const generateUsername = (name: string): string => {
    // Generate a unique username based on the name
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
