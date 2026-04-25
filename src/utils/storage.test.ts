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
