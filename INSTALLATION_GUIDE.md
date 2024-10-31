# Guia de Instalação e Implementação

## Índice
1. [Requisitos do Sistema](#requisitos-do-sistema)
2. [Scripts de Instalação](#scripts-de-instalação)
3. [Processo de Implementação](#processo-de-implementação)
4. [Monitoramento e Manutenção](#monitoramento-e-manutenção)

## Requisitos do Sistema

### Hardware Mínimo Recomendado
- CPU: 2 cores
- RAM: 4GB
- Armazenamento: 20GB SSD

### Software Necessário
- Ubuntu 24.04 LTS
- Node.js 20.x
- MySQL 8.0
- Nginx
- PM2 (Gerenciador de processos)

## Scripts de Instalação

### 1. Script Principal de Instalação (install.sh)

```bash
#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Iniciando instalação do AI Platform...${NC}"

# Atualizar sistema
echo -e "${GREEN}Atualizando sistema...${NC}"
apt update && apt upgrade -y

# Instalar dependências
echo -e "${GREEN}Instalando dependências...${NC}"
apt install -y curl git build-essential

# Instalar Node.js 20.x
echo -e "${GREEN}Instalando Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Instalar MySQL
echo -e "${GREEN}Instalando MySQL...${NC}"
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql

# Configurar MySQL
echo -e "${GREEN}Configurando MySQL...${NC}"
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Cerrado@1Ubuntu';"
mysql -e "CREATE DATABASE ai_platform;"
mysql -e "FLUSH PRIVILEGES;"

# Clonar repositório
echo -e "${GREEN}Clonando repositório...${NC}"
git clone https://github.com/ashaugusto/ai-plataform.git /var/www/ai-platform
cd /var/www/ai-platform

# Instalar dependências do projeto
echo -e "${GREEN}Instalando dependências do projeto...${NC}"
npm install

# Instalar PM2 globalmente
echo -e "${GREEN}Instalando PM2...${NC}"
npm install -g pm2

# Configurar ambiente
echo -e "${GREEN}Configurando ambiente...${NC}"
cat > .env << EOL
DATABASE_URL="mysql://root:Cerrado@1Ubuntu@localhost:3306/ai_platform"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://178.128.146.57:3000"
OPENAI_API_KEY="sua-chave-api-aqui"
EOL

# Executar migrações do Prisma
echo -e "${GREEN}Executando migrações do banco de dados...${NC}"
npx prisma generate
npx prisma db push

# Construir projeto
echo -e "${GREEN}Construindo projeto...${NC}"
npm run build

# Configurar PM2
echo -e "${GREEN}Configurando PM2...${NC}"
pm2 start npm --name "ai-platform" -- start
pm2 startup
pm2 save

# Configurar Nginx
echo -e "${GREEN}Configurando Nginx...${NC}"
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
```

### 2. Script de Deploy (deploy.sh)

```bash
#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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
```

### 3. Script de Auto-Deploy (auto-deploy.sh)

```bash
#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configurações
VPS_USER="root"
VPS_HOST="178.128.146.57"
DEPLOY_PATH="/var/www/ai-platform"

# Função para exibir mensagens
show_message() {
    echo -e "${GREEN}$1${NC}"
}

# Atualizar GitHub
show_message "Atualizando GitHub..."
git add .
git commit -m "$1"
git push origin main

if [ $? -eq 0 ]; then
    show_message "GitHub atualizado com sucesso!"
else
    echo -e "${RED}Erro ao atualizar GitHub${NC}"
    exit 1
fi

# Deploy na VPS
show_message "Iniciando deploy na VPS..."
ssh $VPS_USER@$VPS_HOST "cd $DEPLOY_PATH && ./deploy.sh"

if [ $? -eq 0 ]; then
    show_message "Deploy concluído com sucesso!"
else
    echo -e "${RED}Erro durante o deploy${NC}"
    exit 1
fi
```

## Processo de Implementação

### 1. Preparação do Servidor
1. Acesse o servidor via SSH:
   ```bash
   ssh root@178.128.146.57
   ```

2. Baixe o script de instalação:
   ```bash
   wget https://raw.githubusercontent.com/ashaugusto/ai-plataform/main/install.sh
   ```

3. Dê permissão de execução:
   ```bash
   chmod +x install.sh
   ```

4. Execute o script:
   ```bash
   ./install.sh
   ```

### 2. Verificação da Instalação
1. Verifique se o MySQL está rodando:
   ```bash
   systemctl status mysql
   ```

2. Verifique se o Nginx está rodando:
   ```bash
   systemctl status nginx
   ```

3. Verifique os processos PM2:
   ```bash
   pm2 list
   ```

### 3. Configuração de Domínio (Opcional)
1. Atualize o arquivo Nginx:
   ```bash
   nano /etc/nginx/sites-available/ai-platform
   ```

2. Substitua o IP pelo domínio
3. Reinicie o Nginx:
   ```bash
   systemctl restart nginx
   ```

## Monitoramento e Manutenção

### 1. Logs do Sistema
- Logs do Nginx:
  ```bash
  tail -f /var/log/nginx/error.log
  ```

- Logs da Aplicação:
  ```bash
  pm2 logs ai-platform
  ```

### 2. Backup do Banco de Dados
```bash
# Backup
mysqldump -u root -p ai_platform > backup.sql

# Restauração
mysql -u root -p ai_platform < backup.sql
```

### 3. Atualização do Sistema
```bash
# Atualizar sistema
apt update && apt upgrade -y

# Reiniciar serviços
systemctl restart mysql
systemctl restart nginx
pm2 restart ai-platform
```

### 4. Monitoramento de Recursos
```bash
# Uso de CPU e Memória
htop

# Espaço em Disco
df -h

# Status dos Serviços
systemctl status mysql
systemctl status nginx
pm2 status
```

## Observações Importantes

1. **Segurança**
   - Mantenha o sistema atualizado
   - Use senhas fortes
   - Configure firewall
   - Implemente HTTPS

2. **Backup**
   - Faça backup regular do banco de dados
   - Mantenha cópia do código
   - Documente alterações

3. **Monitoramento**
   - Verifique logs regularmente
   - Monitore uso de recursos
   - Configure alertas

4. **Manutenção**
   - Atualize dependências
   - Limpe logs antigos
   - Otimize banco de dados

## Próximos Passos

1. **Implementações Futuras**
   - Sistema de e-mails
   - Gateway de pagamento
   - Renovação automática

2. **Otimizações**
   - Cache
   - CDN
   - Compressão de assets

3. **Documentação**
   - Manual do usuário
   - API docs
   - Guia de troubleshooting