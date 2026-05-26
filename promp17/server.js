const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const HTTP_PORT = 3000;
const HTTPS_PORT = 3001;
const HOST = '0.0.0.0';

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function serveFile(filePath, res) {
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType + '; charset=utf-8' });
            res.end(content);
        }
    });
}

function createServer(isSecure = false) {
    const requestListener = (req, res) => {
        let filePath = req.url === '/' ? '/index.html' : req.url;
        
        if (filePath.includes('?')) {
            filePath = filePath.split('?')[0];
        }
        
        filePath = path.join(__dirname, filePath);
        serveFile(filePath, res);
    };
    
    if (isSecure) {
        try {
            const options = {
                key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
                cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem'))
            };
            return https.createServer(options, requestListener);
        } catch (err) {
            console.log('⚠️  HTTPS证书未找到，仅启动HTTP服务器');
            console.log('   运行 ./generate-cert.sh 生成证书以启用HTTPS');
            return null;
        }
    }
    
    return http.createServer(requestListener);
}

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

const httpServer = createServer(false);
httpServer.listen(HTTP_PORT, HOST, () => {
    const localIP = getLocalIP();
    console.log('='.repeat(60));
    console.log('🚀 滚珠迷宫游戏服务器已启动!');
    console.log('='.repeat(60));
    console.log('');
    console.log(`📱 HTTP 本机访问: http://localhost:${HTTP_PORT}`);
    console.log(`📱 HTTP 手机访问: http://${localIP}:${HTTP_PORT}`);
    console.log('');
    
    const httpsServer = createServer(true);
    if (httpsServer) {
        httpsServer.listen(HTTPS_PORT, HOST, () => {
            console.log(`🔒 HTTPS 本机访问: https://localhost:${HTTPS_PORT}`);
            console.log(`🔒 HTTPS 手机访问: https://${localIP}:${HTTPS_PORT}`);
            console.log('');
            console.log('⚠️  iOS设备请使用HTTPS地址访问以启用运动传感器');
            console.log('⚠️  首次访问HTTPS时需要信任证书');
            console.log('');
            printTips();
        });
    } else {
        console.log('⚠️  HTTPS未启用');
        console.log('   iOS设备运动传感器需要HTTPS');
        console.log('   运行 ./generate-cert.sh 生成证书');
        console.log('');
        printTips();
    }
});

function printTips() {
    console.log('🎮 控制方式:');
    console.log('   - 手机: 摇晃设备控制小球滚动');
    console.log('   - 电脑: 方向键或WASD键控制');
    console.log('   - 触屏: 触摸并拖动控制方向');
    console.log('');
    console.log('按 Ctrl+C 停止服务器');
    console.log('='.repeat(60));
}
