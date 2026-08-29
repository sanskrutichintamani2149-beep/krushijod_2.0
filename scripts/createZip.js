import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const projectRoot = process.cwd();
const zipFilename1 = 'krushiजोड-complete.zip';
const zipFilename2 = 'krushijod-complete.zip';

console.log('Packaging KrushiZod source files into clean zip archive...');

// Ensure zip command or PowerShell Compress-Archive runs cleanly
try {
  const excludePaths = ['node_modules', 'dist', '.git', zipFilename1, zipFilename2];
  
  // Create PowerShell Compress-Archive command
  const psCommand = `powershell -Command "Get-ChildItem -Path . -Exclude node_modules,dist,.git,*.zip | Compress-Archive -DestinationPath '${zipFilename1}' -Force; Copy-Item '${zipFilename1}' -Destination '${zipFilename2}' -Force"`;
  
  execSync(psCommand, { cwd: projectRoot, stdio: 'inherit' });
  console.log(`Successfully generated:\n - ${zipFilename1}\n - ${zipFilename2}`);
} catch (err) {
  console.error('Error creating ZIP archive:', err);
}
