import { LocationData } from '@/types';

const locationNames = [
  '起点站',
  '上海',
  '东京',
  '巴黎',
  '纽约',
  '悉尼',
  '终点站'
];

const locationImages = [
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop'
];

export const generateLocationPoints = (): LocationData[] => {
  const locations: LocationData[] = [];
  const screenWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth, 500) : 375;
  const totalHeight = 1400;
  const startY = totalHeight - 80;
  
  for (let i = 0; i < 7; i++) {
    let x: number;
    let currentY: number;
    
    if (i === 0) {
      x = screenWidth / 2;
      currentY = startY;
    } else {
      if (i % 2 === 1) {
        x = screenWidth - 100;
      } else {
        x = 100;
      }
      
      const spacing = 180 + Math.random() * 40;
      currentY = startY - i * spacing;
    }

    locations.push({
      id: i,
      name: locationNames[i],
      image: locationImages[i],
      points: i * 1000,
      x,
      y: currentY,
      unlocked: i === 0,
      claimed: false
    });
  }

  return locations;
};
