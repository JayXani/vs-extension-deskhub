#!/usr/bin/env node


import { MaestroInitService } from '../src/Services/MaestroInitService';

const args = process.argv.slice(2);

if (args.includes('--init')) {
  const maestroService = new MaestroInitService();
  maestroService.run(__dirname, false);
}
