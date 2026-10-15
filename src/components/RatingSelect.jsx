export default function RatingSelect({ select, selected = 10 }) {
  return (
    <fieldset className="rating-fieldset">
      <legend>Choose a rating (1–10)</legend>
      <ul className="rating">
        {Array.from({ length: 10 }, (_, index) => index + 1).map((rating) => (
          <li key={rating}>
            <input type="radio" id={`rating-${rating}`} name="rating" value={rating} checked={selected === rating} onChange={() => select(rating)} />
            <label htmlFor={`rating-${rating}`}>{rating}</label>
          </li>
        ))}
      </ul>
    </fieldset>
  )
}
