import { render, screen, fireEvent } from '@testing-library/react';
import { LinkItem } from './LinkItem';

const mockLink = { id: '1', title: 'Google', url: 'https://google.com', addedAt: '2026-04-25T00:00:00.000Z' };

describe('LinkItem', () => {
  it('renders link and delete button', () => {
    const onDelete = vi.fn();
    render(<LinkItem link={mockLink} onDelete={onDelete} />);
    
    expect(screen.getByText('Google')).toHaveAttribute('href', 'https://google.com');
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
