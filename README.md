# tds-blog

Public blog at `blog.tracht-digital.de`. Astro 5 + Tailwind v4. All
posts SSG-rendered at build time from `tds-content-api`.

## Local dev

```bash
npm install
npm run dev    # http://localhost:4321
```

By default fetches from production `https://api.tracht-digital.de/content`.
Override with:

```bash
CONTENT_API_URL=http://localhost:8001 npm run dev
```

## Deploy

Push to `main` (or trigger `workflow_dispatch` from `tds-content-api`
after a publish). GitHub Actions builds the static site and SFTP-uploads
to `~/sites/blog.tracht-digital.de/releases/<TS>/`, then hits
`install.php?action=install-static&target=blog.tracht-digital.de`.

## RSS

Available at `/rss.xml`. Pulls from the same `tds-content-api`.
