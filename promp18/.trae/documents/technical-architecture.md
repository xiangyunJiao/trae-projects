## 1. 架构设计
```mermaid
graph TD
    A["H5赛马游戏"] --> B["React + TypeScript + Vite"]
    B --> C["动画层 (CSS + Canvas)"]
    B --> D["状态管理 (React Hooks)"]
    B --> E["音效系统 (Web Audio API)"]
    C --> C1["马匹骨骼动画 (CSS keyframes)"]
    C --> C2["跑道视差滚动"]
    C --> C3["金币飞入动画"]
    C --> C4["彩带粒子效果"]
    D --> D1["游戏状态机"]
    D --> D2["押注状态"]
    D --> D3["金币数据"]
    E --> E1["开始音效"]
    E --> E2["胜利音效"]
    E --> E3["失败音效"]
```

## 2. 技术描述
- **前端框架**: React@18 + TypeScript + Vite@5
- **样式方案**: TailwindCSS@3 + CSS Modules
- **动画方案**: CSS Keyframes + Canvas API
- **状态管理**: React Hooks (useState, useReducer, useEffect)
- **音效方案**: Web Audio API + 内置音频文件
- **构建工具**: Vite

## 3. 路由定义
| 路由 | 用途 |
|------|------|
| / | 赛马游戏主页面 |

## 4. 核心组件结构
```
src/
├── components/
│   ├── RaceTrack/          # 赛马跑道组件
│   │   ├── Horse.tsx       # 马匹组件（骨骼动画）
│   │   ├── Track.tsx       # 跑道组件
│   │   └── FinishLine.tsx  # 终点线
│   ├── BetModal/           # 押注弹窗
│   │   └── index.tsx
│   ├── ResultModal/        # 结果弹窗
│   │   └── index.tsx
│   ├── CoinRain/           # 金币飞入动画
│   │   └── index.tsx
│   ├── Confetti/           # 彩带效果
│   │   └── index.tsx
│   └── BetButton/          # 押注入口按钮
│       └── index.tsx
├── hooks/
│   ├── useGameState.ts     # 游戏状态管理
│   ├── useAudio.ts         # 音效hook
│   └── useCountdown.ts     # 倒计时hook
├── types/
│   └── index.ts            # 类型定义
├── utils/
│   └── audio.ts            # 音效工具
├── App.tsx
└── main.tsx
```

## 5. 游戏状态机
```mermaid
stateDiagram-v2
    [*] --> IDLE
    IDLE --> COUNTDOWN: 开始新一局
    COUNTDOWN --> RACING: 倒计时结束
    RACING --> FINISHED: 30秒结束
    FINISHED --> SETTLEMENT: 显示结果
    SETTLEMENT --> WAITING: 关闭弹窗
    WAITING --> COUNTDOWN: 1分钟后
```

## 6. 数据模型
### 6.1 类型定义
```typescript
// 马匹类型
interface Horse {
  id: number;
  name: string;
  color: 'white' | 'brown' | 'black';
  position: number;  // 0-100 百分比
  speed: number;     // 当前速度
}

// 押注信息
interface Bet {
  horseId: number;
  amount: number;
}

// 游戏状态
type GamePhase = 'idle' | 'countdown' | 'racing' | 'finished' | 'settlement';
```
