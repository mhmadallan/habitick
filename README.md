# Habitick

Habitick is an Express + static frontend app with Supabase auth/data and OpenAI-powered helper endpoints.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Publish on Render

1. Push this repo to GitHub (already done).
2. In Render, click `New +` -> `Blueprint`.
3. Select this repo (`mhmadallan/habitick`).
4. Render will detect `render.yaml` and create a web service.
5. In Render service settings, add environment variable:
   - `OPENAI_API_KEY` = your real key
6. Deploy.

## Important security step

Rotate your OpenAI API key before production use, then set the new key in Render.
Do not commit keys to Git.
