# 🌿 AgriComp — Intelligent Land Compensation System

> AI-powered fair farmer land compensation using Machine Learning

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

## 🔐 Demo Credentials

| Role    | Email              | Password   |
|---------|--------------------|------------|
| Farmer  | farmer@demo.com    | demo123    |
| Admin   | admin@demo.com     | admin123   |

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation with notifications + dark mode
│   ├── Sidebar.jsx         # Role-based sidebar navigation
│   ├── DashboardLayout.jsx # Layout wrapper for dashboard pages
│   ├── ProtectedRoute.jsx  # Auth + role-based route guard
│   ├── UI.jsx              # Card, InputField, SelectField, StatCard, Loader, etc.
│   ├── ChartComponent.jsx  # Recharts: Bar, Line, Area, Pie charts
│   └── MapComponent.jsx    # Leaflet.js interactive map
│
├── context/
│   ├── AuthContext.jsx     # JWT auth state + login/signup/logout
│   └── ThemeContext.jsx    # Dark/light mode toggle
│
├── pages/
│   ├── LandingPage.jsx     # Hero + Features + Stats + CTA
│   ├── LoginPage.jsx       # Farmer/Admin role tabs + demo autofill
│   ├── SignupPage.jsx      # 2-step registration with password strength
│   │
│   ├── farmer/
│   │   ├── FarmerDashboard.jsx  # Land form + ML prediction + charts
│   │   ├── MapPage.jsx          # Interactive Leaflet map
│   │   ├── ReportsPage.jsx      # View/download compensation reports
│   │   └── ProfilePage.jsx      # Edit profile + security settings
│   │
│   └── admin/
│       ├── AdminDashboard.jsx   # Overview stats + recent requests
│       ├── RequestsPage.jsx     # Search/filter/paginate + approve/reject
│       ├── AnalyticsPage.jsx    # Charts + district breakdown
│       └── AdminReportsPage.jsx # Full data table + export
│
├── services/
│   └── api.js              # Axios + mock fallback for all API calls
│
└── utils/
    └── helpers.js          # formatCurrency, formatDate, getInitials, etc.
```

## ⚙️ Tech Stack

| Library         | Purpose                     |
|-----------------|-----------------------------|
| React + Vite    | Frontend framework + bundler|
| Tailwind CSS    | Utility-first styling       |
| React Router v6 | Client-side routing         |
| Axios           | API calls with interceptors  |
| Framer Motion   | Animations & transitions    |
| Recharts        | Charts (Bar, Line, Pie)     |
| Leaflet.js      | Interactive maps            |
| React Hot Toast | Toast notifications         |
| Lucide React    | Icons                       |

## 🔗 Backend API

Configure your backend URL in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Expected endpoints:
- `POST /predict` — ML compensation prediction
- `GET /lands` — All land records
- `POST /lands` — Submit new land
- `PATCH /lands/:id/status` — Update status
