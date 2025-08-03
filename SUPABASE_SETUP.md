# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication for your Lyvo+ application.

## 🚀 **Step 1: Create Supabase Project**

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign Up"
3. Create a new project
4. Choose your organization
5. Enter project details:
   - **Name**: `lyvo-plus`
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users

## 🔑 **Step 2: Get Your API Keys**

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Anon/Public Key** (starts with `eyJ`)
   - **Service Role Key** (starts with `eyJ`)

## ⚙️ **Step 3: Configure Environment Variables**

1. Create a `.env.local` file in your project root
2. Add the following variables:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Replace the placeholder values with your actual Supabase credentials.**

## 🔧 **Step 4: Configure Authentication Settings**

### Email Authentication Setup

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:

#### **Site URL**
- Set to: `http://localhost:3000` (for development)
- For production: `https://yourdomain.com`

#### **Redirect URLs**
Add these redirect URLs:
- `http://localhost:3000/auth/callback`
- `http://localhost:3000/dashboard`
- `http://localhost:3000/auth/reset-password`

#### **Email Templates**
1. Go to **Authentication** → **Email Templates**
2. Customize the following templates:
   - **Confirm signup**
   - **Reset password**
   - **Magic link**

### Email Provider Setup

1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Configure your email provider (Gmail, SendGrid, etc.)

**For Gmail:**
- **Host**: `smtp.gmail.com`
- **Port**: `587`
- **Username**: Your Gmail address
- **Password**: Your Gmail app password

## 🔐 **Step 5: Database Schema (Optional)**

If you want to store additional user data, create a `profiles` table:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## 🚀 **Step 6: Test Your Setup**

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the registration flow:
   - Go to `http://localhost:3000/auth/register`
   - Create a new account
   - Check your email for confirmation

3. Test the login flow:
   - Go to `http://localhost:3000/auth/login`
   - Sign in with your credentials

## 🔧 **Step 7: Google OAuth Setup (Optional)**

To enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret
7. In Supabase dashboard, go to **Authentication** → **Providers**
8. Enable Google provider and add your credentials

## 🛠️ **Step 8: Production Deployment**

### Environment Variables for Production

Update your production environment variables:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Update Supabase Settings

1. Update Site URL to your production domain
2. Add production redirect URLs
3. Configure production email settings

## 🔍 **Troubleshooting**

### Common Issues

1. **"Invalid API key" error**
   - Check that your environment variables are correctly set
   - Restart your development server

2. **Email not sending**
   - Verify SMTP settings in Supabase
   - Check spam folder
   - Test with a different email provider

3. **Redirect errors**
   - Ensure redirect URLs are correctly configured
   - Check for typos in URLs

4. **CORS errors**
   - Add your domain to Supabase CORS settings
   - Check browser console for specific errors

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

## 📚 **Additional Resources**

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Authentication Best Practices](https://supabase.com/docs/guides/auth)

## 🎉 **Success!**

Your Supabase authentication is now set up and ready to use! Users can register, confirm their email, and sign in to your application. 