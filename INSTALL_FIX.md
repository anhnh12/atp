# Fix npm Install Issues

## Quick Fix for Dependency Conflicts

If you're getting dependency conflicts during `npm install`, use one of these solutions:

### Solution 1: Use Legacy Peer Deps (Recommended)

```bash
npm install --legacy-peer-deps
```

This will install dependencies ignoring peer dependency conflicts.

### Solution 2: Clean Install

If Solution 1 doesn't work, try a clean install:

```bash
# Remove existing node_modules and lock file
rm -rf node_modules package-lock.json

# Install with legacy peer deps
npm install --legacy-peer-deps
```

### Solution 3: Use .npmrc File

I've created a `.npmrc` file that automatically uses `--legacy-peer-deps`. Now you can just run:

```bash
npm install
```

The `.npmrc` file contains:
```
legacy-peer-deps=true
```

### Solution 4: Update Node.js Version

If you're using an older Node.js version, try updating:

```bash
# Check current version
node --version

# Should be v18 or higher
# If not, update Node.js from https://nodejs.org/
```

---

## After Installation

Once installation completes successfully:

```bash
# Start the development server
npm start
```

The website should open at `http://localhost:3000`

---

## Why This Happens

The error occurs because:
- React 19 is newer than what some packages officially support
- `@tanstack/react-query` v5.28.6 requires React 18
- We've updated to v5.62.0 which supports React 19, but npm still shows warnings

Using `--legacy-peer-deps` tells npm to install anyway, which is safe because:
- React Query v5.62+ works fine with React 19
- The peer dependency check is just a warning
- Your code will work correctly

---

## Verify Installation

After installing, verify everything works:

```bash
# Check if node_modules exists
ls node_modules

# Start dev server
npm start
```

If the dev server starts without errors, you're good to go! ✅