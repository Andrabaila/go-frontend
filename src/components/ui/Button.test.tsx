// src/components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FollowPlayerButton from './FollowPlayerButton';

describe('FollowPlayerButton', () => {
  it('renders with default text', () => {
    render(<FollowPlayerButton />);
    const button = screen.getByText('Placeholder');
    expect(button).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<FollowPlayerButton text="Click me" />);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
  });

  it('applies additional className', () => {
    render(<FollowPlayerButton />);
    const button = screen.getByText('Следить за игроком');
    expect(button).toHaveClass('custom-class');
  });
});
