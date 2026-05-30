import { Prize } from '@/types';

export const prizes: Prize[] = [
  {
    id: '1',
    name: '世界杯金球奖杯',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20world%20cup%20trophy%20on%20white%20background&image_size=square',
    value: 9999,
    probability: 0.01,
  },
  {
    id: '2',
    name: '限量版足球',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20soccer%20ball%20white%20background&image_size=square',
    value: 599,
    probability: 0.05,
  },
  {
    id: '3',
    name: '球星签名球衣',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=soccer%20jersey%20with%20signature%20white%20background&image_size=square',
    value: 1299,
    probability: 0.03,
  },
  {
    id: '4',
    name: '50元优惠券',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=coupon%20voucher%2050%20yuan%20golden%20design&image_size=square',
    value: 50,
    probability: 0.15,
  },
  {
    id: '5',
    name: '10元红包',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20envelope%2010%20yuan%20gift&image_size=square',
    value: 10,
    probability: 0.26,
  },
];

export const loseProbability = 0.5;

export const gameConfig = {
  shootSpeed: 1.2,
  goalkeeperReactionTime: 0.3,
};
