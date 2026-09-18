# Project checklist

- MERN-style architecture: Express + React/Vite + Node.js
- MongoDB: removed completely
- Mongoose: removed completely
- Database connection/config/models: removed completely
- Persistence: process-memory only
- 20 distinct market-data API methods/routes retained
- 30+ runtime dependencies retained (41)
- 15+ devDependencies retained (15)
- Paper trading only
- Top-20 ranking fetched dynamically

- OpenAI server-side key pool: OPENAI_API_KEY_1..OPENAI_API_KEY_10 with round-robin selection and single-key fallback.
