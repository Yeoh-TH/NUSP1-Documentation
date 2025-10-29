#!/usr/bin/env node

import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function updateBasePaths() {
    const docsDir = join(process.cwd(), 'docs');
    const basePath = '/NUSP1-Documentation/';
    
    try {
        // Get all HTML files in the docs directory
        const files = await fs.readdir(docsDir);
        const htmlFiles = files.filter(file => file.endsWith('.html'));
        
        for (const file of htmlFiles) {
            const filePath = join(docsDir, file);
            let content = await fs.readFile(filePath, 'utf8');
            
            // Update relative paths to include base path
            content = content.replace(/href="(?!http|#|\/NUSP1-Documentation)([^"]+)"/g, `href="${basePath}$1"`);
            content = content.replace(/src="(?!http|#|\/NUSP1-Documentation)([^"]+)"/g, `src="${basePath}$1"`);
            
            await fs.writeFile(filePath, content);
            console.log(`Updated paths in ${file}`);
        }
        
        console.log('All HTML files updated successfully');
    } catch (error) {
        console.error('Error updating paths:', error);
        process.exit(1);
    }
}

updateBasePaths();