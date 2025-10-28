# Publishing X1Pays Packages to npm

This guide explains how to publish X1Pays packages to npm so developers can install them with `npm install @x1pays/client`, etc.

## Overview

X1Pays publishes **4 public npm packages** under the `@x1pays` scope:

| Package | Description | Install Command |
|---------|-------------|-----------------|
| `@x1pays/client` | Axios and Fetch clients with auto-payment | `npm install @x1pays/client` |
| `@x1pays/middleware` | Express, Hono, Fastify, Next.js middleware | `npm install @x1pays/middleware` |
| `@x1pays/sdk` | Core TypeScript SDK | `npm install @x1pays/sdk` |
| `@x1pays/react` | React components (Paywall, etc.) | `npm install @x1pays/react` |

**NOT published** (internal use only):
- `@x1pays/facilitator` - Service, not a library
- `@x1pays/api` - Example API server
- `@x1pays/website` - Documentation website
- `@x1pays/shared` - Internal shared utilities

---

## Prerequisites

### 1. Create npm Account

```bash
# Sign up at https://www.npmjs.com/signup
# Then login from CLI:
npm login
```

Enter your npm username, password, and email.

### 2. Create @x1pays Organization (One-time)

**Option A: Via Web** (Recommended)
1. Go to https://www.npmjs.com/
2. Click your avatar → **"Add Organization"**
3. Choose organization name: `x1pays`
4. Select **Free** plan (for public packages)

**Option B: Via CLI**
```bash
npm org create x1pays
```

### 3. Update Repository URLs

Before publishing, replace `yourusername` with your actual GitHub username in all `package.json` files:

```bash
# Find and replace across all packages
find packages -name "package.json" -exec sed -i 's/yourusername/YOUR_GITHUB_USERNAME/g' {} +
```

Or manually update:
- `packages/client/package.json`
- `packages/middleware/package.json`
- `packages/sdk/package.json`
- `packages/x402-x1-react/package.json`

---

## Publishing Workflow

### Step 1: Build All Packages

```bash
# From repository root
pnpm build
```

Verify all packages build successfully:
- ✅ `packages/client/dist/`
- ✅ `packages/middleware/dist/`
- ✅ `packages/sdk/dist/`
- ✅ `packages/x402-x1-react/dist/`

### Step 2: Verify Package Contents

Check what will be published (should include `dist/` but exclude `src/`, `node_modules/`, `.env`):

```bash
cd packages/client
npm pack --dry-run
cd ../..
```

Repeat for each package.

### Step 3: Publish Packages

**Important:** Scoped packages are **private by default**. Use `--access public` for free public packages.

```bash
# Publish client library
cd packages/client
npm publish --access public
cd ../..

# Publish middleware
cd packages/middleware
npm publish --access public
cd ../..

# Publish SDK
cd packages/sdk
npm publish --access public
cd ../..

# Publish React components
cd packages/x402-x1-react
npm publish --access public
cd ../..
```

### Step 4: Verify Publication

Visit npm to confirm:
- https://www.npmjs.com/package/@x1pays/client
- https://www.npmjs.com/package/@x1pays/middleware
- https://www.npmjs.com/package/@x1pays/sdk
- https://www.npmjs.com/package/@x1pays/react

Or search: https://www.npmjs.com/search?q=%40x1pays

---

## Publishing Updates

When you make changes and want to release a new version:

### 1. Update Version Numbers

Follow [Semantic Versioning](https://semver.org/):
- **Patch** (0.1.0 → 0.1.1): Bug fixes
- **Minor** (0.1.0 → 0.2.0): New features (backwards compatible)
- **Major** (0.1.0 → 1.0.0): Breaking changes

```bash
# Update version in package.json, then:
cd packages/client
npm version patch   # or 'minor' or 'major'
cd ../..
```

Or manually edit `version` field in `package.json`.

### 2. Rebuild and Republish

```bash
pnpm build
cd packages/client
npm publish --access public
cd ../..
```

---

## Automated Publishing with GitHub Actions

For professional workflows, automate publishing on git tag:

**Create `.github/workflows/publish.yml`:**

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
      
      - run: pnpm install
      - run: pnpm build
      
      # Publish all packages
      - run: cd packages/client && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - run: cd packages/middleware && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - run: cd packages/sdk && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - run: cd packages/x402-x1-react && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Setup:**
1. Generate npm token: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Add to GitHub secrets: Settings → Secrets → New repository secret
   - Name: `NPM_TOKEN`
   - Value: `<your-npm-token>`

**Usage:**
```bash
git tag v0.1.0
git push origin v0.1.0
# GitHub Actions automatically publishes
```

---

## Package-Specific Notes

### @x1pays/client

**Exports:**
```typescript
// Full bundle
import { x402Client } from '@x1pays/client';

// Axios only
import { x402Client } from '@x1pays/client/axios';

// Fetch only
import { x402Fetch } from '@x1pays/client/fetch';
```

**Dependencies:** Axios is a `peerDependency` (users install separately)

### @x1pays/middleware

**Exports:**
```typescript
// Express
import { x402Middleware } from '@x1pays/middleware/express';

// Hono
import { x402Middleware } from '@x1pays/middleware/hono';

// Fastify
import { x402Plugin } from '@x1pays/middleware/fastify';

// Next.js
import { x402Handler } from '@x1pays/middleware/nextjs';
```

**Dependencies:** All frameworks are `peerDependencies` (optional)

### @x1pays/sdk

Core utilities for building custom integrations.

### @x1pays/react

Material-UI based React components. Users need to install peer dependencies:
```bash
npm install @x1pays/react @mui/material @emotion/react @solana/wallet-adapter-react
```

---

## Troubleshooting

### "You do not have permission to publish"

**Cause:** You're not a member of the `@x1pays` organization.

**Fix:**
```bash
# Add yourself to the organization (if you own it)
npm org set @x1pays <your-npm-username> developer

# Or create the organization first
npm org create x1pays
```

### "Package already exists but was never published"

**Cause:** Package was created but publish failed.

**Fix:**
```bash
npm unpublish @x1pays/client --force
npm publish --access public
```

### "402 Payment Required" during install

**Cause:** Package is accidentally private.

**Fix:**
```bash
npm access public @x1pays/client
```

### Build Errors Before Publishing

```bash
# Clean everything and rebuild
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

---

## Checklist Before First Publish

- [ ] npm account created
- [ ] `@x1pays` organization created on npm
- [ ] Logged in with `npm login`
- [ ] Updated repository URLs in all `package.json` files
- [ ] All packages build successfully (`pnpm build`)
- [ ] README.md files exist in each package directory
- [ ] LICENSE file exists in repository root
- [ ] `.npmignore` or `files` field configured (if needed)
- [ ] No `.env` files or secrets in package directories
- [ ] Version numbers are correct (start with `0.1.0`)

---

## Best Practices

✅ **Always build before publishing** - Ensures `dist/` is up-to-date  
✅ **Test locally first** - Use `npm pack` and install the `.tgz` file  
✅ **Use semantic versioning** - Makes upgrades predictable  
✅ **Include README.md** - Shows on npm package page  
✅ **Tag releases in git** - `git tag v0.1.0 && git push origin v0.1.0`  
✅ **Automate with CI/CD** - Prevents manual errors  
✅ **Never unpublish** - Use deprecation instead (`npm deprecate`)  

❌ **Don't publish secrets** - Check `.npmignore` or `files` field  
❌ **Don't rush major versions** - Stay on `0.x.x` until stable  
❌ **Don't skip testing** - Publish to `next` tag first for pre-releases  

---

## Publishing Pre-Releases (Beta/Alpha)

```bash
# Update version
npm version 0.2.0-beta.1

# Publish to beta tag
npm publish --tag beta --access public

# Users install with:
npm install @x1pays/client@beta
```

---

## Additional Resources

- **npm Docs:** https://docs.npmjs.com/creating-and-publishing-scoped-public-packages
- **Semantic Versioning:** https://semver.org/
- **npm Organizations:** https://docs.npmjs.com/orgs/
- **GitHub Actions Publishing:** https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages

---

**Questions?** Open an issue at https://github.com/yourusername/x1pays/issues
