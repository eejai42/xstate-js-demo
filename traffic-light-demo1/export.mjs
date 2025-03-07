
import { machine } from './xstate.js';
import fs from 'fs';

fs.writeFileSync("traffic-light-demo1/machine.json", JSON.stringify(machine, null, 2));

console.log("✅ Machine configuration exported successfully to machine.json!");
