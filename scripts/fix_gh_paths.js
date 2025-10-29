#!/usr/bin/env node

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function moveFiles() {
    const docsDir = join(process.cwd(), 'dist');
    
    try {
        // Create .nojekyll file
        await fs.writeFile(join(docsDir, '.nojekyll'), '');

        // Update all HTML files to use absolute paths
        const files = await fs.readdir(docsDir);
        const htmlFiles = files.filter(file => file.endsWith('.html'));
        
        for (const file of htmlFiles) {
            const filePath = join(docsDir, file);
            let content = await fs.readFile(filePath, 'utf8');
            
            // Update paths to be absolute from the root
            content = content.replace(/href="(?!http|#|\/NUSP1-Documentation)([^"]+)"/g, 'href="/NUSP1-Documentation/$1"');
            content = content.replace(/src="(?!http|#|\/NUSP1-Documentation)([^"]+)"/g, 'src="/NUSP1-Documentation/$1"');
            
            await fs.writeFile(filePath, content);
            console.log(`Updated paths in ${file}`);
        }
        
        console.log('All files processed successfully');
    } catch (error) {
        console.error('Error processing files:', error);
        process.exit(1);
    }
}

moveFiles();