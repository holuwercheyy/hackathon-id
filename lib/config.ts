// Application configuration with environment variable handling
export const config = {
  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_SALON_NAME || "StyleBook",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    phone: process.env.NEXT_PUBLIC_SALON_PHONE || "+27111234567",
  },

  // SMS Configuration
  sms: {
    apiUrl: process.env.SMS_API_URL || "https://api.demo-sms.com/send",
    apiKey: process.env.SMS_API_KEY || "demo-key",
    isDemo: !process.env.SMS_API_KEY || process.env.SMS_API_KEY === "demo-key",
  },

  // Payment Configuration
  payment: {
    ozow: {
      siteCode: process.env.OZOW_SITE_CODE || "DEMO_SITE",
      apiKey: process.env.OZOW_API_KEY || "demo-key",
      privateKey: process.env.OZOW_PRIVATE_KEY || "demo-private-key",
      isDemo: !process.env.OZOW_API_KEY || process.env.OZOW_API_KEY === "demo-key",
    },
  },

  // Email Configuration
  email: {
    smtp: {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
      isConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
    },
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || "",
    isConfigured: !!process.env.DATABASE_URL,
  },

  // Firebase Configuration
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || "",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.FIREBASE_APP_ID || "",
    isConfigured: !!(process.env.FIREBASE_API_KEY && process.env.FIREBASE_PROJECT_ID),
  },
}

// Helper function to check if we're in development mode
export const isDevelopment = process.env.NODE_ENV === "development"

// Helper function to check if we're in demo mode (no real services configured)
export const isDemoMode = config.sms.isDemo && config.payment.ozow.isDemo && !config.email.smtp.isConfigured
