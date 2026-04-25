# Tab Manager Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a client-side React application for manual link management that persists data to a GitHub Gist.

**Architecture:** A static React single-page app using Vite, utilizing `localStorage` for credentials and the `fetch` API to interact with GitHub Gists.

**Tech Stack:** React 18, Vite, TypeScript, Vitest, React Testing Library.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `tsconfig.json`

- [ ] **Step 1: Run Vite scaffolding**
```bash
npm create vite@latest . -- --template react-ts
npm install
```

- [ ] **Step 2: Install Testing Dependencies**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @types/testing-library__jest-dom
```

- [ ] **Step 3: Configure Vitest**
Modify `vite.config.ts` to include test configuration:
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true
  }
})
```
Create `src/setupTests.ts`:
```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 4: Update `tsconfig.json` for Vitest**
Add `"types": ["vitest/globals", "@testing-library/jest-dom"]` to `compilerOptions`.

- [ ] **Step 5: Verify setup**
Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 6: Commit**
```bash
git add .
git commit -m "chore: scaffold vite react-ts project with vitest"
```

---

### Task 2: Credentials Storage Utility

**Files:**
- Create: `src/utils/storage.ts`
- Create: `src/utils/storage.test.ts`

- [ ] **Step 1: Write failing test**
Create `src/utils/storage.test.ts`:
```typescript
import { getCredentials, saveCredentials, clearCredentials } from './storage';

describe('storage utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and retrieves credentials', () => {
    saveCredentials('my-token', 'my-gist');
    const creds = getCredentials();
    expect(creds).toEqual({ token: 'my-token', gistId: 'my-gist' });
  });

  it('returns null if not found', () => {
    expect(getCredentials()).toBeNull();
  });
  
  it('clears credentials', () => {
    saveCredentials('t', 'g');
    clearCredentials();
    expect(getCredentials()).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run src/utils/storage.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**
Create `src/utils/storage.ts`:
```typescript
export interface Credentials {
  token: string;
  gistId: string;
}

const STORAGE_KEY = 'tab-manager-creds';

export function saveCredentials(token: string, gistId: string): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, gistId }));
}

export function getCredentials(): Credentials | null {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearCredentials(): void {
  localStorage.removeItem(STORAGE_KEY);
}
```

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/utils/storage.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/utils/
git commit -m "feat: add credentials storage utility"
```

---

### Task 3: AuthSetup Component

**Files:**
- Create: `src/components/AuthSetup.tsx`
- Create: `src/components/AuthSetup.test.tsx`

- [ ] **Step 1: Write failing test**
Create `src/components/AuthSetup.test.tsx`:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthSetup } from './AuthSetup';

describe('AuthSetup', () => {
  it('calls onSave with input values', () => {
    const handleSave = vi.fn();
    render(<AuthSetup onSave={handleSave} />);
    
    fireEvent.change(screen.getByLabelText(/github token/i), { target: { value: 'token123' } });
    fireEvent.change(screen.getByLabelText(/gist id/i), { target: { value: 'gist123' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    expect(handleSave).toHaveBeenCalledWith('token123', 'gist123');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run src/components/AuthSetup.test.tsx`
Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**
Create `src/components/AuthSetup.tsx`:
```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/components/AuthSetup.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/
git commit -m "feat: add AuthSetup component"
```

---

### Task 4: GitHub API Utility

**Files:**
- Create: `src/utils/github.ts`
- Create: `src/utils/github.test.ts`

- [ ] **Step 1: Write failing test**
Create `src/utils/github.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run src/utils/github.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
Create `src/utils/github.ts`:
```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/utils/github.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/utils/github.*
git commit -m "feat: add github gist api utilities"
```

---

### Task 5: LinkItem Component

**Files:**
- Create: `src/components/LinkItem.tsx`
- Create: `src/components/LinkItem.test.tsx`

- [ ] **Step 1: Write failing test**
Create `src/components/LinkItem.test.tsx`:
```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run src/components/LinkItem.test.tsx`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
Create `src/components/LinkItem.tsx`:
```typescript
export interface LinkType {
  id: string;
  title: string;
  url: string;
  addedAt: string;
}

interface Props {
  link: LinkType;
  onDelete: (id: string) => void;
}

export function LinkItem({ link, onDelete }: Props) {
  return (
    <div className="link-item">
      <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
      <button onClick={() => onDelete(link.id)} aria-label="Delete">Delete</button>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/components/LinkItem.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/LinkItem.*
git commit -m "feat: add LinkItem component"
```

---

### Task 6: Main App Integration

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx` (create if doesn't exist)

- [ ] **Step 1: Write failing test**
Create `src/App.test.tsx`:
```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run src/App.test.tsx`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
Modify `src/App.tsx`:
```typescript
import { useEffect, useState } from 'react';
import { AuthSetup } from './components/AuthSetup';
import { getCredentials, saveCredentials, Credentials } from './utils/storage';
import { fetchTabs, TabData } from './utils/github';

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
```

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/App.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/App.*
git commit -m "feat: integrate main App flow with auth and fetch"
```
