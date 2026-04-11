import { z } from "zod";
import type { GoogleBook, BookSearchResult } from "~/types";

const querySchema = z.object({
  q: z.string().min(2).max(100),
});

export default defineEventHandler(async (event) => {
  // Validasi query parameter
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
    // Fetch ke Google Books API
    // API key opsional untuk development, wajib untuk production
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = apiKey ? `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=8&key=${apiKey}` : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=8`;

    const response = await fetch(url);
    if (!response.ok) {
      // Treat non-2xx as error so we fall back to Open Library
      throw new Error(`Google Books request failed with status ${response.status}`);
    }
    const data = await response.json();

    if (!data.items) return [];

    // Transform data ke format yang kita butuhkan
    const results: BookSearchResult[] = data.items.map((item: GoogleBook) => {
      const info = item.volumeInfo;
      const isbn = info.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier || null;

      const publishedYear = info.publishedDate ? parseInt(info.publishedDate.split("-")[0]) : null;

      return {
        title: info.title || "",
        author: (info.authors || []).join(", ") || "Tidak diketahui",
        cover_url: info.imageLinks?.thumbnail?.replace("http:", "https:") || null,
        description: info.description || null,
        isbn,
        pages: info.pageCount || null,
        published_year: publishedYear,
        genre: info.categories || [],
      };
    });

    return results;
  } catch (error) {
    // Fallback ke Open Library jika Google Books gagal
    const olUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(searchQuery)}&limit=5&fields=title,author_name,first_publish_year,isbn,cover_i,number_of_pages_median`;
    const olResponse = await fetch(olUrl);
    const olData = await olResponse.json();

    if (!olData.docs) return [];

    return olData.docs.map(
      (book: any): BookSearchResult => ({
        title: book.title || "",
        author: (book.author_name || []).join(", ") || "Tidak diketahui",
        cover_url: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : null,
        description: null,
        isbn: book.isbn?.[0] || null,
        pages: book.number_of_pages_median || null,
        published_year: book.first_publish_year || null,
        genre: [],
      }),
    );
  }
});
