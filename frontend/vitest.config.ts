import { resolve } from 'path';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: [
        {
          find: /^konva$/,
          replacement: resolve(__dirname, './node_modules/konva/lib/index.js'),
        },
      ],
    },
    test: {
      environment: 'jsdom',
      globals: false,
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
      server: {
        deps: {
          inline: ['konva', 'react-konva'],
        },
      },
    },
  }),
);
