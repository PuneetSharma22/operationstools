import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Supabase re-validates the session (firing an auth event) whenever the
      // tab regains focus, even when nothing changed. That handed every
      // consumer a new-but-equivalent user object, and pages that reload
      // their data on `[user]` changing (AdminPage, AccountPage) mistook it
      // for a real user change and refetched everything on every tab switch.
      // Only replace the object when the signed-in user has actually changed.
      setUser(prev => {
        const nextId = session?.user?.id ?? null
        const prevId = prev?.id ?? null
        return nextId === prevId ? prev : (session?.user ?? null)
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
