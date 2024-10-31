#!/bin/bash
#!/bin/bash:
export GITHUB_TOKEN=""
git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"
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