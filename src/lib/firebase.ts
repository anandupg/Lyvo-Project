// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  User,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// 
// IMPORTANT: If you get "unauthorized domain" error, you need to add your domain
// to the authorized domains list in Firebase Console:
// 1. Go to Firebase Console → Authentication → Settings
// 2. Scroll to "Authorized domains" section
// 3. Add: localhost, 127.0.0.1, and your actual domain
const firebaseConfig = {
  apiKey: "AIzaSyB11AYzdDScJ_x_9ZBLN6V1wfNgPy2JqTg",
  authDomain: "lyvo-rooms.firebaseapp.com",
  projectId: "lyvo-rooms",
  storageBucket: "lyvo-rooms.firebasestorage.app",
  messagingSenderId: "635461793603",
  appId: "1:635461793603:web:1d45f9fb0aae7cc353a1f6",
  measurementId: "G-9T90ZSZKQN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const registerWithEmailAndPassword = async (email: string, password: string, fullName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(userCredential.user, {
      displayName: fullName
    });
    
    // Send email verification
    await sendEmailVerification(userCredential.user);
    
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithEmailAndPasswordFirebase = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      // Sign out the user since email is not verified
      await auth.signOut();
      return { user: null, error: "Please verify your email address before signing in. Check your inbox for a verification email." };
    }
    
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithGoogle = async () => {
  try {
    // Check if we're on a mobile device - improved detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(navigator.userAgent) || 
                    window.innerWidth <= 768;
    
    console.log('Device detection:', { 
      userAgent: navigator.userAgent, 
      isMobile, 
      windowWidth: window.innerWidth 
    });
    
    // For mobile devices, try popup first, then fallback to redirect
    if (isMobile) {
      console.log('Mobile device detected, trying popup first...');
      try {
        // Try popup first for mobile (more reliable than redirect)
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Popup successful on mobile');
        return { user: result.user, error: null };
      } catch (popupError: any) {
        console.log('Popup failed on mobile, trying redirect as fallback:', popupError.message);
        
        // If popup fails, try redirect as fallback
        try {
          await signInWithRedirect(auth, googleProvider);
          return { user: null, error: null }; // User will be redirected
        } catch (redirectError: any) {
          console.error('Both popup and redirect failed on mobile:', redirectError);
          return { user: null, error: 'Google sign-in failed. Please try again or use email/password sign-in.' };
        }
      }
    } else {
      console.log('Desktop device, using popup');
      // Use popup for desktop devices
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, error: null };
    }
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    return { user: null, error: error.message };
  }
};

// Handle redirect result (call this when the app loads)
export const handleRedirectResult = async () => {
  try {
    console.log('Checking for redirect result...');
    
    // Check if we're in a browser environment that supports redirects
    if (typeof window === 'undefined') {
      console.log('Not in browser environment, skipping redirect check');
      return { user: null, error: null };
    }
    
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('Redirect result found:', { 
        user: result.user?.email, 
        providerId: result.providerId
      });
      return { user: result.user, error: null };
    } else {
      console.log('No redirect result found');
      return { user: null, error: null };
    }
  } catch (error: any) {
    console.error('Error handling redirect result:', error);
    
    // Handle specific sessionStorage errors
    if (error.message && error.message.includes('sessionStorage')) {
      console.log('SessionStorage error detected, this is expected in some browser environments');
      return { user: null, error: null };
    }
    
    return { user: null, error: null };
  }
};

// Manual trigger for handling redirect result (can be called from UI)
export const checkRedirectResult = async () => {
  console.log('Manual redirect result check triggered');
  return await handleRedirectResult();
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Sign out
export const signOut = async () => {
  try {
    await auth.signOut();
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Send email verification
export const sendEmailVerificationFirebase = async (user: User) => {
  try {
    await sendEmailVerification(user);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmailFirebase = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Check if user email is verified
export const isEmailVerified = (user: User): boolean => {
  return user.emailVerified;
};

export default app; 