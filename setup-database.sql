-- Criar usuário com permissão de conexão externa
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'Cerrado@1Ubuntu';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS ai_platform;
USE ai_platform;

-- Configurar charset
ALTER DATABASE ai_platform CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;