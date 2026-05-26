class MazeGenerator {
    constructor() {
        this.grid = [];
        this.width = 0;
        this.height = 0;
        this.cellSize = 0;
    }

    generate(level, canvasWidth, canvasHeight) {
        const baseSize = Math.min(canvasWidth, canvasHeight);
        const gridSize = this.getGridSize(level);
        this.cellSize = Math.floor(baseSize / gridSize);
        
        this.width = Math.floor(canvasWidth / this.cellSize);
        this.height = Math.floor(canvasHeight / this.cellSize);
        
        this.width = Math.max(5, this.width);
        this.height = Math.max(5, this.height);
        
        this.grid = [];
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x] = {
                    walls: { top: true, right: true, bottom: true, left: true },
                    visited: false
                };
            }
        }
        
        this.generateMaze();
        this.addExtraPaths(level);
        
        return {
            grid: this.grid,
            width: this.width,
            height: this.height,
            cellSize: this.cellSize,
            start: { x: this.width - 1, y: this.height - 1 },
            end: { x: 0, y: 0 }
        };
    }

    getGridSize(level) {
        const sizes = [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20];
        return sizes[Math.min(level - 1, sizes.length - 1)];
    }

    generateMaze() {
        const stack = [];
        const startCell = this.grid[0][0];
        startCell.visited = true;
        stack.push({ x: 0, y: 0 });

        while (stack.length > 0) {
            const pos = stack[stack.length - 1];
            const neighbors = this.getUnvisitedNeighbors(pos.x, pos.y);

            if (neighbors.length > 0) {
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                this.removeWall(pos.x, pos.y, next.x, next.y);
                this.grid[next.y][next.x].visited = true;
                stack.push({ x: next.x, y: next.y });
            } else {
                stack.pop();
            }
        }
    }

    getUnvisitedNeighbors(x, y) {
        const neighbors = [];

        if (y > 0 && !this.grid[y - 1][x].visited) {
            neighbors.push({ x: x, y: y - 1 });
        }
        if (x < this.width - 1 && !this.grid[y][x + 1].visited) {
            neighbors.push({ x: x + 1, y: y });
        }
        if (y < this.height - 1 && !this.grid[y + 1][x].visited) {
            neighbors.push({ x: x, y: y + 1 });
        }
        if (x > 0 && !this.grid[y][x - 1].visited) {
            neighbors.push({ x: x - 1, y: y });
        }

        return neighbors;
    }

    removeWall(x1, y1, x2, y2) {
        if (x2 === x1 + 1) {
            this.grid[y1][x1].walls.right = false;
            this.grid[y2][x2].walls.left = false;
        } else if (x2 === x1 - 1) {
            this.grid[y1][x1].walls.left = false;
            this.grid[y2][x2].walls.right = false;
        } else if (y2 === y1 + 1) {
            this.grid[y1][x1].walls.bottom = false;
            this.grid[y2][x2].walls.top = false;
        } else if (y2 === y1 - 1) {
            this.grid[y1][x1].walls.top = false;
            this.grid[y2][x2].walls.bottom = false;
        }
    }

    addExtraPaths(level) {
        const extraPaths = Math.min(level * 3, 30);
        
        for (let i = 0; i < extraPaths; i++) {
            const x = Math.floor(Math.random() * (this.width - 1));
            const y = Math.floor(Math.random() * (this.height - 1));
            
            if (Math.random() > 0.5 && x < this.width - 1) {
                this.grid[y][x].walls.right = false;
                this.grid[y][x + 1].walls.left = false;
            } else if (y < this.height - 1) {
                this.grid[y][x].walls.bottom = false;
                this.grid[y + 1][x].walls.top = false;
            }
        }
    }

    render(ctx, mazeData, offsetX, offsetY) {
        const { grid, width, height, cellSize, start, end } = mazeData;
        
        ctx.strokeStyle = '#4a90d9';
        ctx.lineWidth = Math.max(3, cellSize * 0.08);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell = grid[y][x];
                const px = offsetX + x * cellSize;
                const py = offsetY + y * cellSize;
                
                ctx.beginPath();
                if (cell.walls.top) {
                    ctx.moveTo(px, py);
                    ctx.lineTo(px + cellSize, py);
                }
                if (cell.walls.right) {
                    ctx.moveTo(px + cellSize, py);
                    ctx.lineTo(px + cellSize, py + cellSize);
                }
                if (cell.walls.bottom) {
                    ctx.moveTo(px, py + cellSize);
                    ctx.lineTo(px + cellSize, py + cellSize);
                }
                if (cell.walls.left) {
                    ctx.moveTo(px, py);
                    ctx.lineTo(px, py + cellSize);
                }
                ctx.stroke();
            }
        }
        
        this.drawStartEnd(ctx, start, end, cellSize, offsetX, offsetY);
    }

    drawStartEnd(ctx, start, end, cellSize, offsetX, offsetY) {
        const startX = offsetX + start.x * cellSize + cellSize / 2;
        const startY = offsetY + start.y * cellSize + cellSize / 2;
        
        const endX = offsetX + end.x * cellSize + cellSize / 2;
        const endY = offsetY + end.y * cellSize + cellSize / 2;
        
        ctx.fillStyle = 'rgba(74, 144, 217, 0.3)';
        ctx.beginPath();
        ctx.arc(startX, startY, cellSize * 0.35, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(endX, endY, cellSize * 0.35, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffd700';
        ctx.font = `${cellSize * 0.4}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⭐', endX, endY);
    }

    checkWallCollision(mazeData, x, y, radius) {
        const { grid, width, height, cellSize } = mazeData;
        const wallThickness = Math.max(3, cellSize * 0.08);
        const effectiveRadius = radius + wallThickness * 0.6;
        
        const minCellX = Math.floor((x - effectiveRadius) / cellSize);
        const maxCellX = Math.floor((x + effectiveRadius) / cellSize);
        const minCellY = Math.floor((y - effectiveRadius) / cellSize);
        const maxCellY = Math.floor((y + effectiveRadius) / cellSize);
        
        for (let cy = minCellY; cy <= maxCellY; cy++) {
            for (let cx = minCellX; cx <= maxCellX; cx++) {
                if (cx < 0 || cx >= width || cy < 0 || cy >= height) {
                    return true;
                }
                
                const cell = grid[cy][cx];
                const cellLeft = cx * cellSize;
                const cellRight = cellLeft + cellSize;
                const cellTop = cy * cellSize;
                const cellBottom = cellTop + cellSize;
                
                if (cell.walls.top) {
                    if (this.circleLineCollision(x, y, effectiveRadius, cellLeft, cellTop, cellRight, cellTop)) {
                        return true;
                    }
                }
                if (cell.walls.bottom) {
                    if (this.circleLineCollision(x, y, effectiveRadius, cellLeft, cellBottom, cellRight, cellBottom)) {
                        return true;
                    }
                }
                if (cell.walls.left) {
                    if (this.circleLineCollision(x, y, effectiveRadius, cellLeft, cellTop, cellLeft, cellBottom)) {
                        return true;
                    }
                }
                if (cell.walls.right) {
                    if (this.circleLineCollision(x, y, effectiveRadius, cellRight, cellTop, cellRight, cellBottom)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    circleLineCollision(cx, cy, radius, x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lenSq = dx * dx + dy * dy;
        
        if (lenSq < 0.0001) {
            const distX = cx - x1;
            const distY = cy - y1;
            return Math.sqrt(distX * distX + distY * distY) < radius;
        }
        
        let dot = ((cx - x1) * dx + (cy - y1) * dy) / lenSq;
        dot = Math.max(0, Math.min(1, dot));
        
        const closestX = x1 + dot * dx;
        const closestY = y1 + dot * dy;
        
        const distX = cx - closestX;
        const distY = cy - closestY;
        const distSq = distX * distX + distY * distY;
        
        return distSq < radius * radius;
    }
    
    getAllWalls(mazeData, x, y, radius) {
        const { grid, width, height, cellSize } = mazeData;
        const walls = [];
        const wallThickness = Math.max(3, cellSize * 0.08);
        const effectiveRadius = radius + wallThickness * 0.6;
        
        const minCellX = Math.floor((x - effectiveRadius) / cellSize);
        const maxCellX = Math.floor((x + effectiveRadius) / cellSize);
        const minCellY = Math.floor((y - effectiveRadius) / cellSize);
        const maxCellY = Math.floor((y + effectiveRadius) / cellSize);
        
        for (let cy = minCellY; cy <= maxCellY; cy++) {
            for (let cx = minCellX; cx <= maxCellX; cx++) {
                if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;
                
                const cell = grid[cy][cx];
                const cellLeft = cx * cellSize;
                const cellRight = cellLeft + cellSize;
                const cellTop = cy * cellSize;
                const cellBottom = cellTop + cellSize;
                
                if (cell.walls.top) {
                    walls.push({ x1: cellLeft, y1: cellTop, x2: cellRight, y2: cellTop });
                }
                if (cell.walls.bottom) {
                    walls.push({ x1: cellLeft, y1: cellBottom, x2: cellRight, y2: cellBottom });
                }
                if (cell.walls.left) {
                    walls.push({ x1: cellLeft, y1: cellTop, x2: cellLeft, y2: cellBottom });
                }
                if (cell.walls.right) {
                    walls.push({ x1: cellRight, y1: cellTop, x2: cellRight, y2: cellBottom });
                }
            }
        }
        
        return walls;
    }
    
    resolveCollision(mazeData, x, y, radius) {
        const { width, height, cellSize } = mazeData;
        const wallThickness = Math.max(3, cellSize * 0.08);
        const effectiveRadius = radius + wallThickness * 0.6;
        
        let newX = x;
        let newY = y;
        let collided = false;
        let totalPushX = 0;
        let totalPushY = 0;
        
        const maxIterations = 10;
        let iteration = 0;
        
        while (iteration < maxIterations) {
            const walls = this.getAllWalls(mazeData, newX, newY, radius);
            let deepestCollision = null;
            let maxOverlap = 0;
            
            for (const wall of walls) {
                const result = this.getCircleLineCollision(newX, newY, effectiveRadius, wall.x1, wall.y1, wall.x2, wall.y2);
                if (result.collided && result.overlap > maxOverlap) {
                    maxOverlap = result.overlap;
                    deepestCollision = result;
                }
            }
            
            if (deepestCollision && maxOverlap > 0.001) {
                collided = true;
                const pushAmount = maxOverlap * 1.05;
                newX += deepestCollision.normalX * pushAmount;
                newY += deepestCollision.normalY * pushAmount;
                totalPushX += deepestCollision.normalX * pushAmount;
                totalPushY += deepestCollision.normalY * pushAmount;
                iteration++;
            } else {
                break;
            }
        }
        
        if (iteration >= maxIterations) {
            const safeDist = effectiveRadius * 1.1;
            newX = Math.max(safeDist, Math.min(width * cellSize - safeDist, newX));
            newY = Math.max(safeDist, Math.min(height * cellSize - safeDist, newY));
        }
        
        newX = Math.max(effectiveRadius, Math.min(width * cellSize - effectiveRadius, newX));
        newY = Math.max(effectiveRadius, Math.min(height * cellSize - effectiveRadius, newY));
        
        return {
            x: newX,
            y: newY,
            collided,
            pushX: totalPushX,
            pushY: totalPushY
        };
    }
    
    getCircleLineCollision(cx, cy, radius, x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lenSq = dx * dx + dy * dy;
        
        let closestX, closestY;
        
        if (lenSq < 0.0001) {
            closestX = x1;
            closestY = y1;
        } else {
            let dot = ((cx - x1) * dx + (cy - y1) * dy) / lenSq;
            dot = Math.max(0, Math.min(1, dot));
            closestX = x1 + dot * dx;
            closestY = y1 + dot * dy;
        }
        
        const distX = cx - closestX;
        const distY = cy - closestY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        if (distance < radius && distance > 0.0001) {
            const overlap = radius - distance;
            const nx = distX / distance;
            const ny = distY / distance;
            return {
                collided: true,
                overlap,
                normalX: nx,
                normalY: ny,
                closestX,
                closestY
            };
        } else if (distance <= 0.0001) {
            const toCenterX = cx - (x1 + x2) / 2;
            const toCenterY = cy - (y1 + y2) / 2;
            const toCenterDist = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY);
            if (toCenterDist > 0.0001) {
                return {
                    collided: true,
                    overlap: radius,
                    normalX: toCenterX / toCenterDist,
                    normalY: toCenterY / toCenterDist,
                    closestX,
                    closestY
                };
            } else {
                return {
                    collided: true,
                    overlap: radius,
                    normalX: 0,
                    normalY: -1,
                    closestX,
                    closestY
                };
            }
        }
        
        return { collided: false, overlap: 0, normalX: 0, normalY: 0 };
    }
}
