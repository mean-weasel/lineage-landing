# Lineage Landing

Independent landing page for Lineage, built from the Bugdrop.dev Next.js template and adapted for the Lineage product story.

## Development

```bash
npm install
npm run dev -- -H lineage.localhost
```

Open [http://lineage.localhost:3000](http://lineage.localhost:3000).

Use the project-specific `lineage.localhost` host for local browser testing instead of mixing bare `localhost` and `127.0.0.1`; cookies are scoped by host, not port. Leave local analytics keys such as `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `NEXT_PUBLIC_POSTHOG_KEY` unset unless you are intentionally testing analytics.

## Production URL

Set `NEXT_PUBLIC_SITE_URL` in the deployment environment to the final canonical site URL. Until then, metadata defaults to `https://lineage.meanweasel.com`.

## Checks

```bash
npm run lint
npm run build
```
