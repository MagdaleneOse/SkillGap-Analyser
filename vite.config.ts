import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('recharts')) return 'charts';
          if (id.includes('pdfjs-dist')) return 'pdf';
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('mammoth')) return 'docx';
          if (id.includes('react-dom')) return 'react-vendor';
          if (id.includes('/react/')) return 'react-vendor';

          return 'vendor';
        },
      },
    },
  },
});