#!/usr/bin/env node


import { MaestroInitService } from '../src/Services/MaestroInitService';

const args = process.argv.slice(2);
const currentDirectory = process.cwd(); // Pega o diretório atual que o CMD está aberto
if (args.includes('--init')) {
  const maestroService = new MaestroInitService();
  maestroService.run(currentDirectory, false);
}
