import { useEffect, useState } from 'react';
import { AuthSetup } from './components/AuthSetup';
import { getCredentials, saveCredentials } from './utils/storage';
import type { Credentials } from './utils/storage';
import { fetchTabs, getOrCreateGist } from './utils/github';
import type { TabData } from './utils/github';
import { exchangeCodeForToken } from './utils/oauth';

export default function App() {
  const [creds, setCreds] = useState<Credentials | null>(getCredentials());
  const [data, setData] = useState<TabData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state && !creds) {
      setLoading(true);
      exchangeCodeForToken(code, state)
        .then(async (token) => {
          const gistId = await getOrCreateGist(token);
          saveCredentials(token, gistId);
          setCreds({ token, gistId });
          // Clear URL params
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [creds]);

  useEffect(() => {
    if (creds) {
      fetchTabs(creds.token, creds.gistId).then(setData).catch(console.error);
    }
  }, [creds]);

  if (loading) return <div className="loading">Authenticating with GitHub...</div>;
  if (!creds) return <AuthSetup />;
  if (!data) return <div className="loading">Loading your tabs...</div>;

  return (
    <div className="app">
      <header>
        <h1>Tab Manager</h1>
        <button onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}>Logout</button>
      </header>
      <main>
        {data.categories.length === 0 ? (
          <p>No categories yet. Add one to get started!</p>
        ) : (
          data.categories.map(cat => (
            <div key={cat.id} className="category">
              <h2>{cat.title}</h2>
              {/* Category and Link components will go here in future tasks */}
            </div>
          ))
        )}
      </main>
    </div>
  );
}
