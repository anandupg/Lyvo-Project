# Supabase Authentication Setup Guide

This guide will help you set up the complete Supabase authentication system for your Lyvo+ application.

## Prerequisites

1. A Supabase project (create one at [supabase.com](https://supabase.com))
2. MongoDB instance (local or cloud)
3. Google OAuth credentials (optional, for Google sign-in)

## Step 1: Environment Configuration

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google OAuth Configuration (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/lyvo-plus
```

## Step 2: Supabase Dashboard Configuration

### 2.1 Authentication Settings

1. Go to your Supabase dashboard
2. Navigate to **Authentication** > **Settings**
3. Configure the following:

#### Site URL
```
http://localhost:3000
```

#### Redirect URLs
Add these redirect URLs:
```
http://localhost:3000/auth/callback
http://localhost:3000/dashboard
```

#### Email Templates

Configure email templates for:
- **Confirm signup**: Email confirmation template
- **Invite user**: User invitation template
- **Magic Link**: Passwordless sign-in template
- **Change email address**: Email change confirmation
- **Reset password**: Password reset template

Example email confirmation template:
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email address</a></p>
```

### 2.2 Google OAuth Setup (Optional)

1. Go to **Authentication** > **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Add authorized redirect URI in Google Console:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

### 2.3 Email Settings

1. Go to **Authentication** > **Settings** > **Email Templates**
2. Configure SMTP settings (optional - Supabase provides default email service)
3. Customize email templates as needed

## Step 3: Database Schema

### 3.1 Row Level Security (RLS)

Enable RLS on the `auth.users` table and create policies:

```sql
-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own data
CREATE POLICY "Users can view own profile" ON auth.users
  FOR SELECT USING (auth.uid() = id);

-- Policy for users to update their own data
CREATE POLICY "Users can update own profile" ON auth.users
  FOR UPDATE USING (auth.uid() = id);
```

### 3.2 Custom User Profile Table (Optional)

If you want to store additional user data in Supabase:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## Step 4: MongoDB Setup

### 4.1 Install MongoDB

**Local Installation:**
```bash
# macOS (using Homebrew)
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Windows
# Download from https://www.mongodb.com/try/download/community
```

**Cloud MongoDB (MongoDB Atlas):**
1. Create account at [mongodb.com](https://mongodb.com)
2. Create a new cluster
3. Get your connection string

### 4.2 Database Setup

The application will automatically create the `lyvo-plus` database and `users` collection when the first user signs up.

## Step 5: Google OAuth Setup (Optional)

### 5.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. Configure:
   - Application type: Web application
   - Authorized redirect URIs: `https://your-project-ref.supabase.co/auth/v1/callback`

### 5.2 Add to Environment

Add your Google Client ID to `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## Step 6: Testing the Setup

### 6.1 Start the Application

```bash
npm install
npm run dev
```

### 6.2 Test Authentication Flow

1. **Registration:**
   - Go to `/auth/register`
   - Fill in the form
   - Check email for confirmation link
   - Click confirmation link

2. **Login:**
   - Go to `/auth/login`
   - Sign in with confirmed email
   - Should redirect to dashboard

3. **Google OAuth:**
   - Click "Continue with Google" button
   - Complete Google sign-in flow
   - Should redirect to dashboard

4. **Protected Routes:**
   - Try accessing `/dashboard` without authentication
   - Should redirect to login page

## Step 7: Production Deployment

### 7.1 Update Environment Variables

For production, update your environment variables:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 7.2 Update Supabase Settings

1. Update Site URL in Supabase dashboard
2. Add production redirect URLs
3. Configure production email settings

### 7.3 Update Google OAuth

Add production redirect URI to Google OAuth credentials:
```
https://your-project-ref.supabase.co/auth/v1/callback
```

## Troubleshooting

### Common Issues

1. **Email confirmation not working:**
   - Check Supabase email settings
   - Verify redirect URLs
   - Check spam folder

2. **Google OAuth errors:**
   - Verify Google OAuth credentials
   - Check redirect URIs match exactly
   - Ensure Google+ API is enabled

3. **MongoDB connection issues:**
   - Verify MongoDB is running
   - Check connection string
   - Ensure network access (for cloud MongoDB)

4. **Protected routes not working:**
   - Check AuthProvider is wrapping the app
   - Verify useAuth hook is working
   - Check browser console for errors

### Debug Mode

Enable debug logging by adding to your environment:
```env
NEXT_PUBLIC_DEBUG=true
```

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env.local` to version control
   - Use different keys for development and production
   - Rotate keys regularly

2. **Supabase Security:**
   - Use Row Level Security (RLS)
   - Implement proper policies
   - Monitor auth logs

3. **MongoDB Security:**
   - Use strong passwords
   - Enable authentication
   - Restrict network access

4. **OAuth Security:**
   - Use HTTPS in production
   - Validate redirect URIs
   - Monitor OAuth usage

## Support

If you encounter issues:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review [Next.js authentication guide](https://nextjs.org/docs/authentication)
3. Check browser console for errors
4. Verify all environment variables are set correctly

## Additional Features

The authentication system includes:

- ✅ Email/password registration with confirmation
- ✅ Email/password login
- ✅ Google OAuth integration
- ✅ Protected routes
- ✅ User session management
- ✅ MongoDB user data sync
- ✅ Error handling and validation
- ✅ Loading states and UX feedback
- ✅ Responsive design
- ✅ TypeScript support

You can extend this system by adding:

- Password reset functionality
- Email change confirmation
- Two-factor authentication
- Social login providers (GitHub, Facebook, etc.)
- User profile management
- Role-based access control 