#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Função para verificar erros
check_error() {
    if [ $? -ne 0 ]; then
        echo -e "${RED}$1${NC}"
        exit 1
    fi
}

# Função para logging
log() {
    echo -e "${GREEN}$1${NC}"
}

# 1. Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Por favor, execute como root${NC}"
    exit 1
fi

# 2. Atualizar sistema
log "Atualizando sistema..."
apt update && apt upgrade -y
check_error "Falha na atualização do sistema"

# 3. Instalar dependências básicas
log "Instalando dependências básicas..."
apt install -y curl git build-essential ufw
check_error "Falha na instalação das dependências básicas"

# 4. Instalar Node.js
log "Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
check_error "Falha na instalação do Node.js"

# 5. Instalação do MySQL
log "Instalando MySQL..."
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql
check_error "Falha na instalação do MySQL"

# 6. Configuração inicial do MySQL
log "Configurando MySQL..."
MYSQL_ROOT_PASSWORD="Cerrado@1Ubuntu"
# Usar -p com a senha diretamente nos comandos MySQL
mysql -u root -p${MYSQL_ROOT_PASSWORD} << EOF
CREATE DATABASE IF NOT EXISTS ai_platform;
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF
check_error "Falha na configuração do MySQL"

# Configurar MySQL para permitir conexões externas
log "Configurando MySQL para conexões externas..."
sed -i 's/bind-address.*=.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf

# Reiniciar MySQL para aplicar as alterações
systemctl restart mysql
check_error "Falha ao reiniciar MySQL"

# Verificar se a configuração funcionou
mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "SELECT 'MySQL configurado com sucesso!' as Message;"
check_error "Falha ao verificar configuração do MySQL"

# 7. Configurar diretório da aplicação
log "Configurando diretório da aplicação..."
APP_DIR="/var/www/ai-platform"
if [ -d "$APP_DIR" ]; then
    log "Removendo diretório existente..."
    rm -rf "$APP_DIR"
fi
mkdir -p "$APP_DIR"

# 8. Clonar repositório
log "Clonando repositório..."
git clone https://github.com/ashaugusto/ai-plataform.git "$APP_DIR"
check_error "Falha ao clonar repositório"
cd "$APP_DIR"

# Verificar e atualizar package.json se necessário
log "Atualizando package.json..."
cat > package.json << EOL
{
  "name": "nextjs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@auth/prisma-adapter": "latest",
    "@prisma/client": "latest",
    "@radix-ui/react-checkbox": "latest",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-label": "latest",
    "@radix-ui/react-progress": "latest",
    "@radix-ui/react-select": "latest",
    "@radix-ui/react-separator": "latest",
    "@radix-ui/react-slot": "latest",
    "@radix-ui/react-toast": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "lucide-react": "latest",
    "next": "latest",
    "next-auth": "latest",
    "react": "latest",
    "react-dom": "latest",
    "tailwind-merge": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "typescript": "latest"
  }
}
EOL
check_error "Falha na atualização do package.json"

# 9. Instalar dependências do projeto
log "Instalando dependências do projeto..."
npm install
check_error "Falha na instalação das dependências do projeto"

# 10. Instalar PM2 globalmente
log "Instalando PM2..."
npm install -g pm2
check_error "Falha na instalação do PM2"

# 11. Configurar ambiente
log "Configurando ambiente..."
cat > .env << EOL
DATABASE_URL="mysql://root:${MYSQL_ROOT_PASSWORD}@localhost:3306/ai_platform"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://178.128.146.57:3000"
OPENAI_API_KEY="sk-NpiTlz-AchZ2yIrvuQ-V7CLWkjwgupDhl5b9_Yc6IhT3BlbkFJUPw24PgkIh5jLAWb8XpKEyfmhUXFRaVNQHiS5xuGUA"
EOL
check_error "Falha na configuração do ambiente"

# Instalar dependências específicas
log "Instalando dependências do projeto..."

# Primeiro, limpar cache do npm para evitar conflitos
npm cache clean --force

# Instalar todas as dependências necessárias de uma vez
npm install \
  next-auth@latest \
  @auth/prisma-adapter@latest \
  @prisma/client@latest \
  @radix-ui/react-checkbox@latest \
  @radix-ui/react-progress@latest \
  @radix-ui/react-dialog@latest \
  @radix-ui/react-label@latest \
  @radix-ui/react-select@latest \
  @radix-ui/react-slot@latest \
  @radix-ui/react-toast@latest \
  @radix-ui/react-separator@latest \
  @radix-ui/react-icons@latest \
  lucide-react@latest \
  class-variance-authority@latest \
  clsx@latest \
  tailwind-merge@latest \
  tailwindcss@latest \
  postcss@latest \
  autoprefixer@latest \
  @tanstack/react-table@latest \
  date-fns@latest \
  stripe@latest \
  react@latest \
  react-dom@latest \
  next@latest \
  --save
# Instalar dependências adicionais
log "Instalando dependências adicionais..."
npm install \
  recharts@latest \
  react-hook-form@latest \
  @hookform/resolvers@latest \
  zod@latest \
  --save

check_error "Falha na instalação das dependências adicionais"

# Instalar todas as dependências necessárias
log "Instalando dependências do projeto..."
npm install \
  next-themes@latest \
  @radix-ui/react-avatar@latest \
  @radix-ui/react-dropdown-menu@latest \
  @radix-ui/react-tabs@latest \
  bcryptjs@latest \
  @types/bcryptjs@latest \
  recharts@latest \
  react-hook-form@latest \
  @hookform/resolvers@latest \
  zod@latest \
  stripe@latest \
  @radix-ui/react-checkbox@latest \
  @radix-ui/react-dialog@latest \
  @radix-ui/react-label@latest \
  @radix-ui/react-progress@latest \
  @radix-ui/react-select@latest \
  @radix-ui/react-separator@latest \
  @radix-ui/react-slot@latest \
  @radix-ui/react-toast@latest \
  class-variance-authority@latest \
  clsx@latest \
  lucide-react@latest \
  tailwind-merge@latest \
  --save
check_error "Falha na instalação das dependências"

# Instalar todas as dependências necessárias
log "Instalando dependências do projeto..."
npm install \
  next-themes@latest \
  @radix-ui/react-avatar@latest \
  @radix-ui/react-dropdown-menu@latest \
  @radix-ui/react-tabs@latest \
  bcryptjs@latest \
  @types/bcryptjs@latest \
  recharts@latest \
  react-hook-form@latest \
  @hookform/resolvers@latest \
  zod@latest \
  stripe@latest \
  @radix-ui/react-checkbox@latest \
  @radix-ui/react-dialog@latest \
  @radix-ui/react-label@latest \
  @radix-ui/react-progress@latest \
  @radix-ui/react-select@latest \
  @radix-ui/react-separator@latest \
  @radix-ui/react-slot@latest \
  @radix-ui/react-toast@latest \
  class-variance-authority@latest \
  clsx@latest \
  lucide-react@latest \
  tailwind-merge@latest \
  openai@latest \
  next-auth@latest \
  @prisma/client@latest \
  --save

# Instalar dependências de desenvolvimento
npm install -D prisma@latest typescript@latest @types/node@latest @types/react@latest @types/react-dom@latest autoprefixer@latest postcss@latest tailwindcss@latest eslint@latest

# Inicializar Prisma (se necessário)
npx prisma generate

check_error "Falha na instalação das dependências"

# Configurar fonte Inter no next.config.js
log "Configurando next.config.js..."
cat > next.config.js << EOL
/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: false,
  experimental: {
    forceSwcTransforms: true,
  }
}
module.exports = nextConfig
EOL
check_error "Falha na configuração do next.config.js"

# Corrigir o arquivo do webhook do Stripe
log "Corrigindo webhook do Stripe..."
cat > app/api/stripe/webhook/route.ts << EOL
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse("Webhook error: " + error.message, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Atualizar o status da assinatura do usuário
    await prisma.user.update({
      where: {
        id: session?.metadata?.userId,
      },
      data: {
        subscriptionStatus: "active",
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
EOL

check_error "Falha ao corrigir webhook do Stripe"

# Instalar dependências de desenvolvimento
npm install \
  @types/node@latest \
  @types/react@latest \
  @types/react-dom@latest \
  typescript@latest \
  --save-dev

check_error "Falha na instalação das dependências do projeto"

# Configurar Tailwind
log "Configurando Tailwind..."
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

cat > postcss.config.js << EOL
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOL

check_error "Falha na configuração do Tailwind"
check_error "Falha na instalação das dependências do projeto"

# Instalar dependências gerais do package.json
npm install
check_error "Falha na instalação das dependências gerais"


# 11.5 Configurar Prisma e Schema
log "Configurando Prisma e Schema..."

# Instalar prisma globalmente
npm install -g prisma

# Criar diretório prisma se não existir
mkdir -p prisma

# Configurar schema.prisma com modelo completo
cat > prisma/schema.prisma << EOL
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  emailVerified DateTime?
  image         String?
  hashedPassword String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  accounts Account[]
  conversations Conversation[]
  subscriptions Subscription[]
  supportTickets SupportTicket[]
}

model Account {
  id                 String  @id @default(uuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Conversation {
  id            String    @id @default(uuid())
  userId        String
  createdAt     DateTime  @default(now())
  lastMessageAt DateTime  @default(now())
  name          String
  messages      Message[]

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Message {
  id             String       @id @default(uuid())
  conversationId String
  content        String       @db.Text
  role           String
  createdAt      DateTime     @default(now())

  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
}

model Subscription {
  id                     String    @id @default(uuid())
  userId                 String
  stripeCustomerId       String?   @unique @map(name: "stripe_customer_id")
  stripeSubscriptionId   String?   @unique @map(name: "stripe_subscription_id")
  stripePriceId         String?   @map(name: "stripe_price_id")
  stripeCurrentPeriodEnd DateTime? @map(name: "stripe_current_period_end")

  user                   User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model SupportTicket {
  id          String   @id @default(uuid())
  userId      String
  title       String
  description String   @db.Text
  status      String   @default("OPEN")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages    SupportMessage[]
}

model SupportMessage {
  id        String   @id @default(uuid())
  ticketId  String
  content   String   @db.Text
  isStaff   Boolean  @default(false)
  createdAt DateTime @default(now())
  
  ticket    SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
}
EOL
check_error "Falha na criação do schema Prisma"

# Configurar lib/prisma.ts
mkdir -p lib
cat > lib/prisma.ts << EOL
import { PrismaClient } from '@prisma/client';
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
EOL

# Sequência correta de comandos Prisma
log "Executando comandos Prisma..."
npx prisma format
check_error "Falha ao formatar schema Prisma"

npx prisma validate
check_error "Falha na validação do schema Prisma"

npx prisma generate
check_error "Falha ao gerar cliente Prisma"

npx prisma db push
check_error "Falha ao aplicar migrações Prisma"

# 14. Configurar Nginx
log "Instalando e configurando Nginx..."
apt install -y nginx
check_error "Falha na instalação do Nginx"

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
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
check_error "Falha na configuração do Nginx"

# 15. Configurando PM2
log "Configurando PM2..."
pm2 start npm --name "ai-platform" -- start
pm2 startup
pm2 save
check_error "Falha na configuração do PM2"

# 16. Configurando Firewall
log "Configurando Firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable
check_error "Falha na configuração do Firewall"

# 17. Configurando permissões
log "Configurando permissões..."
chown -R www-data:www-data /var/www/ai-platform
chmod -R 755 /var/www/ai-platform

# Script de monitoramento
cat > /usr/local/bin/monitor.sh << EOL
#!/bin/bash
df -h
free -m
pm2 status
systemctl status nginx
systemctl status mysql
EOL
chmod +x /usr/local/bin/monitor.sh
#nextconfig
# Configurar next.config.js
log "Configurando next.config.js..."
cat > next.config.js << EOL
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    forceSwcTransforms: true
  }
};

module.exports = nextConfig;
EOL

check_error "Falha na configuração do next.config.js"

# Configurar tailwind.config.js
log "Configurando tailwind.config.js..."
cat > tailwind.config.js << EOL
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
EOL
check_error "Falha no tailwind"

# Configurar globals.css
log "Configurando globals.css..."
cat > app/globals.css << EOL
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
 
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOL
check_error "falha no globals css"

npm install tailwindcss-animate --save-dev

# Construir projeto
log "Construindo projeto..."
npm run build
check_error "Falha na construção do projeto"

log "Instalação concluída com sucesso!"
log "Para monitorar o sistema, execute: /usr/local/bin/monitor.sh"
log "Aplicação está rodando em: http://178.128.146.57"
log "Lembre-se de:"
log "1. Configurar sua chave API OpenAI no arquivo .env"
log "2. Configurar um domínio e SSL (se necessário)"
log "3. Fazer backup regular do banco de dados"

# Exibindo informações importantes
echo -e "\n${YELLOW}Informações importantes:${NC}"
echo -e "MySQL Root Password: $MYSQL_ROOT_PASSWORD"
echo -e "Aplicação URL: http://178.128.146.57"
echo -e "Diretório da Aplicação: $APP_DIR"