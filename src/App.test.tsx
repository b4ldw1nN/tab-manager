import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { saveCredentials, clearCredentials } from './utils/storage';
import { fetchTabs } from './utils/github';

vi.mock('./utils/github');

describe('App', () => {
  beforeEach(() => {
    clearCredentials();
    vi.mocked(fetchTabs).mockReset();
  });

  it('shows AuthSetup when no credentials', () => {
    render(<App />);
    expect(screen.getByText('Setup Storage')).toBeInTheDocument();
  });

  it('fetches data when credentials exist', async () => {
    saveCredentials('tok', 'gist');
    vi.mocked(fetchTabs).mockResolvedValue({ categories: [{ id: 'c1', title: 'Work', links: [] }] });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Work')).toBeInTheDocument();
    });
  });
});
