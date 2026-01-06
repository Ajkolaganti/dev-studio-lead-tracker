# Lead Tracking System (Mini CRM)

A simple, mobile-friendly Lead Tracking System for web agencies built with React, Vite, and Firebase.

## Features

- 🔐 Email/Password Authentication
- 👥 Role-based Access Control (Admin & Sales)
- 📱 Mobile-First Design
- 🔥 Firebase Backend (Auth + Firestore)
- 📊 Real-time Lead Management
- 🎯 Status Tracking (New, Interested, Closed, Not Interested)

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Email/Password method
4. Enable **Firestore Database**
5. Copy your Firebase config from Project Settings

### 3. Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Firebase credentials

```bash
cp .env.example .env
```

### 4. Deploy Firestore Security Rules

1. In Firebase Console, go to Firestore Database → Rules
2. Copy and paste the contents of `firestore.rules`
3. Click **Publish**

### 5. Create Admin User

After running the app for the first time:
1. Register a new user
2. Go to Firestore Database in Firebase Console
3. Find the `users` collection
4. Locate your user document
5. Change the `role` field from `"sales"` to `"admin"`

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
src/
├── auth/           # Authentication logic
├── components/     # Reusable UI components
├── pages/          # Page components
├── firebase/       # Firebase configuration
└── utils/          # Utility functions and types
```

## User Roles

### Admin
- View all leads from all sales people
- Filter by sales person, status, date
- Update lead status
- View metrics (total leads, closed leads)

### Sales
- Create new leads
- View only their own leads
- Search leads by business name or phone

## Database Schema

### Users Collection
- `uid`: string (Firebase Auth UID)
- `name`: string
- `role`: "admin" | "sales"
- `createdAt`: timestamp

### Leads Collection
- `businessName`: string
- `ownerName`: string
- `phone`: string
- `email`: string
- `businessType`: string
- `services`: string (comma-separated)
- `plan`: "Starter" | "Growth" | "Pro"
- `status`: "New" | "Interested" | "Closed" | "Not Interested"
- `notes`: string
- `salesId`: string (uid reference)
- `createdAt`: timestamp

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **Routing**: React Router v6

## Deployment

### Firebase Hosting

```bash
npm run build
firebase deploy
```

## Security

- Firestore security rules enforce role-based access
- Sales users can only access their own leads
- Admin has full access to all data
- All mutations require authentication
