# 🚀 TaskFlow - Production-Level Workload Automator

A comprehensive, **production-ready** AI-powered workload automation platform with Firebase authentication, real-time database, and enterprise-grade architecture.

![TaskFlow Dashboard](./screenshots/dashboard.png)

## 🌟 **Production Features**

### ✅ **Complete Authentication System**
- **Google OAuth** integration via Firebase
- Protected routes with authentication guards
- Session management and auto-login
- User profile with photo and display name
- Secure logout functionality

### 🔥 **Firebase Backend Integration**
- **Firestore Database** for all data persistence
- Real-time data synchronization
- User-specific data isolation (`users/{userId}/...`)
- Automatic timestamp management
- Error handling and retry logic

### 🎨 **Beautiful Landing Page** 
- Modern gradient design
- Feature showcase
- Call-to-action sections
- Responsive layout
- Professional branding

### 📊 **Full-Featured Dashboard**
- Tasks, Automations, Routines, Reminders
- Calendar view with events
- Analytics and reports
- Settings management
- All features with Firebase backend

## 🛠️ **Tech Stack**

### **Frontend**
- React 18 with TypeScript
- Vite 7.2 (Lightning-fast builds)
- React Router DOM v7 (Client-side routing)
- Recharts (Data visualization)
- Lucide React (Icons)
- date-fns (Date formatting)

### **Backend & Services**
- Firebase Authentication (Google OAuth)
- Cloud Firestore (NoSQL database)
- Firebase Hosting ready
- React Firebase Hooks

### **Architecture**
- Context API for state management
- Protected routes pattern
- Service layer for database operations
- Type-safe TypeScript throughout

## 📦 **Installation & Setup**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Firebase Configuration**
The app is pre-configured with the provided Firebase credentials:
- Project: `automex-ai`
- Authentication: Google OAuth enabled
- Database: Cloud Firestore

### **3. Run Development Server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### **4. Build for Production**
```bash
npm run build
```

### **5. Preview Production Build**
```bash
npm run preview
```

## 🚀 **Deployment**

### **Firebase Hosting** (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init hosting

# Deploy
firebase deploy
```

### **Other Hosting** (Vercel, Netlify, etc.)
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18+

## 📁 **Project Structure**

```
workload-automator/
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx              # Navigation sidebar
│   │   ├── Header.tsx               # Header with user menu
│   │   └── ProtectedRoute.tsx       # Route guard component
│   ├── contexts/
│   │   └── AuthContext.tsx          # Authentication state management
│   ├── lib/
│   │   ├── firebase.ts              # Firebase configuration
│   │   └── firestore.ts             # Database operations service
│   ├── pages/
│   │   ├── LandingPage.tsx          # Public landing page
│   │   ├── LoginPage.tsx            # Google OAuth login
│   │   ├── Dashboard.tsx            # Main dashboard
│   │   ├── TasksPage.tsx            # Task management
│   │   ├── AutomationsPage.tsx      # Automation builder
│   │   ├── RoutinesPage.tsx         # Smart routines
│   │   ├── RemindersPage.tsx        # Reminder management
│   │   ├── CalendarPage.tsx         # Calendar view
│   │   ├── ReportsPage.tsx          # Analytics & reports
│   │   └── SettingsPage.tsx         # User settings
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   ├── data/
│   │   └── mockData.ts              # Sample data (for dev/demo)
│   ├── App.tsx                      # Main app with routing
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── firebase.json                     # Firebase configuration
├── package.json
└── README.md
```

## 🔐 **Authentication Flow**

1. **Landing Page** (`/`) - Public marketing page
2. **Login Page** (`/login`) - Google OAuth sign-in
3. **Protected Dashboard** (`/dashboard/*`) - Requires authentication
4. **Auto-redirect** - Unauthenticated users → Login page

## 💾 **Database Schema**

### **Firestore Collections Structure**
```
users/{userId}/
  ├── tasks/
  │   └── {taskId}/ - Task document
  ├── automations/
  │   └── {automationId}/ - Automation document
  ├── routines/
  │   └── {routineId}/ - Routine document
  └── reminders/
      └── {reminderId}/ - Reminder document
```

### **Data Isolation**
- Each user's data is isolated in their own subcollection
- No cross-user data access
- Firestore Security Rules protect user data

## 🔧 **Environment Variables** (Optional)

Create `.env` file for development:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 📊 **Firestore Operations**

All database operations are available in `src/lib/firestore.ts`:

```typescript
// Tasks
getTasks(userId)
addTask(userId, task)
updateTask(userId, taskId, updates)
deleteTask(userId, taskId)

// Automations
getAutomations(userId)
addAutomation(userId, automation)
updateAutomation(userId, automationId, updates)
deleteAutomation(userId, automationId)

// Routines
getRoutines(userId)
addRoutine(userId, routine)
updateRoutine(userId, routineId, updates)
deleteRoutine(userId, routineId)

// Reminders
getReminders(userId)
addReminder(userId, reminder)
updateReminder(userId, reminderId, updates)
deleteReminder(userId, reminderId)
```

## 🎯 **Key Features**

### **1. Smart Automations**
- Visual flow builder (Trigger → Condition → Action)
- Multiple trigger types (Time, Task-based, Activity, Calendar)
- Conditional logic
- Automated task creation

### **2. Task Management**
- Priority levels (High, Medium, Low)
- Deadlines and due dates
- Tags and categories
- Completion tracking
- Recurring tasks

### **3. Smart Routines**
- Morning, evening, and custom routines
- Task bundles
- Repeat schedules
- Enable/disable toggles

### **4. Reminders**
- Timeline visualization
- Multi-channel notifications (Web, Email, Telegram)
- Custom repeat frequencies
- Snooze functionality

### **5. Calendar**
- Month, Week, and Day views
- Task and event visualization
- Drag-and-drop scheduling
- Event indicators

### **6. Analytics**
- Completion rate charts
- Activity heatmaps
- Automation impact metrics
- Productivity insights

## 🛡️ **Security**

- ✅ Firebase Authentication
- ✅ Protected routes
- ✅ User data isolation
- ✅ Secure API calls
- ✅ XSS protection
- ✅ CSRF protection

## 🌍 **Browser Support**

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 **License**

MIT License - Free for personal and commercial use

---

**🎊 Built with ❤️ using React, TypeScript, and Firebase**

**⚡ TaskFlow** - Automate your workload, amplify your productivity!
