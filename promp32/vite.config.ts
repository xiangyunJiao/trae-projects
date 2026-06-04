import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';

function allowedHostsPlugin(): Plugin {
  return {
    name: 'allowed-hosts',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const host = req.headers.host;
        if (host && host.includes('trycloudflare.com')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }), 
    tsconfigPaths(),
    allowedHostsPlugin(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true as const,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
