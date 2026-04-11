import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useBooks } from '../composables/useBooks'

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => mockSupabase),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  contains: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  single: vi.fn(),
}

vi.mock('#imports', () => ({
  useSupabaseClient: () => mockSupabase,
}))

describe('useBooks Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getBooks', () => {
    it('should fetch published books with pagination', async () => {
      const mockBooks = [
        { id: '1', title: 'Book 1', is_published: true },
        { id: '2', title: 'Book 2', is_published: true },
      ]

      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: mockBooks, error: null, count: 2 }),
      })

      const { getBooks } = useBooks()
      const result = await getBooks({ limit: 10, offset: 0 })

      expect(result.data).toEqual(mockBooks)
      expect(result.total).toBe(2)
    })

    it('should filter books by genre', async () => {
      const mockBooks = [
        { id: '1', title: 'Self Help Book', genre: ['self-help'], is_published: true },
      ]

      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        contains: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockBooks, error: null, count: 1 }),
      })

      const { getBooks } = useBooks()
      const result = await getBooks({ genre: 'self-help' })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].genre).toContain('self-help')
    })

    it('should handle empty result gracefully', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [], error: null, count: 0 }),
      })

      const { getBooks } = useBooks()
      const result = await getBooks()

      expect(result.data).toEqual([])
      expect(result.total).toBe(0)
    })

    it('should throw error on database failure', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: null, error: new Error('DB error') }),
      })

      const { getBooks } = useBooks()

      await expect(getBooks()).rejects.toThrow('DB error')
    })
  })

  describe('getBookBySlug', () => {
    it('should fetch single book by slug', async () => {
      const mockBook = { id: '1', title: 'Test Book', slug: 'test-book', is_published: true }

      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockBook, error: null }),
      })

      const { getBookBySlug } = useBooks()
      const result = await getBookBySlug('test-book')

      expect(result).toEqual(mockBook)
    })

    it('should throw error if book not found', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
      })

      const { getBookBySlug } = useBooks()

      await expect(getBookBySlug('nonexistent')).rejects.toThrow('Not found')
    })
  })

  describe('createBook', () => {
    it('should create new book with valid data', async () => {
      const mockBook = {
        title: 'New Book',
        slug: 'new-book',
        author: 'Author',
        is_published: true,
      }

      mockSupabase.from.mockReturnValueOnce({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockBook, error: null }),
      })

      const { createBook } = useBooks()
      const result = await createBook(mockBook)

      expect(result).toEqual(mockBook)
    })

    it('should reject book without required fields', async () => {
      const invalidBook = { title: '' } // Missing required fields

      mockSupabase.from.mockReturnValueOnce({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: new Error('Missing required fields') }),
      })

      const { createBook } = useBooks()

      await expect(createBook(invalidBook as any)).rejects.toThrow('Missing required fields')
    })
  })

  describe('updateBook', () => {
    it('should update existing book', async () => {
      const updatedBook = { id: '1', title: 'Updated Title', slug: 'updated-title' }

      mockSupabase.from.mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedBook, error: null }),
      })

      const { updateBook } = useBooks()
      const result = await updateBook('1', { title: 'Updated Title' })

      expect(result.title).toBe('Updated Title')
    })

    it('should handle update on non-existent book', async () => {
      mockSupabase.from.mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: new Error('Book not found') }),
      })

      const { updateBook } = useBooks()

      await expect(updateBook('999', { title: 'Test' })).rejects.toThrow('Book not found')
    })
  })

  describe('deleteBook', () => {
    it('should delete existing book', async () => {
      mockSupabase.from.mockReturnValueOnce({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      })

      const { deleteBook } = useBooks()

      await expect(deleteBook('1')).resolves.not.toThrow()
    })

    it('should handle delete on non-existent book gracefully', async () => {
      mockSupabase.from.mockReturnValueOnce({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: new Error('Book not found') }),
      })

      const { deleteBook } = useBooks()

      await expect(deleteBook('999')).rejects.toThrow('Book not found')
    })
  })

  describe('getAllGenres', () => {
    it('should return unique sorted genres from all books', async () => {
      const mockBooks = [
        { genre: ['self-help', 'psychology'] },
        { genre: ['self-help', 'productivity'] },
        { genre: ['fiction'] },
      ]

      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockBooks, error: null }),
      })

      const { getAllGenres } = useBooks()
      const result = await getAllGenres()

      expect(result).toEqual(['fiction', 'productivity', 'psychology', 'self-help'])
    })

    it('should handle books with no genres', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [{ genre: [] }, { genre: null }], error: null }),
      })

      const { getAllGenres } = useBooks()
      const result = await getAllGenres()

      expect(result).toEqual([])
    })
  })

  describe('generateSlug', () => {
    it('should generate slug from title', () => {
      const { generateSlug } = useBooks()

      expect(generateSlug('Atomic Habits')).toBe('atomic-habits')
      expect(generateSlug('The 7 Habits')).toBe('the-7-habits')
      expect(generateSlug('Special   Spaces')).toBe('special-spaces')
      expect(generateSlug('With-Dashes')).toBe('with-dashes')
    })

    it('should handle empty title', () => {
      const { generateSlug } = useBooks()

      expect(generateSlug('')).toBe('')
    })
  })
})
