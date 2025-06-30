# WEBS-47: Production Deployment "Go Button"

## Overview
This implements a manual deployment workflow with approval gates that allows controlled deployments from `dev` to `main` (production) branch.

## 🚀 How to Deploy to Production

### Using the "Go Button"

1. **Navigate to GitHub Actions**
   - Go to your repository on GitHub
   - Click on the "Actions" tab
   - Find "🚀 Production Deployment" workflow

2. **Click "Run workflow"**
   - Click the "Run workflow" button
   - Fill in the required fields:

### Required Fields

**Target Environment:**
- Choose `production` (default) or `staging`

**Confirm Deployment:**
- **IMPORTANT:** Type exactly `DEPLOY` (all caps) to confirm
- This acts as a safety gate to prevent accidental deployments

**Release Notes:** (optional)
- Describe what changes are being deployed
- Example: "New feature: Contact form validation"
- Example: "Bug fix: Navigation menu on mobile"

### Example Deployment

```
Target environment: production
Confirm deployment: DEPLOY
Release notes: Deploy WEBS-45 quality checks and WEBS-44 CI improvements
```

## 🔒 Safety Features

### Pre-deployment Validation
- ✅ Confirmation string must match exactly ("DEPLOY")
- ✅ User permissions are logged
- ✅ All inputs are validated before proceeding

### Quality Checks
- ✅ Full linting (JavaScript, HTML, CSS)
- ✅ Build verification
- ✅ Code quality gates must pass

### Production Merge Process
- ✅ Fetches latest `dev` branch
- ✅ Merges `dev` into `main` with detailed commit message
- ✅ Builds production version
- ✅ Verifies build success
- ✅ Pushes to `main` branch

### Post-deployment
- ✅ Verification steps
- ✅ Deployment summary in GitHub
- ✅ Build artifacts saved (30 days)
- ✅ Failure notifications with next steps

## 🎯 Workflow Structure

```
1. Pre-deployment Validation
   ├── Validate "DEPLOY" confirmation
   ├── Check user permissions
   └── Log deployment details

2. Deploy to Production
   ├── Checkout dev branch
   ├── Run quality checks
   ├── Merge dev → main
   ├── Build production site
   ├── Verify build
   └── Push to main

3. Post-deployment Verification
   ├── Wait for propagation
   ├── Verify deployment
   └── Generate summary report

4. Failure Handling (if needed)
   └── Generate failure report with next steps
```

## 🔧 Technical Details

### Concurrency Control
- Only one production deployment can run at a time
- Uses `concurrency.group: production-deployment`
- No cancellation of in-progress deployments

### Environment Protection
- Uses GitHub Environment `production`  
- Can be configured with additional protection rules
- URL automatically set to https://aethron.tech

### Artifacts
- Production builds saved for 30 days
- Named with run number for easy identification
- Useful for rollback or debugging

## ⚡ Quick Start

1. Go to **Actions** → **🚀 Production Deployment**
2. Click **Run workflow**
3. Select `production`
4. Type `DEPLOY` 
5. Add release notes
6. Click **Run workflow**

## 🚨 Important Notes

- **Always test in `dev` first** - The workflow deploys whatever is in the `dev` branch
- **Double-check release notes** - They become part of the git commit message
- **Monitor the deployment** - Check the Actions tab for progress and any issues
- **Only authorized users** should trigger production deployments

## 🛠️ Troubleshooting

### Deployment Failed?
1. Check the failed step in the Actions log
2. Fix issues in the `dev` branch
3. Push fixes to `dev`
4. Re-run the deployment workflow

### Wrong Confirmation?
- The deployment will fail safely at the validation step
- No changes are made to production
- Simply re-run with the correct "DEPLOY" confirmation

### Quality Checks Failed?
- Fix linting errors in the `dev` branch first
- Ensure all CI checks pass on `dev`
- Then re-run the deployment

The deployment workflow is designed to be safe, auditable, and reliable for production releases.
