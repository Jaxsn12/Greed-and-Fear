import { createApp } from '../src/app';

// Vercel's Node.js runtime treats any default export under /api as a serverless
// handler — an Express app is already a valid (req, res) => void function, so we
// can export it directly. No app.listen() here; Vercel invokes this per-request.
export default createApp();
