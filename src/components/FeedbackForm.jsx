import { useEffect, useState } from 'react'
import RatingSelect from './RatingSelect.jsx'
import Card from './shared/Card.jsx'
import { useFeedback } from '../context/useFeedback.js'

const MIN_LENGTH = 10

export default function FeedbackForm() {
  const { addFeedback, feedbackEdit, updateFeedback, cancelEdit, saving, isAdmin, isSupabaseConfigured } = useFeedback()
  const [text, setText] = useState('')
  const [rating, setRating] = useState(10)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (feedbackEdit.edit && feedbackEdit.item) {
      setText(feedbackEdit.item.text)
      setRating(feedbackEdit.item.rating)
      setMessage('You are editing an existing feedback entry.')
    }
  }, [feedbackEdit])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const cleanText = text.trim()
    if (cleanText.length < MIN_LENGTH) {
      setMessage(`Please write at least ${MIN_LENGTH} characters.`)
      return
    }
    setMessage('')
    const wasEditing = Boolean(feedbackEdit.edit && feedbackEdit.item)
    try {
      if (wasEditing) {
        if (!isAdmin) throw new Error('Please sign in with the administrator account to edit feedback.')
        await updateFeedback(feedbackEdit.item.id, { text: cleanText, rating })
      } else {
        await addFeedback({ text: cleanText, rating })
      }
      setText('')
      setRating(10)
      setMessage(wasEditing ? 'Feedback updated.' : 'Thank you! Your feedback was submitted.')
      if (wasEditing) cancelEdit()
    } catch (error) {
      setMessage(error.message || 'Something went wrong. Please try again.')
    }
  }

  const handleCancel = () => {
    cancelEdit()
    setText('')
    setRating(10)
    setMessage('Edit cancelled.')
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <h3>{feedbackEdit.edit ? 'Edit feedback' : 'لطفاً چند ثانیه از زمان ارزشمندتان را به ما بدهید و با امتیاز دادن، ما را در مسیر پیشرفت راهنمایی کنید'}</h3>
        <RatingSelect selected={rating} select={setRating} />
        <label className="sr-only" htmlFor="feedback-text">Your feedback</label>
        <div className="input-group">
          <textarea id="feedback-text" maxLength={5000} rows={3} placeholder="دیدگاه خود را بنویسید…" value={text} onChange={(event) => setText(event.target.value)} disabled={!isSupabaseConfigured || saving} />
          <button className="btn btn-primary" type="submit" disabled={!isSupabaseConfigured || saving || text.trim().length < MIN_LENGTH || (feedbackEdit.edit && !isAdmin)}>
            {saving ? 'Saving…' : feedbackEdit.edit ? 'Save changes' : 'ثبت دیدگاه'}
          </button>
        </div>
        <div className="form-footer"><small>{text.length}/5000 characters</small>{feedbackEdit.edit && <button className="text-button" type="button" onClick={handleCancel}>Cancel edit</button>}</div>
        {message && <p className="message" role="status">{message}</p>}
      </form>
    </Card>
  )
}
