#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Funções de utilidade
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
    exit 1
}

check_root() {
    if [ "$EUID" -ne 0 ]; then 
        error "Por favor, execute como root (sudo)"
    fi
}

# Início da instalação
check_root
log "Iniciando setup do sistema..."

# Atualizar sistema
log "Atualizando sistema..."
apt update && apt upgrade -y || error "Falha ao atualizar sistema"

# Instalar dependências básicas
log "Instalando dependências básicas..."
apt install -y curl git build-essential ufw nginx || error "Falha ao instalar dependências"

# Instalar Node.js 20.x
log "Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs || error "Falha ao instalar Node.js"

# Instalar PM2
log "Instalando PM2..."
npm install -g pm2 || error "Falha ao instalar PM2"

# Instalar e configurar MySQL
log "Instalando MySQL..."
apt install -y mysql-server || error "Falha ao instalar MySQL"
systemctl start mysql
systemctl enable mysql

# Configurar MySQL
MYSQL_ROOT_PASSWORD="Cerrado@1Ubuntu"
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASSWORD';"
mysql -e "CREATE DATABASE IF NOT EXISTS ai_platform;"
mysql -e "CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '$MYSQL_ROOT_PASSWORD';"
mysql -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;"
mysql -e "FLUSH PRIVILEGES;"

# Configurar MySQL para conexões externas
log "Configurando MySQL para conexões externas..."
sed -i 's/bind-address.*=.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
systemctl restart mysql

# Configurar Firewall
log "Configurando Firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 3306
ufw --force enable

log "Setup do sistema concluído com sucesso!"
