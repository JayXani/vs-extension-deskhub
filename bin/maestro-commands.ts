#!/usr/bin/env node

import { MaestroInitController } from '../src/App/Controllers/MaestroInitController';
import { MaestroMergeController } from '../src/App/Controllers/MaestroMergeController';
import { MaestroUpdateController } from '../src/App/Controllers/MaestroUpdateController';

const args = process.argv.slice(2);
const currentDirectory = process.cwd(); // Pega o diretório atual que o CMD está aberto
const commandsController = {
  __init: new MaestroInitController(false),
  __upload: new MaestroUpdateController(false),
  __merge: new MaestroMergeController(false)
};
const command = args.find(arg => Object.keys(commandsController).includes(`__${arg.replace('--', '')}`))?.replace('--', '');
if (!command){
  console.log('Comando inválido. Use: init, upload ou merge.');
  process.exit(1);
}
commandsController[`__${command}`]?.execute(currentDirectory);