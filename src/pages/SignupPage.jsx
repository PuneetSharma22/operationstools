import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  const inputClass = "w-full h-11 px-4 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all duration-150 placeholder:text-[#94a3b8]"

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-[400px]">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm text-center">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-[22px] font-bold text-[#0F172A] mb-2">Check your email</h2>
            <p className="text-[#64748B] text-[14px] leading-relaxed mb-6">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full h-11 text-[14px] font-semibold text-white rounded-xl"
              style={{ background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)" }}
            >
              Go to Log in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #2563EB, #4F46E5)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>
            <h1 className="text-[24px] font-bold text-[#0F172A]">Create an account</h1>
            <p className="text-[#64748B] text-[14px] mt-1">Free forever. No credit card needed.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <p className="text-red-600 text-[13px]">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Email address</label>
              <input
                type="email"
                className={inputClass}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Password</label>
              <input
                type="password"
                className={inputClass}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Confirm password</label>
              <input
                type="password"
                className={inputClass}
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-[14px] font-semibold text-white rounded-xl transition-all duration-150 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)" }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-[13px] text-[#64748B] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2563EB] font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
