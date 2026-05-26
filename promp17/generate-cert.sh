#!/bin/bash

echo "🔐 正在生成自签名SSL证书..."

mkdir -p certs

cd certs

LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="192.168.1.100"
fi

echo "📡 检测到本机IP: $LOCAL_IP"

cat > openssl.cnf << EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = req_ext
x509_extensions = v3_ca

[dn]
CN = ${LOCAL_IP}
O = Ball Maze Game
C = CN

[req_ext]
subjectAltName = @alt_names

[v3_ca]
subjectAltName = @alt_names
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

[alt_names]
IP.1 = ${LOCAL_IP}
IP.2 = 127.0.0.1
DNS.1 = localhost
DNS.2 = localhost.local
EOF

openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem \
    -days 365 -nodes \
    -config openssl.cnf

rm -f openssl.cnf

echo ""
echo "✅ 证书生成完成！"
echo "📄 证书文件: certs/cert.pem"
echo "🔑 密钥文件: certs/key.pem"
echo "🌐 证书包含域名: ${LOCAL_IP}, 127.0.0.1, localhost"
echo ""
echo "⚠️  iOS信任证书步骤："
echo "   1. 在Safari中访问 https://${LOCAL_IP}:3001"
echo "   2. 点击'显示详细信息' → '访问此网站'"
echo "   3. 或者在 设置 → 通用 → 关于本机 → 证书信任设置 中信任"
echo "   4. 首次访问时需要在弹出的提示中点击'继续'或'信任'"
echo ""
echo "现在运行 npm start 启动服务器"
