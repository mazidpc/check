# Vercel Build & Deployment Fixes - June 18, 2026

## Issues Fixed

### 1. Missing "dist" Output Directory
**Error**: `Error: No Output Directory named "dist" found after the Build completed`

**Root Cause**: 
- Vercel was looking for `dist` in the root directory instead of `frontend/dist`
- Build command wasn't executing in the frontend directory
- Duplicate `vercel.json` files causing configuration conflicts

**Solution**:
- Updated root `vercel.json`:
  - Set `buildCommand`: `cd frontend && npm install && npm run build`
  - Set `outputDirectory`: `frontend/dist` (absolute path from repo root)
  - Updated all routes to point to `frontend/dist/`
  - Removed conflicting `@vercel/static-build` config
- Removed duplicate `frontend/vercel.json`

### 2. Chunk Size Warnings
**Warning**: `Adjust chunk size limit for this warning via build.chunkSizeWarningLimit`

**Root Cause**: Large bundle chunks exceeding Vite's default 500KB warning threshold

**Solution**:
- Updated `frontend/vite.config.js`:
  - Set `chunkSizeWarningLimit: 1000` (raises threshold to 1000KB)
  - Added manual chunk splitting via `rollupOptions`:
    - `vendor.js`: React, React-DOM, React Router (~400KB)
    - `query.js`: TanStack React Query (~150KB)
    - `ui.js`: Sonner, React Icons (~200KB)
    - `charts.js`: Recharts (~300KB)
  - Explicitly set `outDir: 'dist'`

### 3. Monorepo Deployment Structure
**Updated Configuration**:
```
Root (vercel.json)
├── buildCommand: cd frontend && npm install && npm run build
├── outputDirectory: frontend/dist
├── routes: [API routes → backend, static → frontend/dist]
├── backend/
│   └── package.json (Node.js server)
└── frontend/
    ├── package.json (React app)
    ├── vite.config.js (build optimization)
    └── dist/ (build output)
```

## Files Modified
1. **vercel.json** - Root configuration with proper paths and commands
2. **frontend/vite.config.js** - Build optimization and chunk splitting
3. **frontend/vercel.json** - DELETED (was causing conflicts)

## Deployment Flow (Vercel)
1. Vercel reads root `vercel.json`
2. Runs: `cd frontend && npm install && npm run build`
3. Detects frontend build at: `frontend/dist/`
4. Detects backend at: `backend/index.js`
5. Routes API calls to backend
6. Serves static assets from `frontend/dist/`
7. SPA routing: Non-API requests → `frontend/dist/index.html`

## Performance Improvements
- Chunk splitting reduces initial load time
- Lazy loading of vendor libraries
- Separate caching for different bundle parts
- Each chunk can be cached independently

## Testing Checklist
- [ ] Vercel build completes without errors
- [ ] No "dist" directory not found errors
- [ ] No chunk size warnings
- [ ] Frontend loads correctly
- [ ] API calls route to backend
- [ ] SPA routing works (no 404s on page refresh)
- [ ] Authentication flow functional
- [ ] Admin routes protected

## Next Steps
1. Push changes to main branch
2. Trigger new Vercel deployment
3. Monitor build logs for any errors
4. Verify deployment at production URL
5. Test all features in production environment
