# Tab Manager Design

## Context
A client-side (static) Web Application for manual link management, using GitHub Gists as the storage backend.

## Architecture
- **Frontend Framework**: React 18, Vite, TypeScript.
- **Styling**: Vanilla CSS.
- **Storage Strategy**: GitHub Gists API. Data is saved as a single JSON file (`tabs.json`).
- **Authentication Strategy**: The user provides a GitHub Personal Access Token (PAT) via a settings modal, which is stored securely in the browser's `localStorage`.

## Data Model
```json
{
  "categories": [
    {
      "id": "string (UUID)",
      "title": "string",
      "links": [
        {
          "id": "string (UUID)",
          "title": "string",
          "url": "string (URL)",
          "addedAt": "string (ISO Date)"
        }
      ]
    }
  ]
}
```

## Components
- `App`: Main layout wrapper, manages high-level state (authenticated vs not authenticated).
- `AuthSetup`: A modal or initial screen prompting the user to paste their GitHub PAT and an existing Gist ID, or generating a new Gist if none is provided.
- `Dashboard`: The main view containing a list of `Category` components.
- `Category`: Displays a section (category) of links. Includes an inline form or button to "Add Link" and "Delete Category".
- `LinkItem`: Displays an individual link with an option to remove it. Clicking the link opens it in a new tab.

## Data Flow
1. On application load, the system checks `localStorage` for the PAT and Gist ID.
2. If credentials are found, it fetches the `tabs.json` payload from the GitHub Gists API.
3. If credentials are missing, it displays the `AuthSetup` component.
4. When a user modifies data (e.g., adding a link, deleting a category), the React state updates instantly (optimistic UI), and a debounced API call sends the updated JSON string back to the GitHub Gist via a `PATCH` request.

## Error Handling
- Network errors or API rate limits will trigger a non-blocking toast/banner notification instructing the user to check their connection.
- Invalid or expired PATs will redirect the user to the `AuthSetup` screen to re-enter their token.

## Testing Strategy
- Use Vitest and React Testing Library (RTL).
- Component tests will verify that links can be added and removed from the list locally.
- The GitHub API module will be mocked to verify correct data formatting and error handling paths.
