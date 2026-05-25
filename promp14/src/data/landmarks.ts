export interface Landmark {
  id: string;
  name: string;
  nameEn: string;
  type: 'city' | 'mountain' | 'ocean' | 'landmark' | 'country';
  latitude: number;
  longitude: number;
  description: string;
  altitude?: number;
  icon?: string;
}

export const landmarks: Landmark[] = [
  {
    id: 'beijing',
    name: '北京',
    nameEn: 'Beijing',
    type: 'city',
    latitude: 39.9042,
    longitude: 116.4074,
    description: '中国首都，历史文化名城，拥有故宫、长城等世界著名地标',
    icon: '🏛️'
  },
  {
    id: 'shanghai',
    name: '上海',
    nameEn: 'Shanghai',
    type: 'city',
    latitude: 31.2304,
    longitude: 121.4737,
    description: '中国最大城市，国际金融中心，东方明珠所在地',
    icon: '🌆'
  },
  {
    id: 'guangzhou',
    name: '广州',
    nameEn: 'Guangzhou',
    type: 'city',
    latitude: 23.1291,
    longitude: 113.2644,
    description: '中国南部重要城市，珠江三角洲中心',
    icon: '🌴'
  },
  {
    id: 'shenzhen',
    name: '深圳',
    nameEn: 'Shenzhen',
    type: 'city',
    latitude: 22.5431,
    longitude: 114.0579,
    description: '中国经济特区，科技创新中心',
    icon: '🏙️'
  },
  {
    id: 'chengdu',
    name: '成都',
    nameEn: 'Chengdu',
    type: 'city',
    latitude: 30.5728,
    longitude: 104.0668,
    description: '四川省会，熊猫故乡，休闲美食之都',
    icon: '🐼'
  },
  {
    id: 'xian',
    name: '西安',
    nameEn: "Xi'an",
    type: 'city',
    latitude: 34.3416,
    longitude: 108.9398,
    description: '千年古都，兵马俑所在地，丝绸之路起点',
    icon: '🏺'
  },
  {
    id: 'great-wall',
    name: '长城',
    nameEn: 'Great Wall',
    type: 'landmark',
    latitude: 40.4319,
    longitude: 116.5704,
    description: '世界七大奇迹之一，中国古代军事防御工程',
    icon: '🧱'
  },
  {
    id: 'new-york',
    name: '纽约',
    nameEn: 'New York',
    type: 'city',
    latitude: 40.7128,
    longitude: -74.0060,
    description: '美国最大城市，世界金融中心，自由女神像所在地',
    icon: '🗽'
  },
  {
    id: 'los-angeles',
    name: '洛杉矶',
    nameEn: 'Los Angeles',
    type: 'city',
    latitude: 34.0522,
    longitude: -118.2437,
    description: '美国第二大城市，好莱坞所在地',
    icon: '🎬'
  },
  {
    id: 'chicago',
    name: '芝加哥',
    nameEn: 'Chicago',
    type: 'city',
    latitude: 41.8781,
    longitude: -87.6298,
    description: '美国第三大城市，风城，摩天大楼发源地',
    icon: '🏙️'
  },
  {
    id: 'washington',
    name: '华盛顿',
    nameEn: 'Washington D.C.',
    type: 'city',
    latitude: 38.9072,
    longitude: -77.0369,
    description: '美国首都，白宫、国会大厦所在地',
    icon: '🏛️'
  },
  {
    id: 'san-francisco',
    name: '旧金山',
    nameEn: 'San Francisco',
    type: 'city',
    latitude: 37.7749,
    longitude: -122.4194,
    description: '美国西海岸城市，硅谷所在地，金门大桥',
    icon: '🌉'
  },
  {
    id: 'statue-of-liberty',
    name: '自由女神像',
    nameEn: 'Statue of Liberty',
    type: 'landmark',
    latitude: 40.6892,
    longitude: -74.0445,
    description: '美国象征，法国赠予美国的礼物，位于自由岛',
    icon: '🗽'
  },
  {
    id: 'london',
    name: '伦敦',
    nameEn: 'London',
    type: 'city',
    latitude: 51.5074,
    longitude: -0.1278,
    description: '英国首都，大本钟、伦敦塔桥所在地',
    icon: '🎡'
  },
  {
    id: 'paris',
    name: '巴黎',
    nameEn: 'Paris',
    type: 'city',
    latitude: 48.8566,
    longitude: 2.3522,
    description: '法国首都，埃菲尔铁塔、卢浮宫所在地',
    icon: '🗼'
  },
  {
    id: 'berlin',
    name: '柏林',
    nameEn: 'Berlin',
    type: 'city',
    latitude: 52.5200,
    longitude: 13.4050,
    description: '德国首都，勃兰登堡门所在地',
    icon: '🏛️'
  },
  {
    id: 'rome',
    name: '罗马',
    nameEn: 'Rome',
    type: 'city',
    latitude: 41.9028,
    longitude: 12.4964,
    description: '意大利首都，永恒之城，斗兽场所在地',
    icon: '🏛️'
  },
  {
    id: 'madrid',
    name: '马德里',
    nameEn: 'Madrid',
    type: 'city',
    latitude: 40.4168,
    longitude: -3.7038,
    description: '西班牙首都，欧洲著名旅游城市',
    icon: '⚽'
  },
  {
    id: 'eiffel-tower',
    name: '埃菲尔铁塔',
    nameEn: 'Eiffel Tower',
    type: 'landmark',
    latitude: 48.8584,
    longitude: 2.2945,
    description: '法国象征，1889年为巴黎世界博览会建造',
    icon: '🗼'
  },
  {
    id: 'tokyo',
    name: '东京',
    nameEn: 'Tokyo',
    type: 'city',
    latitude: 35.6762,
    longitude: 139.6503,
    description: '日本首都，世界最大都市圈之一',
    icon: '🏯'
  },
  {
    id: 'osaka',
    name: '大阪',
    nameEn: 'Osaka',
    type: 'city',
    latitude: 34.6937,
    longitude: 135.5023,
    description: '日本第二大城市，商业和美食中心',
    icon: '🍜'
  },
  {
    id: 'seoul',
    name: '首尔',
    nameEn: 'Seoul',
    type: 'city',
    latitude: 37.5665,
    longitude: 126.9780,
    description: '韩国首都，世界十大城市之一',
    icon: '🏙️'
  },
  {
    id: 'bangkok',
    name: '曼谷',
    nameEn: 'Bangkok',
    type: 'city',
    latitude: 13.7563,
    longitude: 100.5018,
    description: '泰国首都，东南亚重要城市，大皇宫所在地',
    icon: '🛕'
  },
  {
    id: 'mumbai',
    name: '孟买',
    nameEn: 'Mumbai',
    type: 'city',
    latitude: 19.0760,
    longitude: 72.8777,
    description: '印度最大城市，宝莱坞所在地',
    icon: '🎬'
  },
  {
    id: 'delhi',
    name: '新德里',
    nameEn: 'New Delhi',
    type: 'city',
    latitude: 28.6139,
    longitude: 77.2090,
    description: '印度首都，红堡、印度门所在地',
    icon: '🏛️'
  },
  {
    id: 'mount-fuji',
    name: '富士山',
    nameEn: 'Mount Fuji',
    type: 'mountain',
    latitude: 35.3606,
    longitude: 138.7274,
    description: '日本最高峰，海拔3776米，日本象征',
    altitude: 3776,
    icon: '🗻'
  },
  {
    id: 'sydney',
    name: '悉尼',
    nameEn: 'Sydney',
    type: 'city',
    latitude: -33.8688,
    longitude: 151.2093,
    description: '澳大利亚最大城市，悉尼歌剧院所在地',
    icon: '🏖️'
  },
  {
    id: 'melbourne',
    name: '墨尔本',
    nameEn: 'Melbourne',
    type: 'city',
    latitude: -37.8136,
    longitude: 144.9631,
    description: '澳大利亚第二大城市，文化之都',
    icon: '🏙️'
  },
  {
    id: 'auckland',
    name: '奥克兰',
    nameEn: 'Auckland',
    type: 'city',
    latitude: -36.8485,
    longitude: 174.7633,
    description: '新西兰最大城市，帆船之都',
    icon: '⛵'
  },
  {
    id: 'sydney-opera-house',
    name: '悉尼歌剧院',
    nameEn: 'Sydney Opera House',
    type: 'landmark',
    latitude: -33.8568,
    longitude: 151.2153,
    description: '世界著名表演艺术中心，2007年列入世界遗产',
    icon: '🎭'
  },
  {
    id: 'dubai',
    name: '迪拜',
    nameEn: 'Dubai',
    type: 'city',
    latitude: 25.2048,
    longitude: 55.2708,
    description: '阿联酋城市，哈利法塔所在地，奢华之都',
    icon: '🏙️'
  },
  {
    id: 'cairo',
    name: '开罗',
    nameEn: 'Cairo',
    type: 'city',
    latitude: 30.0444,
    longitude: 31.2357,
    description: '埃及首都，金字塔所在地',
    icon: '🔺'
  },
  {
    id: 'johannesburg',
    name: '约翰内斯堡',
    nameEn: 'Johannesburg',
    type: 'city',
    latitude: -26.2041,
    longitude: 28.0473,
    description: '南非最大城市，黄金之城',
    icon: '💎'
  },
  {
    id: 'capetown',
    name: '开普敦',
    nameEn: 'Cape Town',
    type: 'city',
    latitude: -33.9249,
    longitude: 18.4241,
    description: '南非立法首都，好望角所在地',
    icon: '⛰️'
  },
  {
    id: 'burj-khalifa',
    name: '哈利法塔',
    nameEn: 'Burj Khalifa',
    type: 'landmark',
    latitude: 25.1972,
    longitude: 55.2744,
    description: '世界最高建筑，高828米',
    icon: '🏙️'
  },
  {
    id: 'moscow',
    name: '莫斯科',
    nameEn: 'Moscow',
    type: 'city',
    latitude: 55.7558,
    longitude: 37.6173,
    description: '俄罗斯首都，红场、克里姆林宫所在地',
    icon: '⛪'
  },
  {
    id: 'saint-petersburg',
    name: '圣彼得堡',
    nameEn: 'Saint Petersburg',
    type: 'city',
    latitude: 59.9311,
    longitude: 30.3609,
    description: '俄罗斯第二大城市，冬宫所在地',
    icon: '🏛️'
  },
  {
    id: 'kiev',
    name: '基辅',
    nameEn: 'Kyiv',
    type: 'city',
    latitude: 50.4501,
    longitude: 30.5234,
    description: '乌克兰首都，东正教中心',
    icon: '⛪'
  },
  {
    id: 'hong-kong',
    name: '香港',
    nameEn: 'Hong Kong',
    type: 'city',
    latitude: 22.3193,
    longitude: 114.1694,
    description: '中国特别行政区，国际金融中心',
    icon: '🌃'
  },
  {
    id: 'taipei',
    name: '台北',
    nameEn: 'Taipei',
    type: 'city',
    latitude: 25.0330,
    longitude: 121.5654,
    description: '台湾省会，101大楼所在地',
    icon: '🏙️'
  },
  {
    id: 'singapore',
    name: '新加坡',
    nameEn: 'Singapore',
    type: 'city',
    latitude: 1.3521,
    longitude: 103.8198,
    description: '东南亚城市国家，花园城市',
    icon: '🦁'
  },
  {
    id: 'kuala-lumpur',
    name: '吉隆坡',
    nameEn: 'Kuala Lumpur',
    type: 'city',
    latitude: 3.1390,
    longitude: 101.6869,
    description: '马来西亚首都，双子塔所在地',
    icon: '🏙️'
  },
  {
    id: 'jakarta',
    name: '雅加达',
    nameEn: 'Jakarta',
    type: 'city',
    latitude: -6.2088,
    longitude: 106.8456,
    description: '印度尼西亚首都，东南亚最大城市',
    icon: '🏙️'
  },
  {
    id: 'manila',
    name: '马尼拉',
    nameEn: 'Manila',
    type: 'city',
    latitude: 14.5995,
    longitude: 120.9842,
    description: '菲律宾首都，亚洲最欧化的城市',
    icon: '🏝️'
  },
  {
    id: 'rio',
    name: '里约热内卢',
    nameEn: 'Rio de Janeiro',
    type: 'city',
    latitude: -22.9068,
    longitude: -43.1729,
    description: '巴西第二大城市，基督像所在地',
    icon: '🏖️'
  },
  {
    id: 'brasilia',
    name: '巴西利亚',
    nameEn: 'Brasília',
    type: 'city',
    latitude: -15.8267,
    longitude: -47.9218,
    description: '巴西首都，现代建筑之都',
    icon: '🏛️'
  },
  {
    id: 'buenos-aires',
    name: '布宜诺斯艾利斯',
    nameEn: 'Buenos Aires',
    type: 'city',
    latitude: -34.6037,
    longitude: -58.3816,
    description: '阿根廷首都，南美巴黎',
    icon: '🎭'
  },
  {
    id: 'mexico-city',
    name: '墨西哥城',
    nameEn: 'Mexico City',
    type: 'city',
    latitude: 19.4326,
    longitude: -99.1332,
    description: '墨西哥首都，西半球最古老城市',
    icon: '🏛️'
  },
  {
    id: 'toronto',
    name: '多伦多',
    nameEn: 'Toronto',
    type: 'city',
    latitude: 43.6532,
    longitude: -79.3832,
    description: '加拿大最大城市，CN塔所在地',
    icon: '🏙️'
  },
  {
    id: 'vancouver',
    name: '温哥华',
    nameEn: 'Vancouver',
    type: 'city',
    latitude: 49.2827,
    longitude: -123.1207,
    description: '加拿大西海岸城市，太平洋门户',
    icon: '🌲'
  },
  {
    id: 'christ-redeemer',
    name: '基督像',
    nameEn: 'Christ the Redeemer',
    type: 'landmark',
    latitude: -22.9519,
    longitude: -43.2105,
    description: '里约热内卢地标，世界七大奇迹之一',
    icon: '✝️'
  },
  {
    id: 'everest',
    name: '珠穆朗玛峰',
    nameEn: 'Mount Everest',
    type: 'mountain',
    latitude: 27.9881,
    longitude: 86.9250,
    description: '世界最高峰，海拔8848.86米',
    altitude: 8848.86,
    icon: '🏔️'
  },
  {
    id: 'k2',
    name: 'K2峰',
    nameEn: 'K2',
    type: 'mountain',
    latitude: 35.8825,
    longitude: 76.5133,
    description: '世界第二高峰，海拔8611米',
    altitude: 8611,
    icon: '🏔️'
  },
  {
    id: 'kangchenjunga',
    name: '干城章嘉峰',
    nameEn: 'Kangchenjunga',
    type: 'mountain',
    latitude: 27.7025,
    longitude: 88.1483,
    description: '世界第三高峰，海拔8586米',
    altitude: 8586,
    icon: '🏔️'
  },
  {
    id: 'lhotse',
    name: '洛子峰',
    nameEn: 'Lhotse',
    type: 'mountain',
    latitude: 27.9616,
    longitude: 86.9330,
    description: '世界第四高峰，海拔8516米',
    altitude: 8516,
    icon: '🏔️'
  },
  {
    id: 'makalu',
    name: '马卡鲁峰',
    nameEn: 'Makalu',
    type: 'mountain',
    latitude: 27.8897,
    longitude: 87.0886,
    description: '世界第五高峰，海拔8485米',
    altitude: 8485,
    icon: '🏔️'
  },
  {
    id: 'cho-oyu',
    name: '卓奥友峰',
    nameEn: 'Cho Oyu',
    type: 'mountain',
    latitude: 28.0942,
    longitude: 86.6608,
    description: '世界第六高峰，海拔8188米',
    altitude: 8188,
    icon: '🏔️'
  },
  {
    id: 'dhaulagiri',
    name: '道拉吉里峰',
    nameEn: 'Dhaulagiri',
    type: 'mountain',
    latitude: 28.6965,
    longitude: 83.4883,
    description: '世界第七高峰，海拔8167米',
    altitude: 8167,
    icon: '🏔️'
  },
  {
    id: 'manaslu',
    name: '马纳斯卢峰',
    nameEn: 'Manaslu',
    type: 'mountain',
    latitude: 28.5500,
    longitude: 84.5600,
    description: '世界第八高峰，海拔8163米',
    altitude: 8163,
    icon: '🏔️'
  },
  {
    id: 'nanga-parbat',
    name: '南迦帕尔巴特峰',
    nameEn: 'Nanga Parbat',
    type: 'mountain',
    latitude: 35.2375,
    longitude: 74.5891,
    description: '世界第九高峰，海拔8126米',
    altitude: 8126,
    icon: '🏔️'
  },
  {
    id: 'annapurna',
    name: '安纳普尔纳峰',
    nameEn: 'Annapurna',
    type: 'mountain',
    latitude: 28.5950,
    longitude: 83.8200,
    description: '世界第十高峰，海拔8091米',
    altitude: 8091,
    icon: '🏔️'
  },
  {
    id: 'pyramids',
    name: '金字塔',
    nameEn: 'Pyramids of Giza',
    type: 'landmark',
    latitude: 29.9792,
    longitude: 31.1342,
    description: '古埃及法老陵墓，世界七大奇迹之一',
    icon: '🔺'
  },
  {
    id: 'colosseum',
    name: '罗马斗兽场',
    nameEn: 'Colosseum',
    type: 'landmark',
    latitude: 41.8902,
    longitude: 12.4922,
    description: '古罗马最大圆形竞技场，建于公元70-80年',
    icon: '🏛️'
  },
  {
    id: 'taj-mahal',
    name: '泰姬陵',
    nameEn: 'Taj Mahal',
    type: 'landmark',
    latitude: 27.1751,
    longitude: 78.0421,
    description: '印度莫卧儿王朝陵墓，世界七大奇迹之一',
    icon: '🕌'
  },
  {
    id: 'petra',
    name: '佩特拉',
    nameEn: 'Petra',
    type: 'landmark',
    latitude: 30.3285,
    longitude: 35.4444,
    description: '约旦古城，玫瑰红城，世界七大奇迹之一',
    icon: '🏛️'
  },
  {
    id: 'machu-picchu',
    name: '马丘比丘',
    nameEn: 'Machu Picchu',
    type: 'landmark',
    latitude: -13.1631,
    longitude: -72.5450,
    description: '印加帝国遗址，世界七大奇迹之一，秘鲁',
    icon: '🏛️'
  },
  {
    id: 'angkor-wat',
    name: '吴哥窟',
    nameEn: 'Angkor Wat',
    type: 'landmark',
    latitude: 13.4125,
    longitude: 103.8667,
    description: '柬埔寨古代寺庙，世界最大宗教建筑',
    icon: '🛕'
  },
  {
    id: 'stonehenge',
    name: '巨石阵',
    nameEn: 'Stonehenge',
    type: 'landmark',
    latitude: 51.1789,
    longitude: -1.8262,
    description: '英国史前巨石建筑，世界文化遗产',
    icon: '🪨'
  },
  {
    id: 'acropolis',
    name: '雅典卫城',
    nameEn: 'Acropolis',
    type: 'landmark',
    latitude: 37.9715,
    longitude: 23.7257,
    description: '古希腊文明象征，帕特农神庙所在地',
    icon: '🏛️'
  },
  {
    id: 'pacific',
    name: '太平洋',
    nameEn: 'Pacific Ocean',
    type: 'ocean',
    latitude: 0,
    longitude: -160,
    description: '世界最大洋，面积约1.65亿平方公里',
    icon: '🌊'
  },
  {
    id: 'atlantic',
    name: '大西洋',
    nameEn: 'Atlantic Ocean',
    type: 'ocean',
    latitude: 0,
    longitude: -30,
    description: '世界第二大洋，面积约1.06亿平方公里',
    icon: '🌊'
  },
  {
    id: 'indian-ocean',
    name: '印度洋',
    nameEn: 'Indian Ocean',
    type: 'ocean',
    latitude: -20,
    longitude: 80,
    description: '世界第三大洋，面积约7300万平方公里',
    icon: '🌊'
  },
  {
    id: 'arctic',
    name: '北冰洋',
    nameEn: 'Arctic Ocean',
    type: 'ocean',
    latitude: 80,
    longitude: 0,
    description: '世界最小最浅的大洋，面积约1400万平方公里',
    icon: '❄️'
  },
  {
    id: 'southern-ocean',
    name: '南冰洋',
    nameEn: 'Southern Ocean',
    type: 'ocean',
    latitude: -60,
    longitude: 0,
    description: '环绕南极洲的大洋，面积约2000万平方公里',
    icon: '🌊'
  },
  {
    id: 'mediterranean',
    name: '地中海',
    nameEn: 'Mediterranean Sea',
    type: 'ocean',
    latitude: 35,
    longitude: 18,
    description: '世界最大的陆间海，面积约250万平方公里',
    icon: '🌊'
  },
  {
    id: 'caribbean',
    name: '加勒比海',
    nameEn: 'Caribbean Sea',
    type: 'ocean',
    latitude: 15,
    longitude: -75,
    description: '大西洋的边缘海，面积约275万平方公里',
    icon: '🏝️'
  },
  {
    id: 'south-china-sea',
    name: '南海',
    nameEn: 'South China Sea',
    type: 'ocean',
    latitude: 15,
    longitude: 115,
    description: '西太平洋的一部分，面积约350万平方公里',
    icon: '🌊'
  },
  {
    id: 'antarctica',
    name: '南极洲',
    nameEn: 'Antarctica',
    type: 'country',
    latitude: -75,
    longitude: 0,
    description: '地球最南端的大陆，世界第五大洲',
    icon: '🧊'
  },
  {
    id: 'greenland',
    name: '格陵兰岛',
    nameEn: 'Greenland',
    type: 'country',
    latitude: 72,
    longitude: -40,
    description: '世界最大岛屿，面积约216万平方公里',
    icon: '🧊'
  },
  {
    id: 'madagascar',
    name: '马达加斯加',
    nameEn: 'Madagascar',
    type: 'country',
    latitude: -19,
    longitude: 46,
    description: '世界第四大岛，独特的生态系统',
    icon: '🦎'
  },
  {
    id: 'borneo',
    name: '婆罗洲',
    nameEn: 'Borneo',
    type: 'country',
    latitude: 1,
    longitude: 113,
    description: '世界第三大岛，属马来西亚、印尼和文莱',
    icon: '🌴'
  },
  {
    id: 'amazon',
    name: '亚马逊雨林',
    nameEn: 'Amazon Rainforest',
    type: 'country',
    latitude: -3,
    longitude: -62,
    description: '世界最大热带雨林，地球之肺',
    icon: '🌳'
  },
  {
    id: 'sahara',
    name: '撒哈拉沙漠',
    nameEn: 'Sahara Desert',
    type: 'country',
    latitude: 25,
    longitude: 10,
    description: '世界最大热沙漠，面积约906万平方公里',
    icon: '🏜️'
  },
  {
    id: 'gobi',
    name: '戈壁沙漠',
    nameEn: 'Gobi Desert',
    type: 'country',
    latitude: 42,
    longitude: 105,
    description: '亚洲最大沙漠，位于中国和蒙古',
    icon: '🏜️'
  },
  {
    id: 'himalayas',
    name: '喜马拉雅山脉',
    nameEn: 'Himalayas',
    type: 'mountain',
    latitude: 28,
    longitude: 84,
    description: '世界最高山脉，有10座8000米以上高峰',
    altitude: 8848,
    icon: '🏔️'
  },
  {
    id: 'andes',
    name: '安第斯山脉',
    nameEn: 'Andes',
    type: 'mountain',
    latitude: -25,
    longitude: -70,
    description: '世界最长山脉，全长约7000公里',
    altitude: 6961,
    icon: '🏔️'
  },
  {
    id: 'rockies',
    name: '落基山脉',
    nameEn: 'Rocky Mountains',
    type: 'mountain',
    latitude: 45,
    longitude: -110,
    description: '北美主要山脉，全长约4800公里',
    altitude: 4401,
    icon: '🏔️'
  },
  {
    id: 'alps',
    name: '阿尔卑斯山脉',
    nameEn: 'Alps',
    type: 'mountain',
    latitude: 47,
    longitude: 10,
    description: '欧洲最高山脉，横跨8个国家',
    altitude: 4808,
    icon: '🏔️'
  },
  {
    id: 'kilimanjaro',
    name: '乞力马扎罗山',
    nameEn: 'Kilimanjaro',
    type: 'mountain',
    latitude: -3.0674,
    longitude: 37.3556,
    description: '非洲最高峰，海拔5895米，独立火山',
    altitude: 5895,
    icon: '🏔️'
  },
  {
    id: 'elbrus',
    name: '厄尔布鲁士山',
    nameEn: 'Mount Elbrus',
    type: 'mountain',
    latitude: 43.3550,
    longitude: 42.4392,
    description: '欧洲最高峰，海拔5642米',
    altitude: 5642,
    icon: '🏔️'
  },
  {
    id: 'denali',
    name: '迪纳利山',
    nameEn: 'Denali',
    type: 'mountain',
    latitude: 63.0695,
    longitude: -151.0074,
    description: '北美最高峰，海拔6190米',
    altitude: 6190,
    icon: '🏔️'
  },
  {
    id: 'aconcagua',
    name: '阿空加瓜山',
    nameEn: 'Aconcagua',
    type: 'mountain',
    latitude: -32.6531,
    longitude: -70.0108,
    description: '南美最高峰，海拔6961米',
    altitude: 6961,
    icon: '🏔️'
  },
  {
    id: 'vinson',
    name: '文森峰',
    nameEn: 'Vinson Massif',
    type: 'mountain',
    latitude: -78.5255,
    longitude: -85.6215,
    description: '南极洲最高峰，海拔4892米',
    altitude: 4892,
    icon: '🏔️'
  },
  {
    id: 'puncak-jaya',
    name: '查亚峰',
    nameEn: 'Puncak Jaya',
    type: 'mountain',
    latitude: -4.0800,
    longitude: 137.1583,
    description: '大洋洲最高峰，海拔4884米',
    altitude: 4884,
    icon: '🏔️'
  },
  {
    id: 'mariana-trench',
    name: '马里亚纳海沟',
    nameEn: 'Mariana Trench',
    type: 'ocean',
    latitude: 11.3493,
    longitude: 142.1996,
    description: '地球最深海沟，最深处约10994米',
    icon: '🌊'
  },
  {
    id: 'puerto-rico-trench',
    name: '波多黎各海沟',
    nameEn: 'Puerto Rico Trench',
    type: 'ocean',
    latitude: 19.6250,
    longitude: -66.6667,
    description: '大西洋最深处，最深处约8376米',
    icon: '🌊'
  },
  {
    id: 'java-trench',
    name: '爪哇海沟',
    nameEn: 'Java Trench',
    type: 'ocean',
    latitude: -10.5000,
    longitude: 110.0000,
    description: '印度洋最深处，最深处约7258米',
    icon: '🌊'
  },
  {
    id: 'dead-sea',
    name: '死海',
    nameEn: 'Dead Sea',
    type: 'ocean',
    latitude: 31.5590,
    longitude: 35.4732,
    description: '地球表面最低点，海拔-430米',
    altitude: -430,
    icon: '🧂'
  }
];

export const getLandmarkByLocation = (lat: number, lng: number, threshold: number = 15): Landmark | null => {
  let closest: Landmark | null = null;
  let closestDistance = Infinity;

  for (const landmark of landmarks) {
    const distance = Math.sqrt(
      Math.pow(landmark.latitude - lat, 2) + Math.pow(landmark.longitude - lng, 2)
    );
    if (distance < threshold && distance < closestDistance) {
      closest = landmark;
      closestDistance = distance;
    }
  }

  return closest;
};
