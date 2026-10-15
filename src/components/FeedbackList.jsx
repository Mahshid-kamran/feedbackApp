import { AnimatePresence, motion } from 'framer-motion'
import { useFeedback } from '../context/useFeedback.js'
import FeedbackItem from './FeedbackItem.jsx'
import Spinner from './shared/Spinner.jsx'

export default function FeedbackList() {
  const { feedback, loading } = useFeedback()
  if (loading) return <Spinner />
  if (!feedback.length) return <p className="empty-state">هنوز دیدگاهی ثبت نشده است. اولین نفر باشید!</p>
  return (
    <div className="feedback-list">
      <AnimatePresence initial={false}>
        {feedback.map((item) => (
          <motion.div key={item.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <FeedbackItem item={item} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
