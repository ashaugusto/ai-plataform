#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Iniciando deploy...${NC}"

# Atualizar código do GitHub
echo -e "${GREEN}Atualizando código do repositório...${NC}"
cd /var/www/ai-platform
git fetch origin
git reset --hard origin/main

# Instalar dependências
echo -e "${GREEN}Instalando dependências...${NC}"
npm install

# Executar migrações do banco de dados
echo -e "${GREEN}Executando migrações do banco de dados...${NC}"
npx prisma generate
npx prisma db push

# Construir aplicação
echo -e "${GREEN}Construindo aplicação...${NC}"
npm run build

# Reiniciar aplicação
echo -e "${GREEN}Reiniciando aplicação...${NC}"
pm2 restart ai-platform

echo -e "${GREEN}Deploy concluído com sucesso!${NC}"