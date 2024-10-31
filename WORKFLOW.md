# Tutorial de Fluxo de Desenvolvimento

## 1. Ambiente de Desenvolvimento (StackBlitz)

O StackBlitz é nosso ambiente de desenvolvimento e teste. Aqui podemos:
- Desenvolver e testar código em tempo real
- Visualizar mudanças instantaneamente
- Colaborar no desenvolvimento

## 2. Controle de Versão (GitHub)

Repositório: https://github.com/ashaugusto/ai-plataform

### Comandos para Atualizar GitHub:
```bash
git add .
git commit -m "descrição das alterações"
git push origin main
```

## 3. Ambiente de Produção (VPS Ubuntu)

IP: 178.128.146.57
Usuário: root
Senha: Cerrado@1Ubuntu

### Configurações do Banco de Dados:
- MySQL
- Usuário: root
- Senha: Cerrado@1Ubuntu
- Database: ai_platform

### Configurações da API:
- OpenAI API Key: sua-chave-api-aqui

## 4. Fluxo de Trabalho

1. **Desenvolvimento (StackBlitz)**
   - Desenvolver novas funcionalidades
   - Testar em tempo real
   - Validar funcionamento

2. **Versionamento (GitHub)**
   - Commit das alterações
   - Push para o repositório
   - Manter histórico de mudanças

3. **Deploy (VPS)**
   - Conectar via SSH
   - Atualizar código
   - Reiniciar serviços

### Comandos para Deploy:

```bash
# Conectar à VPS
ssh root@178.128.146.57

# Navegar até o diretório do projeto
cd /var/www/ai-platform

# Atualizar código
git pull origin main

# Instalar dependências
npm install

# Atualizar banco de dados
npx prisma generate
npx prisma db push

# Reconstruir aplicação
npm run build

# Reiniciar aplicação
pm2 restart ai-platform
```

## 5. Observações Importantes

### Pendências para Implementação Futura:
- Sistema de envio de e-mails (SMTP)
- Integração com gateway de pagamento (Stripe)
- Sistema de renovação automática de assinaturas

### Segurança:
- Manter API keys seguras
- Não compartilhar credenciais
- Usar HTTPS em produção

### Manutenção:
- Monitorar logs
- Backup regular do banco de dados
- Atualizar dependências

## 6. Scripts de Automação

Dois scripts principais para automação:

1. `deploy.sh`: Executa o deploy na VPS
2. `auto-deploy.sh`: Atualiza GitHub e faz deploy automático

Para usar:
```bash
# Deploy manual
./deploy.sh

# Deploy automático com commit
./auto-deploy.sh "mensagem do commit"
```