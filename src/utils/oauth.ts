const CLIENT_ID = 'Ov23liuT2CzlwbYhJnac';
const CLIENT_SECRET = 'cce9d0dd56e0cafa321cd3c84e243e295692e0bc';
const REDIRECT_URI = window.location.origin;

export function redirectToGitHub() {
  const state = Math.random().toString(36).substring(7);
  localStorage.setItem('oauth_state', state);
  
  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=gist&state=${state}`;
  window.location.href = url;
}

export async function exchangeCodeForToken(code: string, state: string): Promise<string> {
  const savedState = localStorage.getItem('oauth_state');
  if (state !== savedState) throw new Error('Invalid state');

  // We are now hitting GitHub directly with the client_secret.
  // Note: GitHub's OAuth endpoint still might not support CORS for all browser origins.
  // If this fails, we will need to reconsider a tiny backend function.
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    })
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error_description || data.error);
  return data.access_token;
}
