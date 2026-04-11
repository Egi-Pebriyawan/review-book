# Skenario Pengujian (Test Scenarios) API

Dokumen ini berisi daftar skenario pengujian yang harus dilakukan untuk memastikan semua interaksi data (Supabase & External API) pada aplikasi berjalan dengan baik. Implementasikan testing ini (bisa menggunakan framework seperti Vitest, Jest, atau sekadar manual E2E test).

## 1. API: `useBooks` (Manajemen Buku)

**A. `getBooks()`**
- **Skenario Positif:**
  - Mengambil daftar buku tanpa filter (harus mengembalikan 10 buku default/pertama beserta total count).
  - Mengambil daftar buku dengan parameter `genre` (hanya mengembalikan buku sesuai genre terkait).
  - Mengambil daftar buku menggunakan parameter `limit=5` (mengembalikan maksimal 5 buku).
  - Melakukan paginasi dengan filter `offset` (harus mengembalikan blok data berikutnya secara presisi).
- **Skenario Negatif:**
  - Memasukkan filter `genre` yang tidak eksis di database (harus mengembalikan array kosong `[]`).

**B. `getBookBySlug(slug)`**
- **Skenario Positif:**
  - Mengambil data dengan string `slug` yang valid (harus mengembalikan 1 object spesifik buku utuh).
- **Skenario Negatif:**
  - Menggunakan `slug` yang tidak terdaftar (harus me-lempar/me-return form *Not Found* atau error gracefully tanpa merusak UI halaman).

**C. `createBook(payload)`**
- **Skenario Positif:**
  - Mengirim payload object (title, author, cover, dsb) secara valid (harus berhasil insert ke DB).
- **Skenario Negatif:**
  - Mengirim payload tanpa field yang `required` atau tipe data salah (misal: number dimasukkan huruf). Supabase error tidak boleh menabrak sistem, tapi dikembalikan sebagai pesan error ramah.

**D. `updateBook(id, payload)`**
- **Skenario Positif:**
  - Memodifikasi `title` atau rating dari suatu ID valid (data di DB harus terupdate secara instan).
- **Skenario Negatif:**
  - Mengirim request update dengan `id` buku yang di-random atau tidak ada di DB (harus menolak request dengan status fail).

**E. `deleteBook(id)`**
- **Skenario Positif:**
  - Menghapus buku valid berdasarkan `id` (buku hilang dari DB).
- **Skenario Negatif:**
  - Mencoba double delete pada ID yang sama (memastikan aplikasi tidak freeze/crash).

---

## 2. API: `/api/book-search.get` (Pencarian External)

- **Skenario Positif:**
  - Melakukan parameter `?q=Harry Potter` (API harus langsung mengembalikan array data array buku dari Google Books).
  - Saat Google Books gagal (Error 500) pada request, sistem fallback harus memanggil secara otomatis dari `Open Library API` dan tetap mengembalikan array buku dengan format yang sama tanpa membuat front-end sadar ada error.
- **Skenario Negatif:**
  - Mengirim argument query panjang kurang dari 2 karakter `?q=H` (harus gagal dengan statusCode 400 "Query tidak valid").
  - Menghapus query `?q=` atau membuatnya kosong (harus membuahkan response 400 error yang tertangkap di console user).

---

## 3. API: `useComments` (Komentar User)

**A. `getComments(bookId)`**
- **Skenario Positif:**
  - Mengambil semua komentar untuk sebuah buku valid (mengembalikan susunan list urut waktu terbaru).
- **Skenario Negatif:**
  - ID buku valid tapi belum ada komentar (harus mengembalikan `[]`).

**B. `submitComment(payload)`**
- **Skenario Positif:**
  - Payload dilengkapi dengan _name_ dan _content_ string yang benar (berhasil create record baru yang menempel pada `bookId` target).
- **Skenario Negatif:**
  - Memasukkan komentar dengan field kosong, atau menggunakan spam script HTML di kolom komentar (Pastikan input ter-sanitasi dengan baik).

---

## 4. API: `useRatings` (Penilaian Pengunjung)

**A. `getUserRating(bookId)`**
- **Skenario Positif:**
  - Jika fingerprint user/sesi ini sudah pernah merating buku A (harus mengembalikan nilai score 1-5).
  - Jika belum pernah (harus mengembalikan `null` atau `0`).

**B. `submitRating(bookId, score)`**
- **Skenario Positif:**
  - Submit score baru (1-5) (harus mencatat angka secara real-time untuk buku terkait).
- **Skenario Negatif:**
  - Memaksa score out of bounds, seperti `-2` atau `100` ke endpoint/API rating (harus direject database constraint atau validasi API).
