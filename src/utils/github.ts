export interface TabData {
  categories: Array<{
    id: string;
    title: string;
    links: Array<{ id: string; title: string; url: string; addedAt: string }>;
  }>;
}

const GIST_FILENAME = 'tabs.json';
const GIST_DESCRIPTION = 'Tab Manager Data (Auto-generated)';

export async function fetchTabs(token: string, gistId: string): Promise<TabData> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `token ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch tabs');
  const data = await res.json();
  const content = data.files[GIST_FILENAME]?.content;
  return content ? JSON.parse(content) : { categories: [] };
}

export async function saveTabs(token: string, gistId: string, data: TabData): Promise<void> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: { [GIST_FILENAME]: { content: JSON.stringify(data) } } })
  });
  if (!res.ok) throw new Error('Failed to save tabs');
}

export async function getOrCreateGist(token: string): Promise<string> {
  // 1. Search for existing gist
  const listRes = await fetch('https://api.github.com/gists', {
    headers: { Authorization: `token ${token}` }
  });
  if (!listRes.ok) throw new Error('Failed to list gists');
  const gists = await listRes.json();
  const existingGist = gists.find((g: any) => g.description === GIST_DESCRIPTION);

  if (existingGist) return existingGist.id;

  // 2. Create new if not found
  const createRes = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: { 
      Authorization: `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: GIST_DESCRIPTION,
      public: false,
      files: { [GIST_FILENAME]: { content: JSON.stringify({ categories: [] }) } }
    })
  });
  if (!createRes.ok) throw new Error('Failed to create gist');
  const newGist = await createRes.json();
  return newGist.id;
}
