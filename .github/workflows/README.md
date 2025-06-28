# GitHub Actions Workflows

This directory contains CI/CD workflows for the company websites project.

## Workflows

### 1. Build Workflow (`build.yml`)

**Triggers:**
- Push to `main` or `dev` branches (when `aethron.tech/` files change)
- Pull requests to `main` or `dev` branches (when `aethron.tech/` files change)

**What it does:**
- Tests the build on Node.js 18.x and 20.x
- Installs dependencies with `npm ci`
- Runs the Eleventy build process
- Validates build output (checks for `_site/` directory and `index.html`)
- Uploads build artifacts for 7 days
- Runs linting (when configured)

### 2. Deploy Workflow (`deploy.yml`)

**Triggers:**
- Push to `main` branch → Production deployment
- Push to `dev` branch → Staging deployment

**What it does:**
- Builds the site for the target environment
- Deploys to staging/production (placeholder steps included)
- Uses GitHub Environments for deployment protection

## Environment Variables

Set these in your GitHub repository settings:

### Staging Environment
- `NODE_ENV=staging`

### Production Environment  
- `NODE_ENV=production`

## Security

- Workflows only run when `aethron.tech/` files are modified
- Production deployments require manual approval (if GitHub Environments are configured)
- Uses official GitHub Actions with pinned versions

## Artifacts

Build artifacts are stored for 7 days and include:
- Complete `_site/` directory with built website
- Separate artifacts for each Node.js version tested

## Setup Required

1. Configure GitHub Environments in repository settings:
   - `staging` - for dev branch deployments
   - `production` - for main branch deployments

2. Add deployment steps in the workflow files:
   - Replace placeholder echo commands with actual deployment logic
   - Add secrets for deployment credentials if needed

3. Configure branch protection rules to require CI checks before merging
