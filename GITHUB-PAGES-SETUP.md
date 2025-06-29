# 🚀 GitHub Pages Setup Guide

## ✅ **Step 1: Make Repository Public**

1. Go to your GitHub repository: `https://github.com/AethronTech/company-websites`
2. Click **Settings** (in the repository, not your account)
3. Scroll down to the **Danger Zone** section
4. Click **Change repository visibility**
5. Select **Make public**
6. Type the repository name to confirm: `company-websites`
7. Click **I understand, make this repository public**

## ✅ **Step 2: Enable GitHub Pages**

1. In the same **Settings** page, scroll to **Pages** (left sidebar)
2. Under **Source**, select: **GitHub Actions**
3. Under **Custom domain**, enter: `aethron.tech`
4. Check **Enforce HTTPS** (recommended)
5. Click **Save**

## ✅ **Step 3: Configure DNS (Domain Setup)**

### **For your domain registrar (where you bought aethron.tech):**

**Option A: CNAME Record (Recommended)**
```
Type: CNAME
Name: @ (or leave blank for root domain)
Value: aethrontech.github.io
```

**Option B: A Records (Alternative)**
```
Type: A
Name: @ (or leave blank)
Value: 185.199.108.153

Type: A  
Name: @ (or leave blank)
Value: 185.199.109.153

Type: A
Name: @ (or leave blank) 
Value: 185.199.110.153

Type: A
Name: @ (or leave blank)
Value: 185.199.111.153
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: aethrontech.github.io
```

## ✅ **Step 4: Test the Setup**

1. Push any change to the `main` branch:
   ```bash
   git checkout main
   git merge dev
   git push origin main
   ```

2. Watch the **Actions** tab in GitHub for the deployment

3. Visit `https://aethron.tech` (may take up to 24 hours for DNS)

## 🔍 **What Happens Next**

### **Automatic Workflow:**
```
1. Push to main branch
2. GitHub Pages workflow triggers
3. Quality checks run (linting, Lighthouse, Pa11y, OG validation)
4. Site builds automatically  
5. Deploys to https://aethron.tech
6. Quality reports available in Actions artifacts
```

### **Quality Checks Included:**
- ✅ **JavaScript/CSS/HTML Linting**
- ✅ **Lighthouse Performance Audit**
- ✅ **Pa11y Accessibility Check**
- ✅ **OG Tags Validation (WEBS-49)**
- ✅ **Build Verification**

## 🚀 **Ready to Deploy!**

Once you've completed steps 1-3, simply:

```bash
cd /path/to/your/repo
git checkout main
git merge dev
git push origin main
```

The site will automatically deploy with full quality checks!

## 🆘 **Troubleshooting**

**DNS not working?**
- DNS changes can take up to 24-48 hours
- Test with: `nslookup aethron.tech`
- Temporarily visit: `https://aethrontech.github.io`

**Build failing?**
- Check the **Actions** tab for error details
- Quality checks must pass for deployment to succeed

**Domain not working?**
- Verify DNS settings with your domain registrar
- Make sure GitHub Pages is set to "GitHub Actions" source
- Check that custom domain is set to `aethron.tech`

---

**🎉 Your site will be live at https://aethron.tech with automatic deployment and comprehensive quality checks!**
