#!/usr/bin/env node

import { MaestroInitController } from '../../src/App/Controllers/MaestroInitController';
import { MaestroMergeController } from '../../src/App/Controllers/MaestroMergeController';
import { MaestroUpdateController } from '../../src/App/Controllers/MaestroUpdateController';

const args = process.argv.slice(2);
const currentDirectory = process.cwd(); // Pega o diretório atual que o CMD está aberto

if (args.includes('--init') && !args.includes("upload") && !args.includes("merge")) {
  const maestroController = new MaestroInitController(false);
  maestroController.execute(currentDirectory);
}

if (args.includes("--upload") && !args.includes("init") && !args.includes("merge")) {
  const maestroController = new MaestroUpdateController(false);
  maestroController.execute(currentDirectory);
}

if (args.includes("--merge") && !args.includes("init") && !args.includes("upload")) {
  const maestroController = new MaestroMergeController(false);
  maestroController.execute(currentDirectory);
}
