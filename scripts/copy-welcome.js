import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy README.md from project root to src-tauri/resources/
const sourcePath = path.join(__dirname, '../README.md');
const targetPath = path.join(__dirname, '../src-tauri/resources/README.md');

try {
    fs.copyFileSync(sourcePath, targetPath);
    console.log('README.md copied successfully to src-tauri/resources/');
} catch (error) {
    console.error('Error copying README.md:', error);
    process.exit(1);
}