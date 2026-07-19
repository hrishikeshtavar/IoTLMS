# SimuLearning (IoTLMS)

A multi-tenant learning management platform for teaching IoT and embedded
systems in K-12 schools — in-browser code labs, video lessons with
AI-generated multilingual subtitles, assessments, gamification, and
QR-verifiable completion certificates, white-labeled per school.

`Next.js` · `NestJS` · `PostgreSQL` · `Prisma` · `Redis` · `MinIO` · `Meilisearch` · `TypeScript`

---

## Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Data Model](#data-model)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

## Overview

SimuLearning is a school-facing LMS built specifically around teaching IoT
and embedded systems concepts, rather than a generic course platform adapted
to fit. Each school onboards as its own tenant with a dedicated subdomain and
custom branding (logo, colors, and the principal's own signature embedded on
issued certificates). Students work through courses combining video lessons,
in-browser coding labs, and quizzes; teachers and school admins manage
content and track progress through role-scoped dashboards; a platform-level
super-admin manages the full multi-school deployment.

## Key Features

**For students**
- Course → lesson → assessment progression with in-browser lab sessions
  (Monaco-editor-based code exercises, not just video playback)
- Quizzes and auto-graded assessments
- Points and badges (gamification) tied to course progress
- QR-verifiable completion certificates, publicly checkable at a `/verify/[certCode]` route
- Full experience in English, Hindi, and Marathi
- Native iOS/Android apps (via Capacitor) alongside the web app and PWA

**For school admins**
- Course, lesson, and assessment authoring (rich-text CMS)
- School-specific branding: logo, color scheme, favicon, and signatories for certificates
- User and enrollment management scoped to their own school
- Analytics dashboards on student progress and engagement

**For the platform (super-admin)**
- Cross-tenant school management and platform-wide course catalog
- Multi-tenant isolation enforced at the middleware level, not just by query filters

**Platform-wide**
- AI-generated video subtitles (OpenAI Whisper) to support the multilingual
  student base without manual captioning
- Full-text search across course content (Meilisearch)
- Object storage for lesson media and generated assets (MinIO, S3-compatible)

## Architecture

A Turborepo monorepo with a clear frontend/backend split:

- **`apps/web`** — Next.js 16 (App Router) + React 19. Server-rendered
  student, admin, and super-admin experiences; PWA-enabled; wrapped natively
  for iOS/Android via Capacitor.
- **`apps/api`** — NestJS. Modular by domain (auth, courses, lessons,
  assessments, enrollments, certificates, gamification, tenant, search,
  upload, subtitles, analytics), each with its own controller/service/module
  and, for the core modules, unit tests alongside the implementation.

**Multi-tenancy** is enforced via a tenant-resolution middleware on every API
request — the tenant is derived from the request (subdomain in production)
and scopes every downstream query, rather than being trusted from client
input.

**Request flow in production:** Caddy terminates TLS (via Cloudflare DNS
challenge) and reverse-proxies wildcard school subdomains to the Next.js
app and the API subdomain to NestJS, both running behind the same host.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 16, React 19, TypeScript |
| Backend framework | NestJS |
| Database | PostgreSQL via Prisma ORM |
| Cache | Redis |
| Object storage | MinIO (S3-compatible) |
| Search | Meilisearch |
| Auth | JWT (access + refresh), bcrypt, Passport |
| AI | OpenAI Whisper (video subtitle generation) |
| Mobile | Capacitor (iOS + Android from the same Next.js codebase) |
| Rich content | Tiptap (CMS rich-text editor), Monaco Editor (code labs), Vidstack (video player) |
| 3D / motion | Spline, Three.js, Framer Motion, Lottie |
| i18n | i18next (English, Hindi, Marathi) |
| Observability | Sentry (client + server) |
| Security | Helmet, class-validator/class-transformer DTO validation, rate limiting (Throttler), CORS allowlisting |
| Infra / deployment | Docker Compose, Caddy (automatic TLS via Cloudflare) |
| CI/CD | GitHub Actions (lint, test against a real Postgres service container, build) |
| Load testing | k6 |

## Data Model

Core entities (see `apps/api/prisma/schema.prisma` for the full schema):

`Tenant` and `BrandKit` (per-school identity and white-labeling) →
`User` (role-scoped: `super_admin` / `admin` / `student`) → `Course` →
`Lesson` → `LessonContent` (versioned via `ContentVersion`) → `Enrollment` →
`Assessment` → `Question` → `Submission`. Supporting entities: `LabSession`
(in-browser code lab attempts), `Certificate`, `Badge` / `UserBadge`
(gamification), `UserActivity`, and `RefreshToken`.

## Getting Started

**Prerequisites:** Node.js ≥ 18, Docker.

```bash
# Install dependencies
npm install

# Start local infrastructure: PostgreSQL, Redis, MinIO, Meilisearch
docker-compose up -d

# Copy the environment template and fill in values (see below)
cp .env.example .env

# Run database migrations
cd apps/api && npx prisma migrate dev

# Start both apps in dev mode (from the repo root)
npm run dev
```

The web app runs on `:3000`, the API on `:3001`.

## Environment Variables

The variables below reflect what the codebase actually reads at runtime —
worth knowing that the current `.env.example` in the repo is missing a few
of these (`OPENAI_API_KEY`, the Meilisearch and Cloudflare DNS token) and
still lists `RAZORPAY_*` variables from a payment integration that's since
been removed from the codebase. Not a functional issue, just something to
tidy up whenever it's convenient.

| Variable | Used for |
|---|---|
| `DATABASE_URL` | PostgreSQL connection (Prisma) |
| `JWT_SECRET` | Access token signing |
| `REDIS_URL` | Redis connection |
| `MINIO_ENDPOINT`, `MINIO_PORT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_USE_SSL`, `MINIO_PUBLIC_URL` | Object storage |
| `MEILISEARCH_HOST`, `MEILISEARCH_KEY` | Search |
| `RESEND_API_KEY`, `FROM_EMAIL` | Transactional email |
| `OPENAI_API_KEY` | Whisper subtitle generation |
| `ALLOWED_ORIGINS` | CORS allowlist |
| `THROTTLER_ENABLED`, `THROTTLER_TTL_MS`, `THROTTLER_LIMIT` | API rate limiting |
| `SENTRY_DSN` | Error tracking |
| `FRONTEND_URL`, `NEXT_PUBLIC_API_URL` | Cross-service URLs |
| `DEV_TENANT_SLUG` | Local dev tenant override |
| `CF_API_TOKEN` | Cloudflare DNS challenge for Caddy TLS (production only) |

## Testing

```bash
# Unit tests (API)
cd apps/api && npm test

# End-to-end tests
cd apps/api && npm run test:e2e

# Load tests (k6 — requires k6 installed separately)
k6 run tests/load/api.js
k6 run tests/load/auth.js
```

CI runs lint and the unit test suite against a real PostgreSQL service
container on every push and pull request to `main`/`develop`. Load tests are
configured for a 200 req/s target with a p95 latency budget of 500ms and a
<5% server-error-rate threshold.

## Deployment

Runs behind Caddy for automatic TLS (Cloudflare DNS challenge), reverse
proxying wildcard school subdomains to the Next.js app and a dedicated API
subdomain to NestJS. Infrastructure (Postgres, Redis, MinIO, Meilisearch)
runs via Docker Compose.

## Project Structure

```
├── apps/
│   ├── web/          Next.js frontend (student, admin, super-admin, marketing site)
│   └── api/           NestJS backend (one module per domain)
├── packages/
│   ├── db/             Shared Prisma schema/client
│   ├── ui/              Shared React component library
│   ├── eslint-config/   Shared lint rules
│   └── typescript-config/  Shared tsconfig bases
├── prisma/            Root-level Prisma config
├── caddy/              Reverse proxy config
├── tests/load/         k6 load test scripts
├── docker-compose.yml   Local dev infrastructure
└── .github/workflows/   CI pipeline
```
