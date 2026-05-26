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
        ctx.lineWidth = 2;
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
        
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
        
        if (cellX < 0 || cellX >= width || cellY < 0 || cellY >= height) {
            return true;
        }
        
        const cell = grid[cellY][cellX];
        const localX = x - cellX * cellSize;
        const localY = y - cellY * cellSize;
        
        if (cell.walls.top && localY - radius < 0) return true;
        if (cell.walls.bottom && localY + radius > cellSize) return true;
        if (cell.walls.left && localX - radius < 0) return true;
        if (cell.walls.right && localX + radius > cellSize) return true;
        
        return false;
    }
}
