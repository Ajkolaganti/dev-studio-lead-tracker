# Admin User Setup Guide

## Method 1: Using Admin Registration (Recommended - Easiest)

The app now supports admin registration with a secret key!

1. **Go to the registration page** (`/register`)
2. **Fill in your details** (Name, Email, Password)
3. **Click "Register as admin?"** link at the bottom of the form
4. **Enter the admin key**: `ADMIN2024` (default key)
5. **Click "Create account"**
6. You'll be automatically created as an admin user
7. After login, you'll be redirected to `/admin` dashboard

### Changing the Admin Key

For security, change the default admin key:

1. Create or update your `.env` file:
   ```bash
   VITE_ADMIN_KEY=your-secret-admin-key-here
   ```
2. Restart your development server
3. Use your custom key during registration

## Method 2: Manual Setup (Alternative)

If you prefer to manually set up admin:

1. **Register a new user** through the app's registration page (as sales user)
2. **Go to Firebase Console** → [Firebase Console](https://console.firebase.google.com/)
3. **Navigate to Firestore Database**
4. **Find the `users` collection**
5. **Locate your user document** (it will have your Firebase Auth UID as the document ID)
6. **Click on the document** to edit it
7. **Change the `role` field** from `"sales"` to `"admin"`
8. **Save the changes**
9. **Log out and log back in** to your account
10. You should now have admin access and see the Admin Dashboard at `/admin`

## Finding Your User UID

If you need to find your Firebase Auth UID:
1. Go to Firebase Console → Authentication
2. Find your user email
3. Copy the UID shown there
4. Use that UID to find your document in the `users` collection

## Verifying Admin Access

After setting up admin:
1. Log out and log back in
2. You should be redirected to `/admin` instead of `/dashboard`
3. You'll see all leads from all sales users
4. You can filter by sales person, status, etc.

