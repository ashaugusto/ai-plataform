# Guia de Troubleshooting

## O que é Troubleshooting?

Troubleshooting é o processo de identificar, diagnosticar e resolver problemas em um sistema. É como ser um "detetive técnico" que:
1. Identifica que algo está errado
2. Investiga a causa
3. Aplica a solução

## Problemas Comuns e Soluções

### 1. Site Fora do Ar

**Sintomas:**
- Página não carrega
- Erro 502 Bad Gateway
- Erro 503 Service Unavailable

**Verificações:**
```bash
# Verificar status do Nginx
systemctl status nginx

# Verificar status da aplicação
pm2 status

# Verificar logs
pm2 logs ai-platform
tail -f /var/log/nginx/error.log
```

**Soluções Comuns:**
```bash
# Reiniciar Nginx
systemctl restart nginx

# Reiniciar aplicação
pm2 restart ai-platform

# Se necessário, reiniciar servidor
sudo reboot
```

### 2. Problemas com Banco de Dados

**Sintomas:**
- Erros ao salvar dados
- Páginas carregando parcialmente
- Erros de conexão

**Verificações:**
```bash
# Status do MySQL
systemctl status mysql

# Verificar conexões
mysql -u root -p -e "SHOW PROCESSLIST;"

# Verificar logs
tail -f /var/log/mysql/error.log
```

**Soluções Comuns:**
```bash
# Reiniciar MySQL
systemctl restart mysql

# Verificar espaço em disco
df -h

# Reparar tabelas (se necessário)
mysqlcheck -u root -p --auto-repair ai_platform
```

### 3. Problemas de Performance

**Sintomas:**
- Site lento
- Alto uso de CPU/memória
- Timeouts

**Verificações:**
```bash
# Monitorar recursos
htop

# Verificar uso de disco
df -h
du -sh /var/www/ai-platform/*

# Verificar logs de performance do Nginx
tail -f /var/log/nginx/access.log
```

**Soluções Comuns:**
```bash
# Limpar cache do Node.js
npm cache clean --force

# Limpar logs antigos
find /var/log -type f -name "*.log" -mtime +30 -delete

# Otimizar banco de dados
mysqlcheck -o -u root -p ai_platform
```

## Exemplos Práticos de Uso

### 1. Análise de Perfil LinkedIn

**Como Usar:**
1. Faça login na plataforma
2. Acesse "LinkedIn Analyzer"
3. Cole URL do perfil LinkedIn
4. Cole descrição da vaga
5. Clique em "Analyze"

**Se der erro:**
- Verifique se a URL é válida
- Confirme se há créditos disponíveis
- Verifique logs da API

### 2. Geração de Carta de Motivação

**Como Usar:**
1. Acesse "Motivation Letter"
2. Preencha informações do perfil
3. Adicione descrição da vaga
4. Clique em "Generate"

**Se der erro:**
- Verifique limite de caracteres
- Confirme conexão com OpenAI
- Verifique créditos da API

### 3. Análise de Currículo

**Como Usar:**
1. Acesse "Resume Analysis"
2. Upload do currículo ou cole texto
3. Clique em "Analyze"

**Se der erro:**
- Verifique formato do arquivo
- Confirme tamanho do arquivo
- Verifique permissões

## Dicas de Manutenção Preventiva

1. **Monitoramento Regular**
   ```bash
   # Verificar espaço em disco
   df -h
   
   # Verificar uso de memória
   free -m
   
   # Verificar logs de erro
   tail -f /var/log/nginx/error.log
   ```

2. **Backups Regulares**
   ```bash
   # Backup do banco
   mysqldump -u root -p ai_platform > backup.sql
   
   # Backup de arquivos
   tar -czf /backup/files.tar.gz /var/www/ai-platform
   ```

3. **Atualizações**
   ```bash
   # Atualizar sistema
   apt update && apt upgrade -y
   
   # Atualizar dependências
   npm update
   ```

## Recursos Adicionais

### Vídeos Tutoriais (A serem criados)
1. Instalação do Sistema
2. Configuração Inicial
3. Manutenção Básica
4. Resolução de Problemas Comuns

### Documentação Relacionada
- [Guia de Instalação](./INSTALLATION_GUIDE.md)
- [Guia Detalhado](./DETAILED_GUIDE.md)
- [Workflow](./WORKFLOW.md)

## Contatos de Suporte
- Suporte Técnico: [A ser definido]
- E-mail: [A ser definido]
- Chat: [A ser implementado]