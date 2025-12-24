# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CV Crafter is a SaaS CV builder with real-time preview, professional templates, and PDF export. Built with Next.js 15, Supabase, and Zustand. Supports 5 languages (FR, EN, ES, DE, NL).

**Key Stack:**
- Next.js 15 (App Router, TypeScript, Turbopack)
- Supabase (PostgreSQL + Auth)
- Zustand (client state with localStorage persistence)
- TailwindCSS
- Bun (package manager)

## Development Commands

```bash
# Development (with Turbopack)
bun dev

# Development without Turbopack (if font loading or other issues)
bun dev -- --no-turbo

# Production build
bun build
bun start

# Testing
bun test              # Run all tests
bun lint              # ESLint
```

## Architecture

### Data Flow Pattern

**Client-Side State (Zustand):**
- CV data stored in `cvStore` (src/store/cvStore.ts)
- Persists to localStorage as `cv-builder-storage`
- Updates trigger real-time preview (no auto-save)
- User manually saves via Save button

**Save Flow:**
1. User edits → Zustand store updates → localStorage + preview updates
2. Click Save → POST/PUT to `/api/cv` → Supabase
3. Server validates subscription limits + ownership
4. Returns saved CV → client updates store + URL

**Database Schema:**
- All CV sections stored as JSONB in single `cvs` table row
- No normalized relations (optimized for rapid schema evolution)
- RLS policies enforce user-only access
- Subscription limits checked server-side before save

### Subscription Model

**Free Tier:**
- Can create unlimited CVs but only save/download the 1st one (by `created_at`)
- 2nd+ CVs accessible in preview/read-only mode
- Upgrade prompts on restricted actions

**Premium Tier:**
- Unlimited CVs with full save/download

**Implementation:**
- Server: `lib/subscriptionService.ts` → `checkSubscriptionLimits()`
- Client: `hooks/useSubscription.ts` → fetches `/api/user/subscription`
- CV index 0 = editable, index 1+ = preview (for free users)

### Key Architectural Patterns

**1. Fallback Column Handling in API Routes**
- `/api/cv` tries multiple schema variations (old vs new)
- Supports legacy `title`/`template_key` → new `name`/`template_id`
- Auto-retries up to 5x if column doesn't exist
- Enables zero-downtime schema migrations

**2. Zustand + localStorage**
- Prevents data loss if browser closes without saving
- Hydration-safe (SSR returns defaults)
- Single source of truth for editing session

**3. JSONB Flexibility**
- Schema changes don't require migrations
- Single query fetches entire CV
- Trade-off: harder to query/filter across CVs

**4. Server-Side Permission Checks**
- Middleware: shallow auth (redirects only)
- API routes: deep checks (ownership, subscription, admin)
- Admin flag in `user_metadata.isAdmin`

## Directory Structure

```
src/
├── app/
│   ├── api/cv/              # CV CRUD (GET/POST/PUT/DELETE)
│   ├── api/pdf/             # PDF/HTML export
│   ├── api/user/            # User subscription + password
│   ├── api/admin/           # Admin endpoints (users, subscriptions)
│   ├── editor/[id]/         # CV editor page
│   ├── dashboard/           # User CV management
│   ├── auth/                # Login/signup/password-reset
│   └── templates/           # Template showcase
├── components/
│   ├── cv/
│   │   ├── CVEditor.tsx     # Tab-based form (7 sections)
│   │   └── CVPreview.tsx    # Live preview
│   └── ui/                  # Reusable components
├── lib/
│   ├── supabaseClient.ts    # Client-side Supabase
│   ├── supabaseServer.ts    # Server-side Supabase (uses cookies)
│   ├── subscriptionService.ts  # Subscription business logic
│   ├── templates.ts         # 9 templates + 11 theme colors
│   └── i18n/translations.ts # 5-language translations
├── store/
│   ├── cvStore.ts           # Zustand CV state (persisted)
│   └── languageStore.ts     # Zustand language state (persisted)
├── types/cv.ts              # All CV TypeScript interfaces
└── middleware.ts            # Auth redirects for protected routes
```

## Database Setup

**Initial setup:**
1. Create Supabase project at https://supabase.com
2. Run `supabase/schema.sql` in SQL Editor
3. Run `supabase/migrations/001_add_subscriptions.sql`
4. Get URL + anon key from Settings > API
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

**Tables:**
- `cvs`: All CV data (JSONB columns for experiences, education, skills, etc.)
- `subscriptions`: Plan type (free/premium/enterprise) + expiration

**Helper Functions:**
- `get_active_subscription(user_id)`: Returns active subscription
- `is_user_premium(user_id)`: Boolean check for premium status

## Important Implementation Details

### CV Save Logic (src/app/api/cv/route.ts)

**POST (Create):**
- Checks subscription limit: free users can only save 1st CV
- Uses fallback logic for schema compatibility
- Returns full CV object for client state update

**PUT (Update):**
- Verifies ownership via `user_id`
- Checks if CV is in "preview mode" (free user editing 2nd+ CV)
- Returns 403 if user can't save this CV

### Template System (src/lib/templates.ts)

- 9 templates: Modern, Classic, Minimal, Creative, Tech, Executive, Compact, Bold, Academic
- 11 theme colors: Blue, Indigo, Violet, Pink, Red, Orange, Green, Teal, Cyan, Gray, Black
- Template metadata: name, description, category, preview image
- Switching updates Zustand store → immediate re-render

### i18n (src/lib/i18n/translations.ts)

- Hook: `useTranslation()` from `languageStore`
- Key format: `nav.*`, `editor.profile.*`, `dashboard.*`
- Adding language:
  1. Add code to `LanguageCode` type
  2. Add translations to `translations` object
  3. Add to `languages` array with flag

### PDF Export (src/app/api/pdf/route.ts)

- Currently returns HTML representation
- Free users can only download 1st CV
- Ready for PDF library integration (@react-pdf/renderer installed)

## Common Tasks

### Adding a New CV Section

1. Add interface to `src/types/cv.ts`
2. Add to `CVData` interface + `defaultCVData`
3. Add JSONB column to Supabase `cvs` table
4. Add Zustand actions to `src/store/cvStore.ts`
5. Create form component in `src/components/cv/`
6. Add tab to `CVEditor.tsx`
7. Add render logic to template files

### Creating a New Template

1. Add entry to `templates` array in `src/lib/templates.ts`
2. Create template component in `src/components/cv/templates/`
3. Import in `CVPreview.tsx` template switch
4. Add preview image to `/public/templates/`

### Modifying Subscription Logic

- Server checks: `src/lib/subscriptionService.ts`
- Client hook: `src/hooks/useSubscription.ts`
- Admin management: `src/app/api/admin/subscriptions/route.ts`

## Testing

- `src/tests/a11y.test.tsx`: Accessibility tests with jest-axe
- Tests landing page, dashboard, editor for WCAG compliance

## Known Patterns to Follow

**When adding API routes:**
- Always use server-side Supabase client (`lib/supabaseServer.ts`)
- Check authentication via `supabase.auth.getUser()`
- Verify ownership before mutations
- Return descriptive errors in French/English

**When modifying database schema:**
- Update both `types/cv.ts` (CVDBSchema) and actual Supabase table
- Test with fallback column handling in `/api/cv/route.ts`
- Consider old data compatibility

**When working with Zustand:**
- Use `isDirty` flag to track unsaved changes
- Always set `isDirty: true` when mutating cvData
- Reset `isDirty: false` after successful save