# AR Shoe Try-On

**Author:** Satyam Mishra

AR virtual shoe try-on in the browser using [DeepAR](https://www.deepar.ai/) and the device camera. Pick a shoe and see it overlaid on your feet in real time.

## Run locally

1. **Install:** `npm install`
2. **Env:** Copy `.env.example` to `.env` and set your DeepAR license key:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set `DEEPAR_LICENSE_KEY` (get a key at [deepar.ai](https://www.deepar.ai/)).
3. **Dev:** `npm run dev` — app opens at http://localhost:8888
4. **Build:** `npm run build` — output in `dist/`

## Tech

- DeepAR SDK, Webpack, Bootstrap. Original MVP from Datathon Vietnam (HK1 2023).
