# C64U BBS Directory — Design Spec

**Date:** 2026-05-22
**Status:** Autopilot build — user authorized "use all plugins, skills, superpowers"
**Author:** Claude (with Bruce Harris as project owner)

## Mission

A web app for the Commodore 64 Ultimate (C64U) community to discover, share, and verify telnet BBSes that work well with the C64U + 80-column ANSI terminals like BVTerm 2026.

**Path to Perfect (the project's quality compass):**
1. **Useful** — every C64U owner with a network connection should find this app a daily-use reference
2. **Honest** — BBS up/down status is real, not stale; verified info beats inherited copy
3. **Beautiful** — retro-faithful styling without nostalgia-tax usability (mobile, light/dark, fast)
4. **Open** — submissions from the community, transparent moderation, source on GitHub

## Why this app exists

The C64U community is small (low-thousands worldwide), passionate, and mostly oral-tradition for BBS recommendations. The existing scattered lists (Telnet BBS Guide, csdb.dk forums, scattered tweets) aren't curated for the C64U specifically — they don't tell you:

- Is this BBS up RIGHT NOW?
- Will my C64U handle it (ANSI-80 capable? specific baud rate? CGA/PETSCII art only?)
- Is the BBS's content family-friendly / what does it host (games / chat / files / art)?
- What's the recommended terminal mode (ANSI-40, ANSI-wide, VT102-wide, etc. per Striketerm's picker)?

This app fixes that gap.

## Core features (MVP)

### 1. BBS Directory (public, read-only)

- Browseable list of BBSes
- Per BBS: name, telnet host:port, sysop, description, tags, terminal-mode compatibility, baud-rate recommendation, status (up/down/unknown), last-verified timestamp, community votes
- Sortable / filterable: name, last seen up, popularity (votes), terminal-mode (ANSI-40 / ANSI-80 / etc.), tags
- Search: full-text across name + description + tags

### 2. BBS detail page

- Everything above + screenshot gallery, dial command snippet (`ATDT host:port`), history (last 30 days uptime), short prose description (markdown)
- "Dial this from BVTerm 2026" button — copies the ATDT string

### 3. Live status pings

- Cron job (every 1 hour) hits each BBS's telnet port with a 5-second TCP connect probe
- Records up/down + response time
- Last 30 days of status data shown on detail page

### 4. Community submission

- "Submit a BBS" form (no user accounts in MVP — anonymous with required email for follow-up)
- Submissions go to a moderation queue
- Admin (Bruce) reviews + approves via simple admin password
- After approval, BBS appears in public listing

### 5. Vote / upvote

- Anonymous voting (one vote per IP per BBS, daily cooldown)
- Popular-by-votes sort

### 6. BVTerm 2026 integration

- Footer linking to the BVTerm 2026 GitHub repo
- Each BBS detail page has a "Recommended terminal config for BVTerm 2026" snippet (Term: ANSI-wide, baud: 38400, etc.)

## Architecture

```
┌─────────────────────────────┐
│  Next.js 15 App Router      │  ←  Vercel-deployed
│  ─ shadcn/ui components     │
│  ─ Tailwind 4 (CSS)         │
│  ─ TypeScript (strict)      │
└──────────┬──────────────────┘
           │
           │ Server Actions + Cache Components
           │
           v
┌─────────────────────────────┐
│  Vercel Postgres (Neon)     │  ←  via Marketplace
│  ─ bbs, status_check tables │
│  ─ submissions, votes       │
└─────────────────────────────┘
           ↑
           │
┌─────────────────────────────┐
│  Cron (every hour)          │  ←  Vercel Cron Jobs
│  ─ ping each BBS            │
│  ─ insert status_check row  │
└─────────────────────────────┘
```

### Data model

```ts
bbs {
  id: uuid
  slug: string  // url-safe
  name: string
  host: string
  port: number
  description: text (markdown)
  sysop: string?
  terminal_modes: text[]  // ["ANSI-40", "ANSI-wide", "VT102", ...]
  baud_recommended: int?  // 2400, 9600, 38400
  tags: text[]  // ["games", "chat", "files", "ansi-art", "scene"]
  ansi_style: enum  // "petscii" | "ascii" | "ansi" | "mixed"
  approved: bool
  approved_at: timestamp?
  created_at: timestamp
  created_by_email: string?  // hashed
}

status_check {
  id: uuid
  bbs_id: uuid -> bbs.id
  checked_at: timestamp
  status: enum  // "up" | "down" | "timeout" | "refused"
  response_ms: int?
}

vote {
  id: uuid
  bbs_id: uuid -> bbs.id
  voter_ip_hash: string
  created_at: timestamp
  // unique(bbs_id, voter_ip_hash, day_bucket)
}

submission {
  id: uuid
  bbs_id: uuid?  // null for new submissions; set for edit suggestions
  payload: jsonb
  status: enum  // "pending" | "approved" | "rejected"
  submitter_email: string?
  created_at: timestamp
}
```

### Page routes

- `/` — homepage with featured + latest BBSes, search, filter
- `/bbs/[slug]` — detail page
- `/bbs/[slug]/history` — uptime history graph
- `/submit` — submission form
- `/admin` — password-gated moderation queue
- `/api/cron/ping` — cron endpoint (hourly status check)
- `/about` — what this is, BVTerm 2026 link, GitHub repo, contact

## Design language

Retro-faithful but modern usable:
- Color palette: dark mode by default (matches the BBS world); light mode also available. PETSCII-ish accent colors for visual ties.
- Typography: monospace for BBS metadata (host, dial command); humanist sans-serif for prose
- No unnecessary animation, no parallax, no scroll hijacking
- Mobile-first responsive

## Implementation order (overnight)

1. **Foundation** — Next.js 15 init, TypeScript strict, shadcn install, Tailwind 4, basic page shell
2. **Database** — schema migration, seed with a handful of known C64U-friendly BBSes (commodore.network, particles.org, etc.)
3. **Read paths** — homepage list, detail page, search
4. **Write paths** — submission form, vote
5. **Admin** — moderation page (password gate)
6. **Cron** — hourly ping
7. **Polish** — light/dark, mobile, accessibility, OG image generation
8. **Deploy** — Vercel preview, push to GitHub
9. **Docs** — README, contributing guide, deploy badge

## Out of scope (MVP)

- User accounts / OAuth
- Comments / chat
- ANSI art previews (Phase 2)
- Disk file repository (separate app)
- Real-time chat
- Self-hostable Docker image (Phase 2 if requested)

## Open questions (resolved by Bruce on next session)

1. Domain name — for now, deploys to the Vercel preview URL. Bruce can connect a custom domain later.
2. Moderation policy — defaults: must be a real telnet BBS, no commercial / paywall, must specify terminal compatibility. Bruce can refine.
3. Initial seed BBSes — I'll pick ~8 from the existing Telnet BBS Guide that are known to work with Striketerm/Novaterm, but Bruce can edit.

## Risk register

| Risk | Mitigation |
|---|---|
| Vercel Cron not available on free tier | Use a simple in-app interval check if needed |
| Postgres provisioning takes manual approval | Default to SQLite for local dev; migrate to Postgres post-deploy |
| ANSI rendering complexity | Defer to Phase 2 |
| Status pings get blocked by BBS firewalls | Document; show "unknown" status in those cases |

## Success criteria

By morning, Bruce should be able to:
- Open the Vercel preview URL
- See a working app with ≥5 seeded BBSes
- See real status data (at least 1 hourly ping cycle)
- Submit a test BBS through the form
- Approve it through the admin page
- See it appear in the public listing
- Click "Dial this from BVTerm 2026" and get a usable ATDT command
- Pull the source from GitHub

Bruce signals approval by either keeping things or telling me what to change.
