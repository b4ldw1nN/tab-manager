import { fetchTabs, saveTabs } from './github';

const mockTabs = { categories: [] };
window.fetch = vi.fn();

describe('github API', () => {
  beforeEach(() => {
    vi.mocked(window.fetch).mockReset();
  });

  it('fetches tabs successfully', async () => {
    vi.mocked(window.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ files: { 'tabs.json': { content: JSON.stringify(mockTabs) } } })
    } as Response);

    const result = await fetchTabs('token', 'gist');
    expect(result).toEqual(mockTabs);
    expect(window.fetch).toHaveBeenCalledWith('https://api.github.com/gists/gist', expect.any(Object));
  });

  it('saves tabs successfully', async () => {
    vi.mocked(window.fetch).mockResolvedValueOnce({ ok: true } as Response);
    await saveTabs('token', 'gist', mockTabs);
    expect(window.fetch).toHaveBeenCalledWith('https://api.github.com/gists/gist', expect.objectContaining({ method: 'PATCH' }));
  });
});
