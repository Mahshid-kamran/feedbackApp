import { createContext, useCallback, useEffect, useState } from 'react'
import { adminUid, isSupabaseConfigured, supabase } from '../lib/supabase.js'

const FeedbackContext = createContext(null)

export function FeedbackProvider({ children }) {
  const [feedback, setFeedback] = useState([])
  const [feedbackEdit, setFeedbackEdit] = useState({ item: null, edit: false })
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isAdmin = Boolean(session?.user?.id && adminUid && session.user.id === adminUid)

  const fetchFeedback = useCallback(async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error: requestError } = await supabase
      .from('feedback')
      .select('id, text, rating, created_at')
      .order('created_at', { ascending: false })
    if (requestError) setError(requestError.message)
    else {
      setFeedback(data ?? [])
      setError('')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return undefined
    }
    let active = true
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return
      if (sessionError) setError(sessionError.message)
      setSession(data.session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })
    fetchFeedback()
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [fetchFeedback])

  const addFeedback = async ({ text, rating }) => {
    if (!supabase) throw new Error('Supabase is not configured. Please check your environment variables.')
    setSaving(true)
    setError('')
    try {
      const { data, error: requestError } = await supabase
        .from('feedback')
        .insert({ text: text.trim(), rating })
        .select('id, text, rating, created_at')
        .single()
      if (requestError) throw requestError
      setFeedback((current) => [data, ...current])
      return data
    } catch (requestError) {
      setError(requestError.message || 'Could not submit feedback.')
      throw requestError
    } finally {
      setSaving(false)
    }
  }

  const deleteFeedback = async (id) => {
    if (!isAdmin) throw new Error('Only the administrator can delete feedback.')
    if (!window.confirm('Delete this feedback? This action cannot be undone.')) return
    setSaving(true)
    setError('')
    try {
      const { error: requestError } = await supabase.from('feedback').delete().eq('id', id)
      if (requestError) throw requestError
      setFeedback((current) => current.filter((item) => item.id !== id))
      if (feedbackEdit.item?.id === id) setFeedbackEdit({ item: null, edit: false })
    } catch (requestError) {
      setError(requestError.message || 'Could not delete feedback.')
      throw requestError
    } finally {
      setSaving(false)
    }
  }

  const editFeedback = (item) => setFeedbackEdit({ item, edit: true })
  const cancelEdit = () => setFeedbackEdit({ item: null, edit: false })

  const updateFeedback = async (id, updates) => {
    if (!isAdmin) throw new Error('Only the administrator can update feedback.')
    setSaving(true)
    setError('')
    try {
      const { data, error: requestError } = await supabase
        .from('feedback')
        .update({ text: updates.text.trim(), rating: updates.rating })
        .eq('id', id)
        .select('id, text, rating, created_at')
        .single()
      if (requestError) throw requestError
      setFeedback((current) => current.map((item) => item.id === id ? data : item))
      cancelEdit()
      return data
    } catch (requestError) {
      setError(requestError.message || 'Could not update feedback.')
      throw requestError
    } finally {
      setSaving(false)
    }
  }

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Supabase is not configured yet.')
    const { data, error: requestError } = await supabase.auth.signInWithPassword({ email, password })
    if (requestError) throw requestError
    if (adminUid && data.user?.id !== adminUid) {
      await supabase.auth.signOut()
      throw new Error('This account is not the configured administrator account.')
    }
    if (!adminUid) {
      await supabase.auth.signOut()
      throw new Error('Set VITE_SUPABASE_ADMIN_UID in your environment before signing in as administrator.')
    }
    return data
  }

  const signOut = async () => {
    if (!supabase) return
    const { error: requestError } = await supabase.auth.signOut()
    if (requestError) throw requestError
    cancelEdit()
  }

  const value = {
    feedback, feedbackEdit, loading, saving, error, isAdmin, session,
    isSupabaseConfigured, addFeedback, deleteFeedback, editFeedback,
    updateFeedback, cancelEdit, signIn, signOut, refreshFeedback: fetchFeedback,
    clearError: () => setError(''),
  }

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>
}

export default FeedbackContext
