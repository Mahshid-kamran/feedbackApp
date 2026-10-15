import { Link } from 'react-router-dom'
import Card from '../components/shared/Card.jsx'

export default function AboutPage() {
  return (
    <Card>
      <div className="about">
        <h2>About this project</h2>
        <p>A simple feedback app built with React, Vite, and Supabase.</p>
        <p>Visitors can read and submit feedback. Only the configured administrator can edit or delete entries.</p>
        <p><i>Version 2.0.0</i></p>
        <Link to="/">Back to feedback</Link>
      </div>
    </Card>
  )
}
