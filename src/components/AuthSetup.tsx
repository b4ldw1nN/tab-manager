import { useState } from 'react';

interface Props {
  onSave: (token: string, gistId: string) => void;
}

export function AuthSetup({ onSave }: Props) {
  const [token, setToken] = useState('');
  const [gistId, setGistId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(token, gistId);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-setup">
      <h2>Setup Storage</h2>
      <div>
        <label htmlFor="token">GitHub Token</label>
        <input id="token" type="password" value={token} onChange={e => setToken(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="gistId">Gist ID</label>
        <input id="gistId" type="text" value={gistId} onChange={e => setGistId(e.target.value)} required />
      </div>
      <button type="submit">Save</button>
    </form>
  );
}
