import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock node canvas required by konva under jsdom
vi.mock('canvas', () => {
  return {
    createCanvas: () => {
      const canvas = document.createElement('canvas');
      return canvas;
    },
    Image: window.Image,
  };
});

// Polyfill 2D canvas context for JSDOM
if (typeof HTMLCanvasElement !== 'undefined') {
  const dummyFn = vi.fn();
  const contextMock = new Proxy(
    {
      measureText: vi.fn().mockReturnValue({ width: 0 }),
      canvas: document.createElement('canvas'),
    },
    {
      get: (target, prop) => {
        if (prop in target) return (target as any)[prop];
        return dummyFn;
      },
    },
  );
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(contextMock) as any;
}

afterEach(() => {
  cleanup();
});
