# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Portfolio audience — evaluators deciding whether to reach out (recruiters, summer-program admissions, internship programs), college admissions readers forming an impression of the whole person, and peers or collaborators deciding whether to build something together or follow the work. All three audiences are equally important; none is secondary.

## Product Purpose

Personal portfolio and living activity log for Anagh Nathwani, high school student and builder. The site shows shipped software projects, diverse real-world interests (violin performance, travel, cooking, academic milestones), and a genuine personality. Success means a visitor leaves believing "this person ships real things and is genuinely interesting," then takes an action: sends an email, visits a GitHub repo, bookmarks the site, or returns for the next notebook entry.

## Positioning

A high-school developer who combines hands-on technical breadth (React, Python, 3D graphics, full-stack apps, hardware) with rich non-technical pursuits documented in a living log — a record of a whole person, not a résumé.

## Operating Context

Primarily viewed on desktop by evaluators doing light pre-outreach research; accessed on mobile by peers and casual visitors. No login, no accounts. Visitors are skimming first, then drilling into projects or notebook entries that catch their attention. The notebook (Blog/Notebook route) is a returning-visitor destination as new entries appear.

## Capabilities and Constraints

- Three routes: Home (`/`), Workshop (`/projects`), Notebook (`/blog`)
- Tag-based filtering on both Projects and Notebook pages
- Notebook entries support carousel images, Vimeo video embeds, and PDF links
- 3D hero scene on the homepage (React Three Fiber particle scene) — not locked; open for evolution or replacement
- Deployed to GitHub Pages (static export); no server-side rendering
- Stack: React 19 + Vite + React Router DOM · Three.js / React Three Fiber / Drei · CSS Modules · gh-pages

## Brand Commitments

- Dark theme direction is preserved; exact palette shades are open to change
- Geometric sans-serif typography (Futura / Century Gothic stack) is intentional and stays
- Warm golden accent is the current signature; the specific shade is open
- General visual style is preserved; elements that read as generic AI-generated aesthetics are candidates for replacement

## Evidence on Hand

- 5 shipped projects with real GitHub links and descriptions: iGEM Software Team Application (React + Firebase), Sudoku Solver (Python CLI), EasyBios (hardware config tool, 40+ users), Custom PC Build, Efficient.App (React + Firebase)
- 22 notebook entries: 13 violin/orchestra/chamber-music entries with Vimeo recordings, 6 "Straight Up Unreal" travel/nature experiences, 1 CTY milestone, 3 cooking posts
- Real contact: anaghnathwani@gmail.com · github.com/anaghnathwani
- No fabricated testimonials, invented user counts, or placeholder copy exists; future work must not add them

## Product Principles

1. **Show, don't claim** — every assertion is backed by a real artifact, link, or notebook entry
2. **A whole person** — technical depth and human interests carry equal weight on every surface
3. **Permanent record** — the notebook is a living log; it should feel worth returning to as it grows
4. **Signal over noise** — design serves the content; interface chrome recedes
5. **Honest craft** — no fabricated metrics, testimonials, or placeholder copy, ever
