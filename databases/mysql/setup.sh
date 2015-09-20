#!/bin/bash
set -e

echo "******SETUPING DATABASES******"

DATABASES=(
  "notification"
  "file"
  "content"
  "version"
  "client001"
  "client002"
  "client003"
)

for DB_NAME in "${DATABASES[@]}"; do

echo "******SETUPING DATABASE [$DB_NAME]****** $MYSQL_USER $MYSQL_PASSWORD"

mysql -u root -p"${MYSQL_ROOT_PASSWORD}" << EOF

CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8 COLLATE utf8_general_ci;
GRANT ALL privileges ON \`$DB_NAME\`.* TO \`$MYSQL_USER\`@`%` IDENTIFIED BY 'password';

EOF

done

echo "******CREATED ALL DATABASES******"
