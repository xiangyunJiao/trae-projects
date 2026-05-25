const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'mock', 'data.json');

function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function calculatePrizeByProbability(prizes) {
  const totalProb = prizes.reduce((sum, p) => sum + p.probability, 0);
  let random = Math.random() * totalProb;
  for (const prize of prizes) {
    random -= prize.probability;
    if (random <= 0) {
      return prize;
    }
  }
  return prizes[prizes.length - 1];
}

app.get('/api/activity/config', (req, res) => {
  const data = readData();
  res.json(data.activity);
});

app.get('/api/admin/activity/config', (req, res) => {
  const data = readData();
  res.json(data.activity);
});

app.post('/api/admin/activity/config', (req, res) => {
  const data = readData();
  data.activity = req.body;
  writeData(data);
  res.json(true);
});

app.post('/api/activity/draw', (req, res) => {
  const { count } = req.body;
  const data = readData();
  const prizes = data.activity.lotteryConfig.prizes;
  const results = [];
  for (let i = 0; i < count; i++) {
    const prize = calculatePrizeByProbability(prizes);
    results.push({ prize, index: prize.index });
  }
  res.json(results);
});

app.get('/api/activity/ranking', (req, res) => {
  const { type } = req.query;
  const data = readData();
  res.json(data.activity.rankingConfig);
});

app.get('/api/admin/activity/ranking', (req, res) => {
  const { type } = req.query;
  const data = readData();
  res.json(data.activity.rankingConfig);
});

app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});
