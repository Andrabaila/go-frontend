// src/components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders with default text', () => {
    render(<Button />);
    const button = screen.getByText('Placeholder');
    expect(button).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<Button text="Click me" />);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
  });

  it('applies additional className', () => {
    render(<Button className="custom-class" />);
    const button = screen.getByText('Placeholder');
    expect(button).toHaveClass('custom-class');
  });
});
