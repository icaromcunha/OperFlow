<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/eb700811-5ed8-4a77-ab66-fcea9d3cdd07

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Deploy / Login 404 troubleshooting

If login returns `Request failed with status code 404`, your frontend is loading but the API route is missing.

- Default frontend behavior is to call `/api/auth/login` on the same domain.
- If backend is hosted in another domain, set `VITE_API_BASE_URL` (example: `https://api.operflow.app/api`).
- Make sure your reverse proxy forwards `/api/*` to the Node/Express server.

