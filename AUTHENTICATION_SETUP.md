# NovaPivot Authentication System Setup

## Overview

Complete authentication system for NovaPivot AI Career Transition Platform with:
- Secure JWT authentication
- Password hashing with bcrypt
- Rate limiting and security features
- Beautiful UI matching NovaPivot design
- Protected routes and session management
- Password reset functionality
- Account lockout protection

## Architecture

```
novapivot/
├── auth-server/           # Express.js authentication server
│   ├── models/User.js    # MongoDB user model
│   ├── controllers/      # Auth controllers
│   ├── middleware/       # Auth middleware
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Main server file
├── frontend/            # React frontend
│   ├── src/
│   │   ├── context/     # Auth context
│   │   ├── services/    # API services
│   │   ├── components/  # Auth components
│   │   └── pages/       # Auth pages
└── backend/            # Existing FastAPI server
```

## 🚀 Quick Setup

### 1. Backend Setup (Authentication Server)

```bash
# Navigate to auth server directory
cd auth-server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Environment Variables:**
```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/novapivot-auth

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (optional, for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Database Setup

```bash
# Start MongoDB (if not already running)
sudo systemctl start mongod

# Or install and start MongoDB
# Ubuntu/Debian:
sudo apt-get install mongodb
sudo systemctl start mongod

# macOS with Homebrew:
brew install mongodb-community
brew services start mongodb-community
```

### 3. Start Authentication Server

```bash
cd auth-server

# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5001`

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Replace App.tsx with authenticated version
cp src/App.tsx src/App_Original.tsx
cp src/App_Auth.tsx src/App.tsx

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📱 Usage

### 1. Create Account

- Navigate to `http://localhost:3000/signup`
- Fill in registration form:
  - Full Name (2-50 characters, letters only)
  - Email (valid email format)
  - Password (min 6 chars, 1 uppercase, 1 lowercase, 1 number)
  - Confirm Password
- Click "Create Account"

### 2. Login

- Navigate to `http://localhost:3000/login`
- Enter email and password
- Optional: Check "Remember me" for persistent session
- Click "Sign In"

### 3. Access Dashboard

- After successful login, you'll be redirected to `/dashboard`
- All routes are now protected and require authentication
- Session persists in localStorage

### 4. Password Reset

- Click "Forgot password?" on login page
- Enter your email address
- Check console for reset link (in development)
- Use link to reset password

## 🔒 Security Features

### 1. Password Security
- **bcrypt hashing** with salt rounds of 12
- **Password strength validation**
- **Password confirmation** required

### 2. Account Protection
- **Account lockout** after 5 failed attempts (2 hours)
- **Rate limiting** on auth endpoints (5 requests per 15 minutes)
- **Session management** with secure JWT tokens

### 3. API Security
- **Helmet.js** for security headers
- **CORS** configured for allowed origins
- **Input validation** with express-validator
- **Error handling** without information leakage

### 4. Token Security
- **JWT expiration** (7 days default)
- **Secure token storage** in localStorage
- **Automatic token refresh** on API calls
- **Logout functionality** clears tokens

## 🛠️ API Endpoints

### Authentication Routes
```
POST /api/auth/register          - Register new user
POST /api/auth/login             - Login user
GET  /api/auth/me                - Get current user
POST /api/auth/logout            - Logout user
POST /api/auth/forgot-password   - Request password reset
POST /api/auth/reset-password/:token - Reset password
```

### Response Format
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "isEmailVerified": false,
      "provider": "local",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

## 🎨 UI Components

### 1. Login Page (`/login`)
- NovaPivot dark theme design
- Email and password inputs with validation
- Remember me checkbox
- Forgot password link
- Sign up link
- Loading states and error handling

### 2. Sign Up Page (`/signup`)
- Full name, email, password, confirm password
- Real-time password strength indicator
- Form validation with error messages
- Beautiful glass morphism design
- Loading states

### 3. Forgot Password Page (`/forgot-password`)
- Email input for password reset
- Success confirmation screen
- Back to login navigation

### 4. Protected Routes
- Automatic redirect to login if not authenticated
- Loading states during auth check
- Seamless integration with existing dashboard

## 🔧 Development

### Adding New Auth Features

1. **New Auth Endpoint:**
```javascript
// In auth-server/controllers/authController.js
const newFeature = async (req, res) => {
  // Implementation
};

// In auth-server/routes/auth.js
router.post('/new-feature', authenticate, newFeature);
```

2. **New Auth Page:**
```tsx
// In frontend/src/pages/NewAuthPage.tsx
import { useAuth } from '../context/AuthContext';

export default function NewAuthPage() {
  const { user } = useAuth();
  // Component implementation
}
```

### Customizing UI

All auth components use NovaPivot design tokens:
- `nova-dark`, `nova-darker` for backgrounds
- `nova-teal`, `nova-teal-dark` for accents
- `nova-card`, `nova-border` for surfaces
- `nova-text`, `nova-text-muted` for text

Modify `tailwind.config.js` to update colors.

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
JWT_SECRET=your-production-secret-key
MONGODB_URI=mongodb://your-production-db
FRONTEND_URL=https://your-domain.com
```

### Docker Deployment (Optional)
```dockerfile
# Dockerfile for auth-server
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

## 🧪 Testing

### Manual Testing
1. **Registration Flow:**
   - Visit `/signup`
   - Fill form with valid data
   - Verify account creation
   - Check redirect to dashboard

2. **Login Flow:**
   - Visit `/login`
   - Use created credentials
   - Verify authentication
   - Check dashboard access

3. **Protected Routes:**
   - Try accessing `/dashboard` without login
   - Verify redirect to `/login`
   - Login and try again

4. **Password Reset:**
   - Request password reset
   - Check email (console in dev)
   - Use reset link
   - Verify password change

### API Testing
```bash
# Test registration
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"Test123","confirmPassword":"Test123"}'

# Test login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123"}'
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env
   - Verify network connectivity

2. **JWT Token Issues:**
   - Check JWT_SECRET is set
   - Verify token expiration
   - Clear browser localStorage

3. **CORS Issues:**
   - Ensure frontend URL is in CORS origins
   - Check both servers are running
   - Verify port numbers

4. **Rate Limiting:**
   - Too many failed attempts will lock account
   - Wait 2 hours or reset database
   - Check rate limit settings

### Debug Mode

Enable debug logging:
```bash
# Auth server
DEBUG=* npm run dev

# Frontend
# Check browser console for errors
# Network tab for API calls
```

## 📞 Support

For issues with the authentication system:
1. Check this documentation
2. Review console errors
3. Verify environment variables
4. Test API endpoints directly

## 🔄 Integration with Existing App

The authentication system integrates seamlessly with your existing NovaPivot application:
- Maintains all existing functionality
- Adds authentication protection
- Preserves UI/UX consistency
- Uses same design system

Your existing FastAPI backend continues to work as before for AI features, while the auth server handles user management.
