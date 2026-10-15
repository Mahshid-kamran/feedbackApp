import PropTypes from 'prop-types'

export default function Card({ children, reverse = false }) {
  return <div className={`card${reverse ? ' reverse' : ''}`}>{children}</div>
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  reverse: PropTypes.bool,
}
