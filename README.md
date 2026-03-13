# AR Shoe Try-On

**Author:** Satyam Mishra

AR virtual shoe try-on in the browser using [DeepAR](https://www.deepar.ai/) and the device camera. Built with **Next.js** for reliable routing and deployment (e.g. Vercel).

## Run locally

1. **Install:** `npm install`
2. **Env:** Copy `.env.example` to `.env.local` and set your DeepAR license key:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and set `NEXT_PUBLIC_DEEPAR_LICENSE_KEY` (get a key at [deepar.ai](https://www.deepar.ai/)).
3. **Dev:** `npm run dev` — app at http://localhost:3000
4. **Build:** `npm run build` && `npm run start`

## Deploy on Vercel

1. Push to GitHub and import the repo in Vercel.
2. **Before the first deploy:** In Vercel → Project → Settings → Environment Variables, add:
   - Name: `NEXT_PUBLIC_DEEPAR_LICENSE_KEY`
   - Value: your DeepAR license key (from [deepar.ai](https://www.deepar.ai/))
   - Apply to Production (and Preview if you want).
3. Deploy. The license is inlined at **build time**. If you added the env var *after* a deploy, you must **Redeploy** (Deployments → ⋮ → Redeploy; optionally enable **Clear build cache**) so the next build runs with the variable.
4. **"License not valid" in production?** DeepAR keys are **tied to the domain**. If it works on localhost but not on Vercel, add your production domain in [DeepAR Developer Portal](https://developer.deepar.ai) → your project → your Web App → add the **domain only** (e.g. `your-app.vercel.app`, no `https://` or path). The same key then works for that domain.
5. If you see "Cannot find module './388.js'" or similar: clear build cache (Vercel → Deployments → ⋮ on latest → Redeploy with cleared cache), or locally run `rm -rf .next && npm run build`.

## Tech

- Next.js (App Router), DeepAR SDK, Bootstrap. Original MVP from Datathon Vietnam (HK1 2023).
