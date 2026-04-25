import { render, screen, fireEvent } from '@testing-library/react';
import { AuthSetup } from './AuthSetup';
import { redirectToGitHub } from '../utils/oauth';

vi.mock('../utils/oauth', () => ({
  redirectToGitHub: vi.fn(),
}));

describe('AuthSetup', () => {
  it('calls redirectToGitHub when login button is clicked', () => {
    render(<AuthSetup />);
    
    fireEvent.click(screen.getByRole('button', { name: /login with github/i }));
    
    expect(redirectToGitHub).toHaveBeenCalled();
  });
});
