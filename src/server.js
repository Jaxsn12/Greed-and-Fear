const path = require("path");
const express = require("express");
const { PORT } = require("./config");
const { runIndicator } = require("./runIndicator");
const { readHistory, readLatest } = require("./store");
const { startScheduler } = require("./scheduler");

const app = express();
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/latest", (req, res) => {
  res.json(readLatest());
});

app.get("/api/history", (req, res) => {
  const limit = Number(req.query.limit) || 60;
  res.json(readHistory(limit));
});

app.post("/api/run-now", async (req, res) => {
  try {
    const run = await runIndicator();
    res.json(run);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Market indicator dashboard running at http://localhost:${PORT}`);
  startScheduler();
});
