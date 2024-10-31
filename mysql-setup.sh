#!/bin/bash

# Atualizar configuração do MySQL para permitir conexões externas
sudo sed -i 's/bind-address\s*=\s*127.0.0.1/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf

# Reiniciar MySQL
sudo systemctl restart mysql

# Executar script SQL
mysql -u root -p'Cerrado@1Ubuntu' < setup-database.sql

echo "Configuração do MySQL concluída!"