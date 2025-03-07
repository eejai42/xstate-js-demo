import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// Resolve directory paths reliably
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set directory explicitly (traffic-light-demo1)
const machineDir = __dirname; 

const originalFilePath = path.join(machineDir, 'xstate.js');
const cleanedFilePath = path.join(machineDir, 'xstate-cleaned.js');
const jsonOutputPath = path.join(machineDir, 'machine.json');

// Load original file contents as text
let code = fs.readFileSync(originalFilePath, 'utf8');

// Remove ".withConfig({...})" if it exists using regex
const fixedCode = code.replace(/\.withConfig\s*\([\s\S]*?\);?$/, ';');

// Write cleaned file explicitly to the correct folder
fs.writeFileSync(cleanedFilePath, fixedCode);

// Dynamically import the cleaned file using correct file URL
import(pathToFileURL(cleanedFilePath)).then(({ machine }) => {
  fs.writeFileSync(jsonOutputPath, JSON.stringify(machine.config, null, 5));
  console.log('✅ machine.json exported successfully.');

  // Run your CLI command explicitly in the correct folder
  try {
    execSync('ssotme -build', { stdio: 'inherit', cwd: machineDir });
    console.log('✅ ssotme -build executed successfully.');
  } catch (error) {
    console.error('❌ Error running ssotme -build:', error);
  }

  // Clean up temporary file explicitly
  fs.unlinkSync(cleanedFilePath);
}).catch(err => {
  console.error('❌ Error importing the cleaned machine:', err);
});
