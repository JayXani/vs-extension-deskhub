#!/usr/bin/env node

//O comando acima permite eu executar o script via comando
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.includes('--init')) {
  const configPath = path.join(process.cwd(), 'maestro.config.json');
  if (fs.existsSync(configPath)) {
    console.log('⚠️ Já existe um maestro.config.json');
    process.exit(1);
  }

  fs.writeFileSync(configPath, JSON.stringify({
      name: 'Nome do maestro',
      key: 'Chave interna do maestro',
      prefixo: 'Prefixo do maestro',
      author: "Nome do autor",
      memoria: {
        BEGIN_init: {},
        CRON: {
          access_token: "token de acesso a Desk Manager"
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
  }, null, 2));
  console.log('✅ maestro.config.json criado!');
}
