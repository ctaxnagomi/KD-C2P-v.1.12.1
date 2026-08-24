import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateMVPAnalysis } from './server/geminiHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Server-side Gemini API Route
app.post('/api/convert-repo', async (req, res) => {
  try {
    const { files, nameHint } = req.body;
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'No files provided for analysis.' });
    }

    console.log(`[API] Starting repo synthesis with ${files.length} files...`);
    const mvpData = await generateMVPAnalysis(files, nameHint);
    console.log(`[API] Synthesis completed successfully for: ${mvpData.projectName}`);
    return res.json(mvpData);
  } catch (error: any) {
    console.error('[API Error in /api/convert-repo]:', error);
    const errorMessage = error?.message || 'Failed to synthesize repository with Gemini API.';
    return res.status(500).json({ error: errorMessage });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// In production, serve Vite built client
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
