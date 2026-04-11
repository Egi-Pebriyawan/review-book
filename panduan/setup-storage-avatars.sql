-- ============================================================
-- SETUP STORAGE BUCKET UNTUK AVATAR
-- Jalankan di SQL Editor Supabase
-- ============================================================


-- 1. Buat bucket 'avatars' untuk menyimpan foto profil
-- Ini akan menyimpan semua file avatar yang di-upload admin
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;


-- 2. Aktifkan RLS (Row Level Security) untuk storage.objects
-- Ini penting untuk mengontrol siapa yang bisa upload/hapus file
alter table storage.objects enable row level security;


-- 3. Policy: Admin (authenticated users) bisa upload file ke bucket avatars
create policy "Admin bisa upload avatar"
on storage.objects for insert
to authenticated
with check (bucket_id = 'avatars');


-- 4. Policy: Admin bisa update/overwrite file avatar mereka sendiri
create policy "Admin bisa update avatar sendiri"
on storage.objects for update
to authenticated
using (bucket_id = 'avatars' AND owner = auth.uid());


-- 5. Policy: Admin bisa delete file avatar mereka sendiri
create policy "Admin bisa delete avatar sendiri"
on storage.objects for delete
to authenticated
using (bucket_id = 'avatars' AND owner = auth.uid());


-- 6. Policy: Semua orang bisa baca file avatar (karena bucket public)
create policy "Publik bisa baca avatar"
on storage.objects for select
to public
using (bucket_id = 'avatars');


-- ============================================================
-- SELESAI
-- Bucket 'avatars' sudah siap digunakan untuk upload foto profil
-- ============================================================
