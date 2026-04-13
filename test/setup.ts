import { vi } from 'vitest';

// Mock Nuxt global functions
global.defineNuxtRouteMiddleware = (fn: any) => fn;
global.useSupabaseUser = vi.fn(() => ({ value: null }));
global.navigateTo = vi.fn((path: string) => ({ redirected: true, path }));
