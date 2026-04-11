import { z } from "zod";
import type { GoogleBook, BookSearchResult } from "~/types";

/**
 * Zod Payload Validator: 
 * Mengamankan agar tipe data parameter `q` API hanyalah serangkaian karakter yang valid (2 hingga max 100 karakter),
 * Hal ini adalah standard keamanan terhadap SQL/NoSQL Injection pada level API.
 */
const querySchema = z.object({
  q: z.string().min(2).max(100),
});

/**
 * Nuxt Nitro Endpoint (`/api/book-search`)
 * Action Backend Server: Melayani pencarian metadata perpustakaan ke dunia luar.
 */
export default defineEventHandler(async (event) => {
  // 1. Ekstraksi dan Validasi objek parameter yang masuk lewat endpoint URL `?q=xxx`
  const query = getQuery(event);
  const parsed = querySchema.safeParse(query);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Query tidak valid. Minimal 2 karakter.",
    });
  }

  const searchQuery = parsed.data.q;

  try {
    // 2. PRIMARY REQUEST: Fetch metadata buku gratis (non-auth)/Auth key ke Google Books API.
    // Menarik Environment Variables jika disetting oleh DevOps di VPS (.env / Vercel secrets)
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    // URL dibentuk secara dinamis (ada limit query maksimum = 8)
    const url = apiKey ? `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=8&key=${apiKey}` : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=8`;

    const response = await fetch(url);
    if (!response.ok) {
      // Jika Google Books mati/keblokir/out of limits, treat ini sebagai fail untuk meloncat ke catch block.
      throw new Error(`Google Books request failed with status ${response.status}`);
    }
    const data = await response.json();

    if (!data.items) return [];

    // 3. TRANSFORM (Formatting Data)
    // Map Array data mentahan Google Book ke kerangka Interface internal aplikasi (BookSearchResult).
    const results: BookSearchResult[] = data.items.map((item: GoogleBook) => {
      const info = item.volumeInfo;
      // Menyisipkan mekanisme untuk mencubit (extract) nomor ISBN standar tipe ke-13 yang akurat.
      const isbn = info.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier || null;
      // Menarik karakter strip depan sebagai Tahun murni (Ex. '1998-05-15' -> 1998)
      const publishedYear = info.publishedDate ? parseInt(info.publishedDate.split("-")[0]) : null;

      return {
        title: info.title || "",
        author: (info.authors || []).join(", ") || "Tidak diketahui", // Memisahkan array penulis menjadi string tunggal koma
        cover_url: info.imageLinks?.thumbnail?.replace("http:", "https:") || null, // Memaksa migrasi standar HTTP ke HTTPS untuk keamanan browser (SSL warning fix)
        description: info.description || null,
        isbn,
        pages: info.pageCount || null,
        published_year: publishedYear,
        genre: info.categories || [],
      };
    });

    return results; // Kirimkan balasan JSON Primary Route.
  } catch (error) {
    // ==== 4. FALLBACK STRATEGY ==== 
    // Bagian eksekusi darurat ketika Google Books mengalami masalah/Failure (Circuit Breaker logic).
    // Melakukan switch koneksi ke API `Open Library` secara fallback background.

    const olUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(searchQuery)}&limit=5&fields=title,author_name,first_publish_year,isbn,cover_i,number_of_pages_median`;
    const olResponse = await fetch(olUrl);
    const olData = await olResponse.json();

    if (!olData.docs) return [];

    // Translate/Map response OpenLibrary ke format interface BookSearchResult Internal juga 
    // agar Front-end tidak mengetahui error API primer dan app terasa seolah tidak pernah drop.
    return olData.docs.map(
      (book: any): BookSearchResult => ({
        title: book.title || "",
        author: (book.author_name || []).join(", ") || "Tidak diketahui",
        cover_url: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : null, // Membangkitkan URL Cover yang terenkripsi
        description: null, // Sayangnya Open Library ringan tidak memiliki description pada endpoint dasar ini.
        isbn: book.isbn?.[0] || null,
        pages: book.number_of_pages_median || null,
        published_year: book.first_publish_year || null,
        genre: [],
      }),
    );
  }
});
