from node:22-alpine as builder

WORKDIR /app

# 复制项目文件
COPY . .

# 安装依赖
RUN npm install -g pnpm && \
    CI=true pnpm install --frozen-lockfile

# 构建 SDK 包
RUN pnpm --recursive --filter '!@logto/*-sample' build

# 构建 React Sample
RUN cd packages/react-sample && pnpm build

from nginx:alpine

# 从构建镜像复制编译结果
COPY --from=builder /app/packages/react-sample/dist /usr/share/nginx/html

# 创建 Nginx 配置
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    
    # 支持单页应用路由
    location / {
        try_files $uri /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # index.html 不缓存，支持配置更新
    location = /index.html {
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }
}
EOF

# 创建启动脚本
RUN cat > /docker-entrypoint.sh << 'EOF'
#!/bin/sh
set -e

# 如果提供了环境变量，动态注入到 index.html
if [ -n "$LOGTO_APP_ID" ] || [ -n "$LOGTO_ENDPOINT" ]; then
    APP_ID="${LOGTO_APP_ID:-l0ztgtbtuua0vyc5ti5ds}"
    ENDPOINT="${LOGTO_ENDPOINT:-https://jerry-test-logto-api.zeabur.app/}"
    
    # 在 index.html 中注入配置
    sed -i.bak "s|window.__LOGTO_CONFIG__ = {}|window.__LOGTO_CONFIG__ = { APP_ID: '$APP_ID', ENDPOINT: '$ENDPOINT' }|g" /usr/share/nginx/html/index.html
fi

# 启动 Nginx
exec nginx -g "daemon off;"
EOF

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
