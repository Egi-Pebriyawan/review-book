import type { Database } from "./database.types";

// Shortcut types yang akan sering dipakai di seluruh project
export type Book = Database["public"]["Tables"]["books"]["Row"];
export type BookInsert = Database["public"]["Tables"]["books"]["Insert"];
export type BookUpdate = Database["public"]["Tables"]["books"]["Update"];

export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type CommentInsert = Database["public"]["Tables"]["comments"]["Insert"];

export type Rating = Database["public"]["Tables"]["ratings"]["Row"];
export type RatingInsert = Database["public"]["Tables"]["ratings"]["Insert"];

export type Profile = Database["public"]["Tables"]["profile"]["Row"];

// Type untuk hasil search Google Books API
export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: Array<{ type: string; identifier: string }>;
    pageCount?: number;
    publishedDate?: string;
    categories?: string[];
    language?: string;
  };
}

export interface BookSearchResult {
  title: string;
  author: string;
  cover_url: string | null;
  description: string | null;
  isbn: string | null;
  pages: number | null;
  published_year: number | null;
  genre: string[];
}
