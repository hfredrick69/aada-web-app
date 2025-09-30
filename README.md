# AADA Web App

React web application for Atlanta Academy of Dental Assisting.

## 🚀 Deployed App

**Production URL:** https://lively-bush-03c79110f.1.azurestaticapps.net

## Features

- **Multi-step Registration**: 4-step registration process with email/password, personal info, and document upload
- **JWT Authentication**: Secure login with automatic token refresh
- **Document Management**: Upload and view academic transcripts with verification status
- **Protected Routes**: Dashboard access restricted to authenticated users
- **Responsive Design**: Mobile-friendly interface matching Flutter app design

## Tech Stack

- React 19.1
- React Router 7.9
- Axios 1.12
- Azure Static Web Apps

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

## Deployment

### Automatic Deployment (GitHub Actions)

The app automatically deploys to Azure Static Web Apps on every push to `main` branch.

**Setup:**
1. Create a GitHub repository and push this code
2. Add the Azure deployment token as a GitHub secret:
   - Go to: Settings → Secrets and variables → Actions
   - Create secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: Get from Azure CLI:
     ```bash
     az staticwebapp secrets list --name aada-web-app --resource-group aada-backend-rg --query "properties.apiKey" -o tsv
     ```

### Manual Deployment

```bash
# Build the app
npm run build

# Deploy using SWA CLI
swa deploy ./build --deployment-token <YOUR_TOKEN> --env production
```

## Backend Integration

The app connects to the AADA FastAPI backend:
- **Production API:** https://aada-backend-app12345.azurewebsites.net
- **API Service:** `src/services/authService.js`

## Project Structure

```
src/
├── pages/
│   ├── Login.js              # Login page
│   ├── Register.js           # Step 1: Email/Password
│   ├── PersonalInfo.js       # Step 2: Personal details
│   ├── DocumentUpload.js     # Step 3: Document upload
│   ├── Dashboard.js          # Main dashboard
│   ├── Auth.css             # Shared auth styling
│   ├── Dashboard.css        # Dashboard styling
│   └── DocumentUpload.css   # Document upload styling
├── services/
│   └── authService.js       # API client with axios interceptors
└── App.js                   # Router configuration
```

## Environment

- Node.js: 20.14.0
- React: 19.1.1
- Deployed on: Azure Static Web Apps (Free tier)

## License

Proprietary - Atlanta Academy of Dental Assisting
