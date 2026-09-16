import { createContext, useContext } from 'react'

// The provider itself lives in ./AuthProvider so this module exports only
// non-components — otherwise React Fast Refresh can't hot-update either one.
export const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)
