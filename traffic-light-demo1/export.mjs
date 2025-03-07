
import { machine } from './xstate.js';
import fs from 'fs';

fs.writeFileSync("machine.json", JSON.stringify(machine, null, 2));

console.log("✅ Machine configuration exported successfully to machine.json!");
