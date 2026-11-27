# Deployment checklist

- [ ] Create separate GitHub repository `Luxeria-Web`.
- [ ] Push source code; keep `.env.local` and all secrets out of Git.
- [ ] Create/import the Vercel project from that repository.
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` in Vercel settings.
- [ ] Apply the SQL migration to the existing Luxeria Supabase project.
- [ ] Configure Supabase Auth email provider and redirect URLs.
- [ ] Configure Twilio / Twilio Verify for WhatsApp OTP, if enabling phone login.
- [ ] Register a test account and manually insert its `owner` role row.
- [ ] Test normal user cannot open `/admin`.
- [ ] Test RLS ownership rules.
- [ ] Deploy production and retest confirmation links and auth redirects.
- [ ] Only then begin the bot telemetry and game-data bridge.
