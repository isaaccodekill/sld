# Supabase setup

1. Create a Supabase project and copy `.env.local.example` to `.env.local`.
2. Add the project URL and anon key. Never add the service-role key to the app.
3. Run `supabase/migrations/202607180001_core_admin.sql` in the SQL editor.
4. In Authentication, create the one therapist user with email and password. Public sign-up is not used.
5. Run the allowlist insert shown at the bottom of the migration, replacing the example email.
6. Restart `npm run dev`. `/admin` will then require the approved Supabase account.

Until the two public Supabase variables are configured, the admin runs in local setup mode and keeps appointments, drafts, and completed notes in this browser.
