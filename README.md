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
2. Add env var: `NEXT_PUBLIC_DEEPAR_LICENSE_KEY` = your DeepAR license key.
3. Deploy. All routes (/, /get-info, /detail, /try-on, /privacy) work with client-side navigation.

## Tech

- Next.js (App Router), DeepAR SDK, Bootstrap. Original MVP from Datathon Vietnam (HK1 2023).
