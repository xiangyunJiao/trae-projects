#!/bin/bash

echo "🔐 正在生成自签名SSL证书..."

mkdir -p certs

cd certs

openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem \
    -days 365 -nodes \
    -subj "/CN=localhost"

echo ""
echo "✅ 证书生成完成！"
echo "📄 证书文件: certs/cert.pem"
echo "🔑 密钥文件: certs/key.pem"
echo ""
echo "⚠️  iOS信任证书步骤："
echo "   1. 在Safari中访问 https://<电脑IP>:3001"
echo "   2. 点击"显示详细信息" → "访问此网站""
echo "   3. 或者在 设置 → 通用 → 关于本机 → 证书信任设置 中信任"
echo ""
echo "现在运行 npm start 启动服务器"
