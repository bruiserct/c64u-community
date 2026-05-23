# C64U BBS Directory

Community-maintained directory of telnet BBSes that work well with the
Commodore 64 Ultimate. Companion to
[BVTerm 2026](https://github.com/bruiserct/BVTerm2026).

Each listing tells you the practical bits a C64U user actually needs:

- which terminal mode to pick in BVTerm 2026 (ANSI-wide, ANSI-40, VT102, …)
- the recommended baud rate
- the exact `ATDT host:port` dial string to copy into your terminal

## Data

The BBS list lives in [`data/bbses.yaml`](./data/bbses.yaml). The schema
is defined in [`lib/bbses.ts`](./lib/bbses.ts) and is validated with
[zod](https://zod.dev/) at build time — bad data fails CI, not production.

## Contributing a BBS

Easiest: open a [submission issue](https://github.com/bruiserct/c64u-community/issues/new?labels=bbs-submission)
with the template the site links to (`/submit`).

Faster path if you're comfortable with git: edit
[`data/bbses.yaml`](./data/bbses.yaml), open a PR. Schema is enforced at
build time.

## Development

```
npm install
npm run dev    # http://localhost:3000
npm run build  # production build (validates the YAML)
npm run lint
```

## Stack

- Next.js 16 App Router (React 19)
- Tailwind CSS v4
- [shadcn/ui](https://ui.shadcn.com/) (radix-ui base)
- TypeScript
- YAML data file (no database — submissions land as PRs/issues)
- Deployed on Vercel

## Mission

Tools for the C64U community should be:

1. **Useful** — every C64U owner with a network connection should find this app a daily-use reference
2. **Honest** — verified info, with sources where possible
3. **Beautiful** — retro-faithful styling without nostalgia-tax usability
4. **Open** — community-curated, source-available, MIT-licensed

If those goals slip, file an issue.

## License

MIT — see [LICENSE](./LICENSE).
