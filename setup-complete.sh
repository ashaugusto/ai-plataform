#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Função para log
log() {
    echo -e "${GREEN}[SETUP] $1${NC}"
}

# Função para erro
error() {
    echo -e "${RED}[ERRO] $1${NC}"
    exit 1
}

# Função para verificar erros
check_error() {
    if [ $? -ne 0 ]; then
        error "$1"
    fi
}

# 1. Configuração inicial
log "Iniciando setup completo do projeto..."

# Garantir que estamos no diretório correto
cd /var/www/ai-platform || error "Diretório do projeto não encontrado"

# 2. Limpeza inicial
log "Limpando instalações anteriores..."
rm -rf node_modules package-lock.json .next
rm -f .eslintrc.json postcss.config.js tailwind.config.js next.config.js

# 3. Configurar package.json
log "Configurando package.json..."
cat > package.json << EOL
{
  "name": "ai-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
EOL

# 4. Instalar dependências
log "Instalando dependências..."
npm install \
  @auth/prisma-adapter@latest\
    next@latest \
    react@latest \
    react-dom@latest \
    @prisma/client@latest \
    bcryptjs@latest \
    next-auth@latest \
    next-themes@latest \
    openai@latest \
    @radix-ui/react-avatar@latest \
    @radix-ui/react-dropdown-menu@latest \
    @radix-ui/react-tabs@latest \
    @radix-ui/react-dialog@latest \
    @radix-ui/react-label@latest \
    @radix-ui/react-select@latest \
    @radix-ui/react-separator@latest \
    @radix-ui/react-slot@latest \
    @radix-ui/react-toast@latest \
    class-variance-authority@latest \
    clsx@latest \
    tailwind-merge@latest \
    lucide-react@latest \
    zod@latest \
    react-hook-form@latest \
    @hookform/resolvers@latest \
    recharts@latest
    

check_error "Falha ao instalar dependências principais"

# 5. Instalar dependências de desenvolvimento
log "Instalando dependências de desenvolvimento..."
npm install -D \
    typescript@latest \
    @types/node@latest \
    @types/react@latest \
    @types/react-dom@latest \
    @types/bcryptjs@latest \
    autoprefixer@latest \
    postcss@latest \
    tailwindcss@latest \
    eslint@latest \
    eslint-config-next@latest \
    prisma@latest \
    tailwindcss-animate@latest \
    @radix-ui/react-icons@latest \
  @tanstack/react-table@latest \
  date-fns@latest \
  @radix-ui/react-checkbox@latest \
  @radix-ui/react-progress@latest \
  @radix-ui/react-dropdown-menu@latest \
  @radix-ui/react-dialog@latest \
  @radix-ui/react-label@latest \
  @radix-ui/react-select@latest \
  @radix-ui/react-separator@latest \
  @radix-ui/react-slot@latest \
  @radix-ui/react-toast@latest \
  @radix-ui/react-avatar@latest \
  @radix-ui/react-tabs@latest \
  @hookform/resolvers@latest \
  @prisma/client@latest \
  @tanstack/match-sorter-utils@latest \
  @tanstack/table-core@latest \
  recharts@latest \
  react-hook-form@latest \
  zod@latest \
  stripe@latest \
  openai@latest \
  next-auth@latest \
  bcryptjs@latest \
  @types/bcryptjs@latest \
  next-themes@latest \
  class-variance-authority@latest \
  clsx@latest \
  lucide-react@latest \
  tailwind-merge@latest \
  tailwindcss-animate@latest

check_error "Falha ao instalar dependências de desenvolvimento"

# 6. Configurar ESLint
log "Configurando ESLint..."
cat > .eslintrc.json << EOL
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@next/next/no-html-link-for-pages": "off",
    "react/no-unescaped-entities": "off"
  }
}
EOL

# 7. Configurar PostCSS
log "Configurando PostCSS..."
cat > postcss.config.js << EOL
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOL

# 8. Configurar Tailwind
log "Configurando Tailwind..."
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

# 9. Configurar Next.js
log "Configurando Next.js..."
cat > next.config.js << EOL
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    forceSwcTransforms: true
  }
}

module.exports = nextConfig
EOL

# 10. Configurar globals.css
log "Configurando globals.css..."
mkdir -p app
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
EOL

# 11. Configurar TypeScript
log "Configurando TypeScript..."
npx tsc --init

# 12. Gerar Prisma Client
log "Configurando Prisma..."
npx prisma generate
check_error "Falha ao gerar cliente Prisma"

# 13. Build do projeto
log "Construindo o projeto..."
npm run build
check_error "Falha ao construir o projeto"

log "Setup completo realizado com sucesso!"
