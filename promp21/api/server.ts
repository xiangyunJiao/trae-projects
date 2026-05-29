import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

interface UserData {
  userId: string;
  points: number;
  lastUpdated: string;
}

const userDatabase: Record<string, UserData> = {
  'user_001': {
    userId: 'user_001',
    points: 2300,
    lastUpdated: new Date().toISOString()
  }
};

app.get('/api/user/points', (req, res) => {
  const userId = (req.query.userId as string) || 'user_001';
  
  const userData = userDatabase[userId];
  
  if (userData) {
    res.json({
      success: true,
      data: {
        userId: userData.userId,
        points: userData.points,
        lastUpdated: userData.lastUpdated
      }
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
});

app.post('/api/user/points', (req, res) => {
  const userId = req.body.userId || 'user_001';
  const points = parseInt(req.body.points, 10);
  
  if (isNaN(points) || points < 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid points value'
    });
  }
  
  if (!userDatabase[userId]) {
    userDatabase[userId] = {
      userId,
      points: 0,
      lastUpdated: new Date().toISOString()
    };
  }
  
  userDatabase[userId].points = points;
  userDatabase[userId].lastUpdated = new Date().toISOString();
  
  res.json({
    success: true,
    data: {
      userId: userDatabase[userId].userId,
      points: userDatabase[userId].points,
      lastUpdated: userDatabase[userId].lastUpdated
    }
  });
});

app.get('/api/locations', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 0, name: '起点站', points: 0 },
      { id: 1, name: '上海', points: 1000 },
      { id: 2, name: '东京', points: 2000 },
      { id: 3, name: '巴黎', points: 3000 },
      { id: 4, name: '纽约', points: 4000 },
      { id: 5, name: '悉尼', points: 5000 },
      { id: 6, name: '终点站', points: 6000 }
    ]
  });
});

app.get('/api/rewards', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', name: '50元优惠券' },
      { id: '2', name: '精美行李箱' },
      { id: '3', name: '机票抵扣券' },
      { id: '4', name: '旅行背包' },
      { id: '5', name: '酒店住宿券' },
      { id: '6', name: '神秘大礼包' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
