import { Link } from 'react-router-dom'

export default function AboutIconLink() {
  return <div className="about-link"><Link to="/about" aria-label="About this project">About this project ↗</Link></div>
}
