#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Iniciando instalação do AI Platform...${NC}"

# Atualizar sistema
apt update && apt upgrade -y

# Instalar dependências
apt install -y curl git build-essential

# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Instalar MySQL
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql

# Configurar MySQL
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Cerrado@1Ubuntu';"
mysql -e "CREATE DATABASE ai_platform;"
mysql -e "FLUSH PRIVILEGES;"

# Clonar repositório
git clone https://github.com/ashaugusto/ai-plataform.git /var/www/ai-platform
cd /var/www/ai-platform

# Instalar dependências do projeto
npm install

# Instalar PM2 globalmente
npm install -g pm2

# Configurar ambiente
cat > .env << EOL
DATABASE_URL="mysql://root:Cerrado@1Ubuntu@localhost:3306/ai_platform"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://178.128.146.57:3000"
OPENAI_API_KEY="sua-chave-api-aqui"
EOL

# Executar migrações do Prisma
npx prisma generate
npx prisma db push

# Construir projeto
npm run build

# Configurar PM2
pm2 start npm --name "ai-platform" -- start
pm2 startup
pm2 save

# Configurar Nginx
apt install -y nginx
cat > /etc/nginx/sites-available/ai-platform << EOL
server {
    listen 80;
    server_name 178.128.146.57;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

ln -s /etc/nginx/sites-available/ai-platform /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo -e "${GREEN}Instalação concluída! O sistema está rodando em http://178.128.146.57${NC}"