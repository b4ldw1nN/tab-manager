import { render, screen, fireEvent } from '@testing-library/react';
import { AuthSetup } from './AuthSetup';

describe('AuthSetup', () => {
  it('calls onSave with input values', () => {
    const handleSave = vi.fn();
    render(<AuthSetup onSave={handleSave} />);
    
    fireEvent.change(screen.getByLabelText(/github token/i), { target: { value: 'token123' } });
    fireEvent.change(screen.getByLabelText(/gist id/i), { target: { value: 'gist123' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    expect(handleSave).toHaveBeenCalledWith('token123', 'gist123');
  });
});
