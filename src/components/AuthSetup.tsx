import { redirectToGitHub } from '../utils/oauth';

export function AuthSetup() {
  return (
    <div className="auth-setup">
      <h2>Welcome to Tab Manager</h2>
      <p>Store your tabs securely in your own GitHub Gists.</p>
      <button onClick={redirectToGitHub} className="login-button">
        Login with GitHub
      </button>
    </div>
  );
}
