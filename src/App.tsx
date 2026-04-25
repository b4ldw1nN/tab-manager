import { useEffect, useState } from 'react';
import { AuthSetup } from './components/AuthSetup';
import { getCredentials, saveCredentials } from './utils/storage';
import type { Credentials } from './utils/storage';
import { fetchTabs } from './utils/github';
import type { TabData } from './utils/github';

export default function App() {
  const [creds, setCreds] = useState<Credentials | null>(getCredentials());
  const [data, setData] = useState<TabData | null>(null);

  useEffect(() => {
    if (creds) {
      fetchTabs(creds.token, creds.gistId).then(setData).catch(console.error);
    }
  }, [creds]);

  const handleAuthSave = (token: string, gistId: string) => {
    saveCredentials(token, gistId);
    setCreds({ token, gistId });
  };

  if (!creds) {
    return <AuthSetup onSave={handleAuthSave} />;
  }

  if (!data) return <div>Loading...</div>;

  return (
    <div className="app">
      <h1>Tab Manager</h1>
      {data.categories.map(cat => (
        <div key={cat.id}>
          <h2>{cat.title}</h2>
        </div>
      ))}
    </div>
  );
}
