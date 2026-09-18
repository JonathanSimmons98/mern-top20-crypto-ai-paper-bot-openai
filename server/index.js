import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import api from './routes/api.js';
import { runBot } from './services/bot.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(helmet());
app.use(cors({ origin: config.clientOrigin }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(pinoHttp());
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

app.use('/api', api);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});


if (config.botIntervalMs > 0) {
  setInterval(() => runBot().catch((e) => console.error('bot cycle failed', e.message)), config.botIntervalMs);
}

app.listen(config.port, () => console.log(`API listening on http://localhost:${config.port}`));
