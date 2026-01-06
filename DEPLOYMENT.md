# Deployment Guide

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `lead-tracker-crm`
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Click on "Email/Password" under Sign-in method
4. Toggle **Enable**
5. Click "Save"

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Select **Start in production mode**
4. Choose your location
5. Click "Enable"

### 4. Deploy Security Rules

1. In Firestore Database, go to **Rules** tab
2. Copy the contents of `firestore.rules` from this project
3. Paste into the rules editor
4. Click **Publish**

### 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register your app with a nickname
5. Copy the configuration object

### 6. Set Environment Variables

Create a `.env` file in the project root:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 7. Create First Admin User

1. Run the app locally: `npm run dev`
2. Register a new user
3. Go to Firebase Console → Firestore Database
4. Find the `users` collection
5. Locate your user document
6. Edit the `role` field from `"sales"` to `"admin"`
7. Save the changes

### 8. Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Hosting
# - Use existing project
# - Choose your project
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds: No

# Build the project
npm run build

# Deploy
firebase deploy
```

Your app is now live at: `https://your-project.firebaseapp.com`

## Alternative: Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables (same as .env file)
5. Deploy

## Post-Deployment

### Create Sales Users

As an admin:
1. Share the registration link with your sales team
2. They register as normal
3. They will automatically get the "sales" role
4. Or manually create users and change roles in Firestore

### Test the System

1. Login as admin → You should see all leads
2. Login as sales → You should only see your leads
3. Create a lead as sales → Admin should see it
4. Update status as admin → Changes should reflect immediately
