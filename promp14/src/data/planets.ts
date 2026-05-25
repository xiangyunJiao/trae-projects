export interface Planet {
  name: string;
  nameCn: string;
  radius: number;
  distance: number;
  color: string;
  orbitalPeriod: number;
  description: string;
}

export const planets: Planet[] = [
  {
    name: 'Sun',
    nameCn: '太阳',
    radius: 8,
    distance: 0,
    color: '#FDB813',
    orbitalPeriod: 0,
    description: '太阳系中心天体，占太阳系总质量的99.86%'
  },
  {
    name: 'Mercury',
    nameCn: '水星',
    radius: 0.38,
    distance: 15,
    color: '#B5B5B5',
    orbitalPeriod: 88,
    description: '太阳系最小行星，距太阳最近'
  },
  {
    name: 'Venus',
    nameCn: '金星',
    radius: 0.95,
    distance: 22,
    color: '#E6C229',
    orbitalPeriod: 225,
    description: '太阳系最热行星，大气压是地球的92倍'
  },
  {
    name: 'Earth',
    nameCn: '地球',
    radius: 1,
    distance: 30,
    color: '#6B93D6',
    orbitalPeriod: 365,
    description: '我们的家园，已知唯一有生命的行星'
  },
  {
    name: 'Mars',
    nameCn: '火星',
    radius: 0.53,
    distance: 38,
    color: '#C1440E',
    orbitalPeriod: 687,
    description: '红色星球，太阳系最高山奥林帕斯山所在地'
  },
  {
    name: 'Jupiter',
    nameCn: '木星',
    radius: 11.2,
    distance: 55,
    color: '#D8CA9D',
    orbitalPeriod: 4333,
    description: '太阳系最大行星，大红斑是持续数百年的风暴'
  },
  {
    name: 'Saturn',
    nameCn: '土星',
    radius: 9.45,
    distance: 70,
    color: '#F4D59E',
    orbitalPeriod: 10759,
    description: '以壮观的环系统闻名，密度比水还低'
  },
  {
    name: 'Uranus',
    nameCn: '天王星',
    radius: 4,
    distance: 85,
    color: '#D1E7E7',
    orbitalPeriod: 30687,
    description: '侧躺旋转的冰巨星，轴倾角约98度'
  },
  {
    name: 'Neptune',
    nameCn: '海王星',
    radius: 3.88,
    distance: 100,
    color: '#5B5DDF',
    orbitalPeriod: 60190,
    description: '太阳系最远行星，风速可达2100公里/小时'
  }
];

export const moon = {
  name: 'Moon',
  nameCn: '月球',
  radius: 0.27,
  distance: 3,
  color: '#C4C4C4',
  orbitalPeriod: 27,
  description: '地球唯一的天然卫星，直径约3474公里'
};
