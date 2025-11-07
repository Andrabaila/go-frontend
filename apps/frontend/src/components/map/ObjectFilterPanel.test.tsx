import { render, screen, fireEvent } from '@testing-library/react';
import ObjectFilterPanel from './ObjectFilterPanel';

describe('ObjectFilterPanel', () => {
  const availableTypes = ['park', 'lake', 'forest'];
  const selectedTypes = ['lake'];
  const onToggle = vi.fn<(type: string) => void>();

  beforeEach(() => {
    onToggle.mockClear();
  });

  it('renders checkboxes for all available types', () => {
    render(
      <ObjectFilterPanel
        availableTypes={availableTypes}
        selectedTypes={selectedTypes}
        onToggle={onToggle}
      />
    );

    for (const type of availableTypes) {
      const labelText = new RegExp(type, 'i');
      expect(screen.getByLabelText(labelText)).toBeInTheDocument();
    }
  });

  it('shows checked state for selected types', () => {
    render(
      <ObjectFilterPanel
        availableTypes={availableTypes}
        selectedTypes={selectedTypes}
        onToggle={onToggle}
      />
    );

    const lakeCheckbox = screen.getByLabelText(/lake/i) as HTMLInputElement;
    expect(lakeCheckbox.checked).toBe(true);

    const parkCheckbox = screen.getByLabelText(/park/i) as HTMLInputElement;
    expect(parkCheckbox.checked).toBe(false);
  });

  it('calls onToggle when checkbox is clicked', () => {
    render(
      <ObjectFilterPanel
        availableTypes={availableTypes}
        selectedTypes={selectedTypes}
        onToggle={onToggle}
      />
    );

    const forestCheckbox = screen.getByLabelText(/forest/i);
    fireEvent.click(forestCheckbox);
    expect(onToggle).toHaveBeenCalledWith('forest');
  });
});
