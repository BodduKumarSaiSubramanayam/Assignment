Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
git init
git add .
git rm -rf --cached frontend/node_modules
git commit -m "Final Vercel Fix (OneDrive Bypass)"
git remote add origin https://github.com/BodduKumarSaiSubramanayam/Assignment.git
git branch -M main
git push -u origin main --force
