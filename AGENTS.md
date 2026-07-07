<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may differ from older Next.js releases. Read relevant local docs in `node_modules/next/dist/docs/` before changing framework-specific behavior.
<!-- END:nextjs-agent-rules -->

## Local Browser Work

When testing Lineage locally in a browser, prefer `http://lineage.localhost:3000` over bare `localhost` or `127.0.0.1`. Browser cookies are scoped by host, not port. Keep local analytics env vars unset unless the task specifically requires them.

## Data Hygiene

Do not commit private media, credentials, private campaign data, real presigned URLs, customer content, or local SQLite databases.
