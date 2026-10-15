import { FaEdit, FaTimes } from 'react-icons/fa'
import { useFeedback } from '../context/useFeedback.js'
import Card from './shared/Card.jsx'

export default function FeedbackItem({ item }) {
  const { deleteFeedback, editFeedback, isAdmin } = useFeedback()
  const createdAt = item.created_at ? new Date(item.created_at).toLocaleDateString() : ''
  const safelyRun = async (action) => {
    try { await action() } catch { /* The context surfaces the server error in the page notice. */ }
  }

  return (
    <Card>
      <div className="num-display" aria-label={`Rating ${item.rating} out of 10`}>{item.rating}</div>
      {isAdmin && (
        <div className="item-actions">
          <button onClick={() => editFeedback(item)} className="icon-button" type="button" aria-label="Edit feedback"><FaEdit /></button>
          <button onClick={() => safelyRun(() => deleteFeedback(item.id))} className="icon-button" type="button" aria-label="Delete feedback"><FaTimes /></button>
        </div>
      )}
      <p className="text-display">{item.text}</p>
      {createdAt && <small className="feedback-date">{createdAt}</small>}
    </Card>
  )
}
