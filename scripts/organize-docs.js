#!/usr/bin/env node

import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function isDirectory(path) {
    try {
        const stat = await fs.stat(path);
        return stat.isDirectory();
    } catch (error) {
        return false;
    }
}

async function copyRecursive(src, dest) {
    const exists = await fs.access(src).then(() => true).catch(() => false);
    if (!exists) {
        console.warn(`Warning: Source path does not exist: ${src}`);
        return;
    }

    const stats = await fs.stat(src);
    
    if (stats.isDirectory()) {
        await fs.mkdir(dest, { recursive: true });
        const files = await fs.readdir(src);
        
        for (const file of files) {
            const srcPath = join(src, file);
            const destPath = join(dest, file);
            await copyRecursive(srcPath, destPath);
        }
    } else {
        try {
            await fs.copyFile(src, dest);
            console.log(`Copied: ${src} -> ${dest}`);
        } catch (error) {
            console.warn(`Warning: Could not copy ${src}: ${error.message}`);
        }
    }
}

async function organizeDocs() {
    const docsDir = join(process.cwd(), 'docs');
    
    try {
        // Create directory structure
        const dirs = ['assets', 'css', 'js', 'search'];
        for (const dir of dirs) {
            await fs.mkdir(join(docsDir, dir), { recursive: true });
        }

        // Process files in the current directory
        const currentDirFiles = await fs.readdir('.');
        for (const file of currentDirFiles) {
            const ext = extname(file);
            if (ext === '.html') {
                await copyRecursive(file, join(docsDir, file));
            }
        }
        
        // Move files from public/ if it exists
        if (await isDirectory('public')) {
            const publicFiles = await fs.readdir('public');
            for (const file of publicFiles) {
                const srcPath = join('public', file);
                const ext = extname(file);
                let targetDir = docsDir;
                
                if (['.png', '.ico', '.svg'].includes(ext)) {
                    targetDir = join(docsDir, 'assets');
                } else if (ext === '.css') {
                    targetDir = join(docsDir, 'css');
                } else if (ext === '.js') {
                    targetDir = join(docsDir, 'js');
                }
                
                await copyRecursive(srcPath, join(targetDir, file));
            }
        }
        
        // Move files from src/ if it exists
        if (await isDirectory('src')) {
            const srcFiles = await fs.readdir('src');
            for (const file of srcFiles) {
                const ext = extname(file);
                if (ext === '.html' || ext === '.js' || ext === '.css') {
                    const targetDir = ext === '.js' ? join(docsDir, 'js') :
                                    ext === '.css' ? join(docsDir, 'css') :
                                    docsDir;
                    await copyRecursive(join('src', file), join(targetDir, file));
                }
            }
        }
        
        console.log('Documentation files organized in docs/ directory');
    } catch (error) {
        console.error('Error organizing docs:', error);
        process.exit(1);
    }
}

organizeDocs();