import { ActivityData } from '@/types';

const avatarPrompts = [
  'elegant princess portrait, soft lighting, dreamy atmosphere',
  'handsome prince portrait, noble demeanor, royal style',
  'mysterious fairy portrait, ethereal beauty, magical glow',
  'charming knight portrait, brave and heroic',
  'graceful queen portrait, crown and jewels',
  'cute elf portrait, pointy ears, sparkling eyes',
  'wise wizard portrait, long beard, starry robe',
  'beautiful mermaid portrait, underwater, shimmering scales',
  'noble king portrait, crown, majestic',
  'lovely angel portrait, wings, halo, pure',
  'cool vampire portrait, dark elegance, mysterious',
  'gentle unicorn spirit portrait, horn, rainbow aura',
];

const generateAvatar = (index: number) => {
  const prompt = encodeURIComponent(avatarPrompts[index % avatarPrompts.length]);
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${prompt}&image_size=square`;
};

const names = [
  '星月公主', '阳光王子', '梦幻精灵', '星辰骑士', '紫霞仙子', '森林精灵',
  '魔法大师', '海的女儿', '荣耀王者', '天使之翼', '暗夜伯爵', '彩虹守护',
];

export const mockActivityData: ActivityData = {
  topUser: {
    id: 'top-1',
    name: '宇宙至尊',
    avatar: generateAvatar(0),
    amount: 999999,
  },
  zodiacRanks: [
    { zodiacId: 1, user: { id: 'u1', name: names[0], avatar: generateAvatar(1), amount: 128888 } },
    { zodiacId: 2, user: { id: 'u2', name: names[1], avatar: generateAvatar(2), amount: 108888 } },
    { zodiacId: 3, user: null },
    { zodiacId: 4, user: { id: 'u4', name: names[3], avatar: generateAvatar(4), amount: 156666 } },
    { zodiacId: 5, user: { id: 'u5', name: names[4], avatar: generateAvatar(5), amount: 238888 } },
    { zodiacId: 6, user: null },
    { zodiacId: 7, user: { id: 'u7', name: names[6], avatar: generateAvatar(7), amount: 188888 } },
    { zodiacId: 8, user: { id: 'u8', name: names[7], avatar: generateAvatar(8), amount: 168888 } },
    { zodiacId: 9, user: { id: 'u9', name: names[8], avatar: generateAvatar(9), amount: 118888 } },
    { zodiacId: 10, user: null },
    { zodiacId: 11, user: { id: 'u11', name: names[10], avatar: generateAvatar(11), amount: 148888 } },
    { zodiacId: 12, user: { id: 'u12', name: names[11], avatar: generateAvatar(0), amount: 198888 } },
  ],
};
