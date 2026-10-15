import { useFeedback } from '../context/useFeedback.js'

export default function FeedbackStats() {
  const { feedback } = useFeedback()
  const average = feedback.length
    ? (feedback.reduce((total, item) => total + Number(item.rating || 0), 0) / feedback.length).toFixed(1).replace(/\.0$/, '')
    : '0'
  return (
    <div className="feedback-stats" aria-live="polite">
      <h4>دیدگاه‌ها: {feedback.length}</h4>
      <h4>میانگین امتیاز: {average}/10</h4>
    </div>
  )
}
