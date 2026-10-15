import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import RatingSelect from '../components/RatingSelect.jsx'

describe('RatingSelect', () => {
  it('shows ten rating choices and reports the selected rating', () => {
    const select = vi.fn()
    render(<RatingSelect selected={10} select={select} />)

    expect(screen.getAllByRole('radio')).toHaveLength(10)
    expect(screen.getByLabelText('10')).toBeChecked()
    fireEvent.click(screen.getByLabelText('7'))
    expect(select).toHaveBeenCalledWith(7)
  })
})
