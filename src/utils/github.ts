export interface TabData {
  categories: Array<{
    id: string;
    title: string;
    links: Array<{ id: string; title: string; url: string; addedAt: string }>;
  }>;
}

export async function fetchTabs(token: string, gistId: string): Promise<TabData> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `token ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch tabs');
  const data = await res.json();
  const content = data.files['tabs.json']?.content;
  return content ? JSON.parse(content) : { categories: [] };
}

export async function saveTabs(token: string, gistId: string, data: TabData): Promise<void> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: { 'tabs.json': { content: JSON.stringify(data) } } })
  });
  if (!res.ok) throw new Error('Failed to save tabs');
}
