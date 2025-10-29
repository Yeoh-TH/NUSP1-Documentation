#!/usr/bin/env node

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function fixPaths() {
    const docsDir = join(process.cwd(), 'docs');
    
    try {
        // Get all HTML files in the docs directory
        const files = await fs.readdir(docsDir);
        const htmlFiles = files.filter(file => file.endsWith('.html'));
        
        for (const file of htmlFiles) {
            const filePath = join(docsDir, file);
            let content = await fs.readFile(filePath, 'utf8');
            
            // Update paths to reflect new directory structure
            content = content.replace(/href="([^"]*\.css)"/g, 'href="css/$1"');
            content = content.replace(/src="([^"]*\.js)"/g, 'src="js/$1"');
            content = content.replace(/href="favicon \(7\)\.ico"/g, 'href="assets/favicon (7).ico"');
            content = content.replace(/src="logo2\.png"/g, 'src="assets/logo2.png"');
            content = content.replace(/src="doxygen\.svg"/g, 'src="assets/doxygen.svg"');
            
            // Special case for search paths that should stay in search/
            content = content.replace(/href="css\/search\/search\.css"/g, 'href="search/search.css"');
            content = content.replace(/src="js\/search\/([^"]+)"/g, 'src="search/$1"');
            
            await fs.writeFile(filePath, content);
            console.log(`Updated paths in ${file}`);
        }
        
        console.log('All HTML files updated successfully');
    } catch (error) {
        console.error('Error fixing paths:', error);
        process.exit(1);
    }
}

fixPaths();