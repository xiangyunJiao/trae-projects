import { LocationData, PathPoint } from '@/types';

export const generateSmoothPath = (locations: LocationData[]): string => {
  if (locations.length < 2) return '';

  const points = locations.map(loc => ({ x: loc.x, y: loc.y }));
  
  let pathD = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const prev = i > 0 ? points[i - 1] : current;
    const nextNext = i < points.length - 2 ? points[i + 2] : next;
    
    const cp1x = current.x + (next.x - prev.x) / 6;
    const cp1y = current.y + (next.y - prev.y) / 6;
    const cp2x = next.x - (nextNext.x - current.x) / 6;
    const cp2y = next.y - (nextNext.y - current.y) / 6;
    
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }
  
  return pathD;
};

export const getPointAtProgress = (
  pathElement: SVGPathElement,
  progress: number
): PathPoint & { angle: number } => {
  const totalLength = pathElement.getTotalLength();
  const targetLength = Math.min(Math.max(progress, 0), 1) * totalLength;
  
  const point = pathElement.getPointAtLength(targetLength);
  
  const prevPoint = pathElement.getPointAtLength(Math.max(0, targetLength - 1));
  const nextPoint = pathElement.getPointAtLength(Math.min(totalLength, targetLength + 1));
  
  const angle = Math.atan2(nextPoint.y - prevPoint.y, nextPoint.x - prevPoint.x) * (180 / Math.PI);
  
  return {
    x: point.x,
    y: point.y,
    angle
  };
};

export const calculateLocationProgress = (
  pathElement: SVGPathElement,
  locations: LocationData[],
  locationIndex: number
): number => {
  if (locationIndex === 0) return 0;
  if (locationIndex >= locations.length - 1) return 1;
  
  const targetLoc = locations[locationIndex];
  const totalLength = pathElement.getTotalLength();
  
  let low = 0;
  let high = 1;
  let bestProgress = 0;
  let bestDist = Infinity;
  
  for (let i = 0; i <= 100; i++) {
    const progress = i / 100;
    const point = pathElement.getPointAtLength(progress * totalLength);
    const dist = Math.pow(point.x - targetLoc.x, 2) + Math.pow(point.y - targetLoc.y, 2);
    if (dist < bestDist) {
      bestDist = dist;
      bestProgress = progress;
    }
  }
  
  return bestProgress;
};

export const calculateAllLocationProgresses = (
  pathElement: SVGPathElement,
  locations: LocationData[]
): number[] => {
  return locations.map((_, index) => calculateLocationProgress(pathElement, locations, index));
};

export const calculateProgress = (
  userPoints: number,
  locations: LocationData[]
): number => {
  const totalPoints = locations[locations.length - 1].points;
  if (totalPoints === 0) return 0;
  return Math.min(userPoints / totalPoints, 1);
};

export const calculatePlaneProgress = (
  userPoints: number,
  locations: LocationData[],
  locationProgresses: number[]
): number => {
  if (userPoints <= 0) return 0;
  
  for (let i = locations.length - 1; i >= 0; i--) {
    if (userPoints >= locations[i].points) {
      if (i === locations.length - 1) {
        return 1;
      }
      const startPoints = locations[i].points;
      const endPoints = locations[i + 1].points;
      const startProgress = locationProgresses[i];
      const endProgress = locationProgresses[i + 1];
      const ratio = (userPoints - startPoints) / (endPoints - startPoints);
      return startProgress + (endProgress - startProgress) * Math.min(ratio, 1);
    }
  }
  
  return 0;
};

export const getCurrentSegmentProgress = (
  userPoints: number,
  locations: LocationData[]
): { segmentIndex: number; segmentProgress: number } => {
  for (let i = locations.length - 1; i >= 0; i--) {
    if (userPoints >= locations[i].points) {
      if (i === locations.length - 1) {
        return { segmentIndex: i, segmentProgress: 1 };
      }
      const segmentStart = locations[i].points;
      const segmentEnd = locations[i + 1].points;
      const segmentProgress = (userPoints - segmentStart) / (segmentEnd - segmentStart);
      return { segmentIndex: i, segmentProgress: Math.min(segmentProgress, 1) };
    }
  }
  return { segmentIndex: 0, segmentProgress: 0 };
};
