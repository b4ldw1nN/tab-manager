import { fetchTabs, saveTabs } from './github';

const mockTabs = { categories: [] };
global.fetch = vi.fn();

describe('github API', () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
  });

  it('fetches tabs successfully', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ files: { 'tabs.json': { content: JSON.stringify(mockTabs) } } })
    } as Response);

    const result = await fetchTabs('token', 'gist');
    expect(result).toEqual(mockTabs);
    expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/gists/gist', expect.any(Object));
  });

  it('saves tabs successfully', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({ ok: true } as Response);
    await saveTabs('token', 'gist', mockTabs);
    expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/gists/gist', expect.objectContaining({ method: 'PATCH' }));
  });
});
