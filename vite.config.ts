import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  // Populate process.env for server-side handlers (all synthesis providers)
  const handlerEnvVars = [
    'GEMINI_API_KEY', 'API_KEY',
    'GOOGLE_CLOUD_PROJECT', 'GOOGLE_CLOUD_LOCATION', 'GOOGLE_APPLICATION_CREDENTIALS',
    'OPENAI_BASE_URL', 'OPENAI_API_KEY', 'OPENAI_MODEL',
    'OLLAMA_BASE_URL', 'OLLAMA_MODEL',
  ];
  for (const key of handlerEnvVars) {
    process.env[key] = process.env[key] || env[key] || '';
  }

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      {
        name: 'gemini-api-dev-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/convert-repo' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const { files, nameHint } = JSON.parse(body || '{}');
                  if (!files || !Array.isArray(files) || files.length === 0) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'No files provided for analysis.' }));
                    return;
                  }

                  const { generateMVPAnalysis } = await import('./server/geminiHandler.ts');
                  const result = await generateMVPAnalysis(files, nameHint);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(result));
                } catch (error: any) {
                  console.error('[Vite Dev API /api/convert-repo Error]:', error);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: error?.message || 'Failed to synthesize repository with Gemini API.' }));
                }
              });
              return;
            }

            if (req.url === '/api/health' && req.method === 'GET') {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ status: 'ok', mode: 'development' }));
              return;
            }

            next();
          });
        },
      },
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
