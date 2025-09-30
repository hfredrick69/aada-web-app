# AADA Project - Session Continuation Documentation

## Project Overview
**AADA (Atlanta Academy of Dental Assisting)** - Multi-platform student management system with:
- **Backend**: FastAPI (Python) on Azure Web App - https://aada-backend-app12345.azurewebsites.net
- **Flutter App**: macOS/mobile app in `/Users/herbert/Development/AADA_flutter_full/NewAppScreens/aada_appv2`
- **React Web App**: Static web app on Azure - https://lively-bush-03c79110f.1.azurestaticapps.net
- **GitHub**: https://github.com/hfredrick69/aada-web-app

## Current Architecture

### Backend (Azure Web App)
- Location: `/Users/herbert/Development/AADA_backend_full`
- PostgreSQL database on Azure
- JWT authentication (access + refresh tokens)
- Document upload/management
- Endpoints: `/auth/*`, `/documents/*`

### React Web App
- Location: `/Users/herbert/Development/aada-web-app`
- Deployed via GitHub Actions to Azure Static Web Apps
- Auto-deploys on push to `main` branch
- Routes: `/login`, `/register`, `/register/personal-info`, `/register/document-upload`, `/dashboard`

## Authentication Flow

### 1. Registration (Student Only)
- **Step 1**: Email & password (`/register`)
- **Step 2**: Personal info - name, phone, address, emergency contact (`/register/personal-info`)
- **Step 3**: Document upload - academic transcript (`/register/document-upload`)
- **Step 4**: Success → redirect to login
- All registrations hardcoded as `role: 'student'`

### 2. Login
Returns `access_token`, `refresh_token`, `user` object

### 3. Token Management
Axios interceptors auto-refresh on 401

## Dashboard Features (All Tabs Working)

### Dashboard Tab
- Shows user's uploaded documents
- Status: pending (orange), approved (green), rejected (red)
- Fetches from `/documents/list`

### Quizzes Tab (Sample Data)
- Dental Anatomy Quiz (Not Started)
- Chairside Assisting Quiz (In Progress)
- OSHA Guidelines Quiz (Completed • 90%)

### Job Board Tab (Sample Data)
- 3 job listings with "Apply" buttons
- Dental Assistant, Sterilization Tech, Front Desk Admin

### My Tuition Tab (Sample Data)
- Past Due: $400 (red)
- Upcoming: $500 (green)
- Balance: $2,100 (blue)

## Key Technical Details

### React App Structure
```
src/
├── pages/
│   ├── Login.js
│   ├── Register.js (Step 1)
│   ├── PersonalInfo.js (Step 2)
│   ├── DocumentUpload.js (Step 3)
│   ├── Dashboard.js (All 4 tabs)
│   ├── Auth.css
│   ├── Dashboard.css
│   └── DocumentUpload.css
├── services/
│   └── authService.js (Axios instance with interceptors)
└── App.js (Router + ProtectedRoute)
```

### Backend Response Format
- **Registration**: `{ id, email, role, first_name, last_name, phone, ... }`
- **Login**: `{ access_token, refresh_token, user: {...} }`
- **Documents**: `[{ id, document_type, file_name, verification_status, uploaded_at, ... }]`

### Styling
- Brand color: Amber `#ffc107`
- Background: White `#fff`
- Border radius: 12px
- Bottom navigation: Fixed position, 4 tabs

## Azure Configuration

### Static Web App
- Name: `aada-web-app`
- Resource Group: `aada-backend-rg`
- Region: East US 2
- SKU: Free
- Deployment token stored in GitHub secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`

### GitHub Actions
- Workflow: `.github/workflows/azure-static-web-apps.yml`
- Triggers on: push to `main`, pull requests
- Build: `npm ci && npm run build`
- Deploy: Uses `Azure/static-web-apps-deploy@v1`

### SPA Routing
- `public/staticwebapp.config.json` - handles client-side routing
- All routes fallback to `/index.html`

## Important Security Notes

1. **Student-Only Registration**: Public registration ONLY creates `student` role users
2. **Admin Portal (Future)**: Will be built separately to assign `admin` and `instructor` roles
3. **JWT Tokens**: Stored in localStorage (consider HttpOnly cookies for production)
4. **Document Upload**: Uses FormData, requires valid user_id from registration response

## Known Working State

✅ Registration flow (all 3 steps)
✅ Document upload during registration
✅ Login with JWT tokens
✅ Auto token refresh
✅ Dashboard with documents
✅ All 4 navigation tabs functional
✅ Direct URL routing (no 404s)
✅ GitHub Actions CI/CD

## Sample Data (Currently Hardcoded)

- Quizzes: 3 items with status indicators
- Jobs: 3 listings in GA area
- Tuition: 3 payment status cards

**Note**: These will need backend API endpoints to become dynamic

## Deployment Commands

```bash
# Local development
npm start  # http://localhost:3000

# Build
npm run build

# Manual deploy
swa deploy ./build --deployment-token <token> --env production

# Commit & auto-deploy
git add .
git commit -m "message"
git push  # Auto-deploys via GitHub Actions
```

## Future Enhancements (Not Yet Implemented)

1. Admin portal for role management
2. Dynamic quiz data from backend
3. Real job board API integration
4. Live tuition/payment system
5. Quiz taking functionality
6. Job application workflow
7. Email verification (TODO in backend)
8. Password reset functionality

## Important File Locations

- **Backend auth**: `/Users/herbert/Development/AADA_backend_full/routers/auth.py`
- **Document upload endpoint**: Returns user_id at `response.id` (NOT `response.user.id`)
- **Flutter dashboard**: `/Users/herbert/Development/AADA_flutter_full/NewAppScreens/aada_appv2/lib/screens/dashboard_screen.dart`

## Starting Next Session

**Recommended prompt**:
> "Continuing AADA development. React web app at `/Users/herbert/Development/aada-web-app`, deployed to Azure Static Web Apps. Last worked on: [brief description of what you want to add]."

## Git Configuration

- Remote: `git@github.com:hfredrick69/aada-web-app.git`
- Branch: `main`
- SSH key configured for push access
- All commits auto-deploy via GitHub Actions

## Development Notes

- Backend runs locally on port 8000: `python3 -m uvicorn main:app --reload --port 8000`
- React dev server runs on port 3000: `npm start`
- Production backend: Azure Web App (already deployed)
- Production frontend: Azure Static Web Apps (auto-deploys from GitHub)
