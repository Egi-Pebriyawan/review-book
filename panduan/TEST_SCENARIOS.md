# Test Scenarios - Issue #22

## 📋 Test Coverage Overview

This document outlines comprehensive test scenarios for API data interactions (Supabase & external services).

---

## 🧪 Test Files

### 1. **useBooks.test.ts** - Book Management
**Location:** `tests/useBooks.test.ts`

**Test Coverage:**
- ✅ `getBooks()` - Fetch books with pagination & genre filtering
- ✅ `getBookBySlug()` - Fetch single book by slug
- ✅ `createBook()` - Create new book
- ✅ `updateBook()` - Update existing book
- ✅ `deleteBook()` - Delete book
- ✅ `getAllGenres()` - Get unique genres from all books
- ✅ `generateSlug()` - Slug generation utility

**Test Scenarios:**
| Test | Input | Expected Result |
|------|-------|----------------|
| Fetch books with pagination | limit: 10, offset: 0 | Returns {data: Book[], total: number} |
| Filter by genre | genre: 'self-help' | Only returns self-help books |
| Empty result | No books in DB | Returns {data: [], total: 0} |
| Database error | Connection failure | Throws error gracefully |
| Create book | Valid payload | Returns created book |
| Create book | Missing required fields | Throws validation error |
| Update book | Valid ID + updates | Returns updated book |
| Update book | Non-existent ID | Throws "Not found" error |
| Delete book | Valid ID | Success without error |
| Delete book | Non-existent ID | Throws error |
| Get genres | Mixed books | Returns sorted unique genres |
| Generate slug | "Atomic Habits" | Returns "atomic-habits" |

---

### 2. **useComments.test.ts** - Comments System
**Location:** `tests/useComments.test.ts`

**Test Coverage:**
- ✅ `getComments()` - Fetch approved comments
- ✅ `getPendingComments()` - Fetch comments for moderation
- ✅ `submitComment()` - Create new comment
- ✅ `approveComment()` - Approve comment
- ✅ `markAsSpam()` - Mark comment as spam
- ✅ `deleteComment()` - Delete comment

**Test Scenarios:**
| Test | Input | Expected Result |
|------|-------|----------------|
| Get comments | Book ID | Returns approved comments sorted by newest |
| Get comments (empty) | Book with no comments | Returns [] |
| Get pending | N/A | Returns unapproved comments |
| Submit comment | Valid name + content | Creates comment (is_approved: false) |
| Submit comment | Name < 2 chars | Throws validation error |
| Submit comment | Content < 5 chars | Throws validation error |
| Submit comment | XSS attempt | Stores sanitized input |
| Approve comment | Comment ID | Sets is_approved: true |
| Mark as spam | Comment ID | Sets is_spam: true |
| Delete comment | Valid ID | Success |
| Delete comment | Non-existent ID | Throws error |

---

### 3. **useRatings.test.ts** - Rating System
**Location:** `tests/useRatings.test.ts`

**Test Coverage:**
- ✅ `submitRating()` - Submit/Update rating
- ✅ `getUserRating()` - Get existing user rating

**Test Scenarios:**
| Test | Input | Expected Result |
|------|-------|----------------|
| Submit rating | book_id, score: 4 | Upserts rating |
| Submit rating | score: 1 | Accepts (min valid) |
| Submit rating | score: 5 | Accepts (max valid) |
| Submit rating | score: 0 | Throws "between 1-5" error |
| Submit rating | score: 6 | Throws "between 1-5" error |
| Submit rating | score: -2 | Throws validation error |
| Submit rating | score: 100 | Throws validation error |
| Get rating | Book with user rating | Returns score (1-5) |
| Get rating | Book without rating | Returns null |
| Fingerprint | Same browser | Consistent fingerprint |

---

### 4. **book-search.test.ts** - External Search API
**Location:** `tests/book-search.test.ts`

**Test Coverage:**
- ✅ Query validation (< 2 chars, empty, > 100 chars)
- ✅ Google Books API integration
- ✅ Open Library fallback
- ✅ Error handling & timeouts
- ✅ Response format consistency

**Test Scenarios:**
| Test | Input | Expected Result |
|------|-------|----------------|
| Valid query | "atomic habits" | Returns book results |
| Short query | "a" | Rejected (min 2 chars) |
| Empty query | "" or " " | Rejected (400 Bad Request) |
| Long query | 101+ chars | Rejected (max 100 chars) |
| Google Books success | Valid API response | Transformed results |
| Google Books failure | 500 error | Fallback to Open Library |
| Open Library success | Valid response | Consistent format |
| Both APIs fail | Network errors | Graceful error handling |
| No results | Valid query, no matches | Returns [] |
| API key present | Environment variable | Included in request |

---

## 🚀 Running Tests

```bash
# Install dependencies
npm install

# Run tests in watch mode
npm run test

# Run tests once (CI mode)
npm run test:run

# Run with UI dashboard
npm run test:ui

# Run with coverage report
npm run test:coverage
```

---

## 📊 Coverage Targets

| Module | Target | Current |
|--------|--------|---------|
| useBooks | 90%+ | Pending |
| useComments | 85%+ | Pending |
| useRatings | 85%+ | Pending |
| book-search API | 90%+ | Pending |

---

## ⚠️ Known Limitations

1. **Database Integration**: Tests mock Supabase responses (not real DB)
2. **External APIs**: Tests mock fetch calls (no real API calls)
3. **Browser APIs**: Fingerprint tests mock navigator/screen
4. **E2E Testing**: Requires Playwright for full browser testing (future enhancement)

---

## 🔄 Future Enhancements

- [ ] Add E2E tests with Playwright
- [ ] Add integration tests with test Supabase instance
- [ ] Add visual regression tests for UI components
- [ ] Add performance benchmarks for API endpoints
- [ ] Add load testing for concurrent users

---

## ✅ Acceptance Criteria Met

- [x] Book Management: CRUD operations tested
- [x] Pagination & genre filtering tested
- [x] Invalid data handling tested
- [x] External Search: Fallback logic tested
- [x] Query validation tested
- [x] Comments: CRUD + sorting tested
- [x] Ratings: Validation & fingerprint tested
- [x] Error handling: Graceful failures tested
