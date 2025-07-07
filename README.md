# StyleBook - Salon Booking & Loyalty System

A complete salon booking system with SMS notifications, loyalty tracking, and admin dashboard.

## Features

- 🤖 **AI Chat Booking**: Conversational booking interface with Maya, the AI assistant
- 📱 **SMS Notifications**: Automatic booking confirmations and reminders
- 💳 **Payment Integration**: Ozow payment gateway support
- 🎯 **Loyalty Program**: QR code-based loyalty tracking
- 📊 **Admin Dashboard**: Order management, analytics, and reporting
- 📧 **Daily Reports**: Automated daily sales reports via email

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd stylebook
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Main booking interface: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin
   - **Live Platform:** [https://unicutshair.vercel.app/](https://unicutshair.vercel.app/)

## Environment Variables

### Required for Production

```env
# SMS Service (required for notifications)
SMS_API_URL=https://api.your-sms-provider.com/send
SMS_API_KEY=your-sms-api-key

# Payment Gateway (required for online payments)
OZOW_API_KEY=your-ozow-api-key
OZOW_SITE_CODE=your-ozow-site-code
OZOW_PRIVATE_KEY=your-ozow-private-key

# Email (required for daily reports)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Optional Configuration

```env
# Application Settings
NEXT_PUBLIC_SALON_NAME=Your Salon Name
NEXT_PUBLIC_SALON_PHONE=+27111234567
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Database (for persistent storage)
DATABASE_URL=your-database-connection-string

# Firebase (alternative backend)
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_PROJECT_ID=your-project-id
```

## Demo Mode

The application runs in demo mode when environment variables are not configured:

- ✅ **SMS**: Messages logged to console instead of sent
- ✅ **Payments**: Mock payment URLs generated
- ✅ **Email**: Reports logged to console instead of sent
- ✅ **Data**: Stored in memory (resets on restart)

## Production Setup

### 1. SMS Service Setup

Choose an SMS provider (Twilio, Clickatell, etc.) and configure:

```env
SMS_API_URL=https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json
SMS_API_KEY=your-twilio-auth-token
```

### 2. Payment Gateway Setup

For South African businesses, configure Ozow:

```env
OZOW_API_KEY=your-ozow-api-key
OZOW_SITE_CODE=your-ozow-site-code
OZOW_PRIVATE_KEY=your-ozow-private-key
```

### 3. Email Configuration

For Gmail SMTP:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Use App Password, not regular password
```

### 4. Database Setup

For persistent data storage, configure a database:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

## Features Overview

### Customer Features
- **Conversational Booking**: Natural language booking with AI assistant
- **Service Selection**: Choose from various hairstyles and services
- **Friend Discounts**: Bring a friend and both get 10% off
- **SMS Confirmations**: Automatic booking confirmations
- **Appointment Reminders**: 5-minute advance reminders
- **QR Code Loyalty**: Scan QR codes to earn loyalty points

### Admin Features
- **Order Management**: View and manage daily appointments
- **Client Database**: Track customer history and loyalty points
- **Analytics Dashboard**: Revenue tracking and performance metrics
- **SMS Management**: Send manual reminders and notifications
- **Daily Reports**: Automated CSV reports via email
- **Loyalty Program**: QR code scanner for point redemption

## API Endpoints

- `POST /api/sms-webhook` - Handle SMS delivery status updates
- Server Actions in `app/actions/create-booking.ts`:
  - `createBooking()` - Create new appointment
  - `getAvailableTimeSlots()` - Get available time slots
  - `sendDailyReport()` - Generate and send daily reports

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React hooks and context
- **Date Handling**: date-fns
- **SMS**: Generic SMS API integration
- **Payments**: Ozow payment gateway
- **Email**: SMTP integration

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Support

For issues and questions:
1. Check the console logs for demo mode messages
2. Verify environment variables are correctly set
3. Test SMS/email services independently
4. Review the admin dashboard for booking status

## Contributors
- [Brian Ouko](https://github.com/WellBrian)
- [Mmabath Naseba](https://github.com/Mmabatho)
- [Holuwercheyy Hisserhah](https://github.com/holuwercheyy)
- [Letshego Sephiri](https://github.com/CaramelF)
- [Christopher Obegi](https://github.com/mechriz)

## License

MIT License - see LICENSE file
