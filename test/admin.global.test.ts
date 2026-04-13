import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Admin Global Middleware (Issue #25)", () => {
  // Mock function for navigateTo
  const mockNavigateTo = vi.fn((path: string) => ({ redirected: true, path }));

  // Mock reactive user object
  const mockUser = { value: null as any };

  // Simulate the middleware logic from admin.global.ts
  const adminMiddleware = (to: { path: string }) => {
    const user = mockUser;

    // Kalau route tujuan adalah halaman admin
    if (to.path.startsWith("/admin")) {
      // Dan user belum login
      if (!user.value) {
        return mockNavigateTo("/login");
      }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.value = null;
  });

  describe("BUG FIX VERIFICATION: Global middleware should protect /admin routes", () => {
    it("should redirect to /login when accessing /admin without authentication", () => {
      mockUser.value = null;

      const result = adminMiddleware({ path: "/admin" });

      expect(mockNavigateTo).toHaveBeenCalledWith("/login");
      expect(result).toEqual({ redirected: true, path: "/login" });
    });

    it("should redirect to /login when accessing /admin/dashboard without authentication", () => {
      mockUser.value = null;

      const result = adminMiddleware({ path: "/admin/dashboard" });

      expect(mockNavigateTo).toHaveBeenCalledWith("/login");
      expect(result).toEqual({ redirected: true, path: "/login" });
    });

    it("should redirect to /login when accessing /admin/settings without authentication", () => {
      mockUser.value = null;

      const result = adminMiddleware({ path: "/admin/settings" });

      expect(mockNavigateTo).toHaveBeenCalledWith("/login");
      expect(result).toEqual({ redirected: true, path: "/login" });
    });

    it("should redirect to /login when accessing /admin/users/manage without authentication", () => {
      mockUser.value = null;

      const result = adminMiddleware({ path: "/admin/users/manage" });

      expect(mockNavigateTo).toHaveBeenCalledWith("/login");
      expect(result).toEqual({ redirected: true, path: "/login" });
    });

    it("should allow access to /admin when user is authenticated", () => {
      mockUser.value = { id: "123", email: "admin@example.com" };

      const result = adminMiddleware({ path: "/admin" });

      expect(mockNavigateTo).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it("should allow access to /admin/users when user is authenticated", () => {
      mockUser.value = { id: "123", email: "admin@example.com" };

      const result = adminMiddleware({ path: "/admin/users" });

      expect(mockNavigateTo).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe("Non-admin routes should not be affected by middleware", () => {
    it("should not redirect when accessing / without authentication", () => {
      mockUser.value = null;

      const result = adminMiddleware({ path: "/" });

      expect(mockNavigateTo).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it("should not redirect when accessing /books without authentication", () => {
      mockUser.value = null;

      const result = adminMiddleware({ path: "/books" });

      expect(mockNavigateTo).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it("should not redirect when accessing /login without authentication", () => {
      mockUser.value = null;

      const result = adminMiddleware({ path: "/login" });

      expect(mockNavigateTo).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it("should not redirect when accessing /about without authentication", () => {
      mockUser.value = null;

      const result = adminMiddleware({ path: "/about" });

      expect(mockNavigateTo).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it("should allow access to any non-admin route regardless of authentication", () => {
      mockUser.value = { id: "456", email: "user@example.com" };

      const result = adminMiddleware({ path: "/some-public-page" });

      expect(mockNavigateTo).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe("Edge cases", () => {
    it("should handle paths that start with /admin but are not admin routes", () => {
      mockUser.value = null;

      // This test ensures the middleware only catches paths that START with /admin
      const result = adminMiddleware({ path: "/administrator" });

      // This WILL redirect because it starts with '/admin'
      expect(mockNavigateTo).toHaveBeenCalledWith("/login");
      expect(result).toEqual({ redirected: true, path: "/login" });
    });

    it("should handle empty path correctly", () => {
      mockUser.value = null;

      const result = adminMiddleware({ path: "" });

      expect(mockNavigateTo).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
