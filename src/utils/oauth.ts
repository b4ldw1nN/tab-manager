const CLIENT_ID = 'Ov23liuT2CzlwbYhJnac';
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

  // Using a CORS proxy because GitHub OAuth token endpoint doesn't support CORS for OAuth Apps
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token';
  
  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      code,
    })
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error_description || data.error);
  return data.access_token;
}
