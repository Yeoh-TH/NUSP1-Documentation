# Project Structure
All documentation files should live under the docs/ directory. The current split between src/ and public/ is causing path resolution issues.

## Directory Structure
```
docs/
  assets/     # All static assets (images, icons)
  css/        # All CSS files
  js/         # All JavaScript files
  search/     # Search-related files
  *.html      # HTML documentation pages
```

## Build Configuration
- Vite is configured with base: './NUSP1-Documentation/'
- This means all assets must be referenced relative to this base path

## Local Development
To run locally:
```bash
npm run dev
```

## Building for Production
```bash
npm run build
```

## Deployment
```bash
npm run deploy
```

## Known Issues
- Currently files are split between public/ and src/ causing path resolution problems
- Some relative paths don't account for the base URL configuration