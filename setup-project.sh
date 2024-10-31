#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configurações
GITHUB_TOKEN="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" # Cole seu token aqui
GITHUB_USER="ashaugusto"
GITHUB_REPO="ai-plataform"
PROJECT_DIR="/var/www/ai-platform"

# Funções de utilidade
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}
error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
    exit 1
}
# Configurar Git global
log "Configurando Git..."
git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"
# Criar diretório do projeto
log "Criando diretório do projeto..."
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR || error "Falha ao acessar diretório do projeto"
# Limpar diretório se existir conteúdo
rm -rf $PROJECT_DIR/*
# Configurar permissões
log "Configurando permissões..."
chown -R www-data:www-data $PROJECT_DIR
chmod -R 755 $PROJECT_DIR
# Clonar repositório
log "Clonando repositório..."
git clone https://github.com/${GITHUB_USER}/${GITHUB_REPO}.git . || error "Falha ao clonar repositório"

# Instalar todas as dependências necessárias
log "Instalando dependências do projeto..."
npm install \
    next@latest \
    react@latest \
    react-dom@latest \
    @auth/prisma-adapter@latest \
    @prisma/client@latest \
    prisma@latest \
    @radix-ui/react-checkbox@latest \
    @radix-ui/react-dialog@latest \
    @radix-ui/react-label@latest \
    @radix-ui/react-progress@latest \
    @radix-ui/react-select@latest \
    @radix-ui/react-separator@latest \
    @radix-ui/react-slot@latest \
    @radix-ui/react-toast@latest \
    @radix-ui/react-icons@latest \
    @radix-ui/react-avatar@latest \
    @radix-ui/react-dropdown-menu@latest \
    @radix-ui/react-tabs@latest \
    @tanstack/react-table@latest \
    class-variance-authority@latest \
    clsx@latest \
    date-fns@latest \
    lucide-react@latest \
    next-themes@latest \
    recharts@latest \
    tailwind-merge@latest \
    tailwindcss@latest \
    autoprefixer@latest \
    postcss@latest \
    react-hook-form@latest \
    @hookform/resolvers@latest \
    zod@latest \
    next-auth@latest \
    bcryptjs@latest \
    @types/bcryptjs@latest \
    typescript@latest \
    @types/node@latest \
    @types/react@latest \
    @types/react-dom@latest \
    eslint@latest \
    stripe@latest \
    openai@latest \
    js2py@latest \
    encoding@latest \
    mysql2@latest \
    && npm install -D prisma@latest typescript@latest @types/node@latest @types/react@latest @types/react-dom@latest autoprefixer@latest postcss@latest tailwindcss@latest eslint@latest || error "Falha ao instalar dependências"

# Instalar dependências de desenvolvimento
log "Instalando dependências de desenvolvimento..."
npm install -D \
 eslint@latest \
  eslint-config-next@latest \
  @typescript-eslint/parser@latest \
  @typescript-eslint/eslint-plugin@latest\
    typescript@latest \
    @types/node@latest \
    @types/react@latest \
    @types/react-dom@latest \
    eslint@latest \
    tailwindcss-animate@latest \
    prisma@latest || error "Falha ao instalar dependências de desenvolvimento"
# Configurar arquivos necessários
log "Configurando arquivos do projeto..."
# Criar arquivo tailwind.config.js
cat > tailwind.config.js << EOL
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL
# Criar arquivo postcss.config.js
cat > postcss.config.js << EOL
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOL
# Configurar variáveis de ambiente
log "Configurando variáveis de ambiente..."
cat > .env << EOL
DATABASE_URL="mysql://root:Cerrado@1Ubuntu@localhost:3306/ai_platform"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://178.128.146.57:3000"
OPENAI_API_KEY="sk-NpiTlz-AchZ2yIrvuQ-V7CLWkjwgupDhl5b9_Yc6IhT3BlbkFJUPw24PgkIh5jLAWb8XpKEyfmhUXFRaVNQHiS5xuGUA"
EOL
# Configurar Prisma
log "Configurando Prisma..."
npx prisma generate || error "Falha ao gerar cliente Prisma"
npx prisma db push || error "Falha ao sincronizar banco de dados"
# Build do projeto
log "Construindo o projeto..."
npm run build || error "Falha ao construir o projeto"
# Configurar PM2
log "Configurando PM2..."
pm2 delete ai-platform || true # Remove instância anterior se existir
pm2 start npm --name "ai-platform" -- start
pm2 startup
pm2 save
# Configurar Nginx
log "Configurando Nginx..."
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
ln -sf /etc/nginx/sites-available/ai-platform /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t || error "Configuração do Nginx inválida"
systemctl restart nginx
log "Setup do projeto concluído com sucesso!"