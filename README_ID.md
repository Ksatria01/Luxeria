# LUXERIA Web

Starter website Luxeria dengan desain Cyber Neon. Repository ini sengaja dipisah dari source bot WhatsApp agar deployment website tidak mengganggu bot di Pterodactyl.

## Isi starter
- Landing page Cyber Neon + logo SVG baru.
- Halaman publik Features, Commands, Game Hub, Status.
- Login dan registrasi Email + Password.
- Login OTP melalui WhatsApp menggunakan channel WhatsApp Supabase Auth.
- Dashboard pengguna dan kerangka Admin Control Center.
- Role admin manual melalui tabel `web_roles`.
- SQL migration dengan RLS untuk tabel website.
- Tidak mengubah tabel database bot yang sudah ada.

## Menjalankan lokal

Butuh Node.js 20.9+ (disarankan Node 22).

```bash
cp .env.example .env.local
npm install
npm run dev
```

Isi `.env.local` dengan URL project Supabase Luxeria, Publishable Key (`sb_publishable_...`) atau legacy anon key, dan URL lokal. Jangan pernah memasukkan Secret API Key ke variabel `NEXT_PUBLIC_`.

## Setup Supabase

1. Buka SQL Editor pada project Supabase Luxeria yang sekarang.
2. Review lalu jalankan `supabase/migrations/202611270001_create_web_foundation.sql`.
3. Aktifkan Email provider dan konfigurasi redirect URL `/auth/callback`.
4. Untuk WhatsApp OTP, aktifkan Phone provider dan siapkan Twilio atau Twilio Verify. Supabase WhatsApp OTP memerlukan provider tersebut. Bot Baileys Luxeria bukan pengirim OTP.

## Memberi role owner/admin

Daftarkan akun terlebih dahulu, lalu ambil UUID user di Authentication → Users. Jalankan di SQL Editor:

```sql
insert into public.web_roles (user_id, role)
values ('UUID_AKUN_OWNER', 'owner');
```

Untuk admin gunakan role `admin` dan isi `created_by` dengan UUID owner. User tidak memiliki izin untuk mengangkat dirinya sendiri.

## Deploy Vercel

1. Buat repository GitHub baru bernama `Luxeria-Web`.
2. Upload/push seluruh isi folder ini.
3. Import repository tersebut ke Vercel sebagai project Next.js.
4. Tambahkan `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `NEXT_PUBLIC_SITE_URL` di Project Settings → Environment Variables Vercel.
5. Tambahkan domain Vercel ke Supabase Auth redirect URLs, lalu redeploy.

Pengaturan environment di atas hanya untuk project Vercel, bukan panel Pterodactyl bot.

## Verifikasi

```bash
npm run typecheck
npm run build
```

Lihat `README.md` dan `DEPLOY_CHECKLIST.md` untuk panduan lengkap.

## Batasan starter

Dashboard statistik masih placeholder. Integrasi pembacaan player shard bot, sinkronisasi profil pemain, XP, leaderboard, monitoring Baileys, dan aksi admin belum diaktifkan. Integrasi itu harus dibuat melalui API server-to-server yang tervalidasi, bukan dengan membuka akses browser ke tabel bot.
