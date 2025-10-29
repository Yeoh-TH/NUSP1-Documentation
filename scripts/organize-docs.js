#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

async function organizeDocs() {
    const docsDir = path.join(process.cwd(), 'docs');
    
    // Create directory structure
    const dirs = ['assets', 'css', 'js', 'search'];
    for (const dir of dirs) {
        await fs.mkdir(path.join(docsDir, dir), { recursive: true });
    }
    
    // Move files from public/
    const publicFiles = await fs.readdir('public');
    for (const file of publicFiles) {
        const ext = path.extname(file);
        let targetDir = docsDir;
        
        if (['.png', '.ico', '.svg'].includes(ext)) {
            targetDir = path.join(docsDir, 'assets');
        } else if (ext === '.css') {
            targetDir = path.join(docsDir, 'css');
        } else if (ext === '.js') {
            targetDir = path.join(docsDir, 'js');
        }
        
        await fs.copyFile(
            path.join('public', file),
            path.join(targetDir, file)
        );
    }
    
    // Move files from src/
    const srcFiles = await fs.readdir('src');
    for (const file of srcFiles) {
        const ext = path.extname(file);
        if (ext === '.html') {
            await fs.copyFile(
                path.join('src', file),
                path.join(docsDir, file)
            );
        }
    }
    
    console.log('Documentation files organized in docs/ directory');
}

organizeDocs().catch(console.error);