# Deployment Guide — Retro Gaming Marketplace

## Option 1: Vercel (Recommended)

Vercel is the preferred platform for React + Vite projects.

### Prerequisites
- GitHub repository: [github.com/ricardocesidio/retro-gaming](https://github.com/ricardocesidio/retro-gaming)
- Vercel account (free tier works)

### Step-by-Step Deployment

1. **Log in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select the `retro-gaming` repository from your GitHub list
   - Click "Import"

3. **Configure Project Settings**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables**
   No environment variables required (frontend-only project)

5. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes for build completion
   - Your live demo will be at: `https://retro-gaming-[your-vercel-id].vercel.app`

### Build Settings Verification
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x or later (default)
```

### Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain or use the Vercel subdomain

---

## Option 2: Netlify (Alternative)

### Step-by-Step Deployment

1. **Log in to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with your GitHub account

2. **Add New Site**
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and authorize access
   - Select the `retro-gaming` repository

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Deploy**
   - Click "Deploy site"
   - Live at: `https://[random-name].netlify.app`

---

## Build Verification

Before deploying, verify the build works locally:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Run production build
npm run build

# Preview locally
npm run preview
```

Expected output:
```
✓ built in ~700ms
dist/assets/index-xxxxx.js 162.66 kB │ gzip: 51.87 kB
```

---

## Live Demo URL (After Deployment)

Once deployed to Vercel:
```
https://retro-gaming-[your-vercel-id].vercel.app
```

Update the README.md with this URL:
```markdown
## Live Demo
[View Live Demo](https://retro-gaming-[your-vercel-id].vercel.app)
```

---

## Common Deployment Issues

### Build Fails with "Module not found"
- Ensure all imports use correct case (macOS is case-insensitive, but Vercel/Netlify Linux servers are not)
- Check for missing files in git: `git status`

### Build Takes Too Long
- Vite builds typically complete in under 3 seconds for this project
- If slower, check for large images in `/public` or `/src/images`

### Routes Return 404
- Vite handles SPA routing correctly for Vercel/Netlify
- No additional configuration needed

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub (main branch)
- [ ] Build passes locally (`npm run build`)
- [ ] All hardcoded colors replaced with design tokens
- [ ] README.md updated with live demo link
- [ ] Project description added to GitHub repo settings
- [ ] Vercel account created and GitHub connected
- [ ] Deployment successful with no errors

---

## Final Result

After deployment, recruiters can:
1. Visit the live demo URL
2. Browse the marketplace
3. Create a listing (stored in localStorage)
4. Test the messaging system
5. Try the bundle flow

The project demonstrates frontend architecture, React patterns, and CSS design systems — all without a backend.
