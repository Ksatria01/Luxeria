# LUXERIA Web

Starter project for the Luxeria digital ecosystem. Separate from the WhatsApp bot repository and designed for Vercel + the existing Supabase project.

## Included

- Cyber-neon responsive landing page and redesigned SVG brand mark.
- Public pages: Features, Commands, Game Hub and Status.
- Supabase Auth flows: email/password registration and login, plus WhatsApp OTP login.
- Protected user dashboard and admin route group.
- Manual admin-role model (`web_roles`); no public self-promotion to admin.
- Initial SQL migration for website-owned tables with RLS.
- No changes to existing Luxeria bot tables or bot source.

## Requirements

- Node.js 20.9 or newer (Node 22 LTS recommended).
- npm.
- Existing Supabase project.
- GitHub repository and Vercel account for deployment.

## 1. Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Fill `.env.local` with:

- `NEXT_PUBLIC_SUPABASE_URL`: the existing Luxeria Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: the project's Publishable key (`sb_publishable_...`) or legacy anon key. Never use a secret/service-role key here.
- `NEXT_PUBLIC_SITE_URL`: `http://localhost:3000` locally, then your production domain on Vercel.

Open `http://localhost:3000`.

## 2. Apply website schema

Review and run `supabase/migrations/202611270001_create_web_foundation.sql` in the Supabase SQL Editor for the existing Luxeria project.

This migration creates only `web_*` tables. It does not truncate, rename, migrate, or modify `luxeria_players`, `luxeria_state`, or other bot data.

After applying the migration, check that all six `web_*` tables exist and RLS is enabled. Do not disable RLS to make the UI work.

## 3. Enable email authentication

In Supabase Dashboard → Authentication → Providers, enable Email. Configure the email confirmation behavior and SMTP provider appropriate for production. Add these redirect URLs under Authentication → URL Configuration:

- `http://localhost:3000/auth/callback`
- `https://YOUR-VERCEL-DOMAIN/auth/callback`

Set the Site URL to your production website after deployment.

## 4. Enable WhatsApp OTP

The app requests WhatsApp delivery explicitly using Supabase Auth's `channel: 'whatsapp'` option. Supabase currently supports WhatsApp phone OTP through Twilio or Twilio Verify, not arbitrary WhatsApp/Baileys sessions.

In Supabase Dashboard → Authentication → Providers → Phone:

1. Enable Phone authentication.
2. Configure Twilio or Twilio Verify.
3. For Twilio Programmable Messaging, complete WhatsApp sender onboarding and configure the required approved Content Template SID in Supabase. With Twilio Verify, configure WhatsApp as the enabled verification channel.
4. Set sensible OTP rate limits and CAPTCHA for production.

Phone numbers must use E.164 format, for example `+628123456789`. The verification code is entered on `/verify`.

Important: Luxeria's existing Baileys bot connection is not an OTP provider. This starter does not send OTP through the bot. WhatsApp OTP will not work until the provider is configured in Supabase/Twilio.

## 5. Manually assign an admin

First register the intended account and confirm its email or phone. Then copy that user's UUID from Supabase Authentication → Users. In SQL Editor, run:

```sql
insert into public.web_roles (user_id, role)
values ('PASTE_AUTH_USER_UUID_HERE', 'owner');
```

For an administrator:

```sql
insert into public.web_roles (user_id, role, created_by)
values ('PASTE_ADMIN_USER_UUID_HERE', 'admin', 'PASTE_OWNER_USER_UUID_HERE');
```

To revoke access:

```sql
delete from public.web_roles where user_id = 'PASTE_USER_UUID_HERE';
```

The role table has no client-side insert/update policy. Users cannot grant themselves admin access. The middleware checks the signed-in user's own role row before serving `/admin` routes.

## 6. Deploy to Vercel

1. Create a new, separate GitHub repository named `Luxeria-Web`.
2. Push this project to the repository's default branch.
3. In Vercel, import the `Luxeria-Web` repository. Framework preset should be Next.js; root directory is `./`.
4. Add the same three public/site variables from `.env.example` in Vercel Project Settings → Environment Variables. `SUPABASE_SECRET_KEY` is not needed for this starter and should remain unset.
5. Deploy. Add the final Vercel domain to Supabase Auth redirect URLs and update `NEXT_PUBLIC_SITE_URL` to the production URL, then redeploy.

Vercel environment variables are configured in the Vercel project settings. This is separate from the Pterodactyl setup for the WhatsApp bot.

## 7. Verification commands

```bash
npm run typecheck
npm run build
```

Before production, test these flows:

- Landing page and public navigation on desktop and mobile.
- Email registration, confirmation link, login and logout.
- WhatsApp OTP only after Twilio/WhatsApp provider setup.
- Signed-out access to `/dashboard` and `/admin` redirects to `/login`.
- Normal user access to `/admin` redirects to `/dashboard`.
- Manually assigned admin can open `/admin`.
- RLS prevents a user from reading another user's profile, support tickets or notifications.

## Current scope / intentionally not connected yet

This is a tested-by-inspection starter foundation, not the complete production ecosystem. The dashboard values are placeholders. It does not yet read bot player shards, change player XP/coins/inventory, operate the WhatsApp session, or expose privileged database health. Those integrations need a signed server-to-server bridge and an explicit mapping between verified Auth phone numbers and Luxeria player IDs.

The public `/status` page intentionally does not claim that the bot or database is online. The `/api/status` endpoint currently reports only that the web route is responding.

## Security notes

- Never place `sb_secret_...` or legacy `service_role` keys in `NEXT_PUBLIC_*` variables, frontend code, GitHub, or this ZIP.
- The starter uses the Publishable/anon key with RLS for normal user operations.
- `SUPABASE_SECRET_KEY` is reserved for future server-only privileged integrations and is not read by the current app.
- Do not grant browser users write access to bot-owned player tables.
- Review SQL policies before adding admin features. Admin UI visibility is not a security boundary; every privileged operation must enforce role checks server-side.
