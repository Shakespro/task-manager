import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  test: { environment: 'jsdom', include: ['tests/**/*.test.jsx'] },
  plugins: [{
    name: 'jsx-context-files',
    async transform(code, id) {
      if (id.includes('/context/') && id.endsWith('.js')) {
        const { transformWithEsbuild } = await import('vite');
        return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
      }
    },
  }],
});
