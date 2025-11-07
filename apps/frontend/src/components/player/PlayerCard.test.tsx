import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PlayerCard from './PlayerCard';

describe('PlayerCard', () => {
  it('renders with default text', () => {
    render(<PlayerCard />);
    const card = screen.getByText('Placeholder');
    expect(card).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<PlayerCard text="Player 1" />);
    const card = screen.getByText('Player 1');
    expect(card).toBeInTheDocument();
  });

  it('applies additional className', () => {
    render(<PlayerCard className="highlight" />);
    const card = screen.getByText('Placeholder');
    expect(card).toHaveClass('highlight');
  });
});
