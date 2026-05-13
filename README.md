# ASCON Cooperative Management Platform

An enterprise-grade, full-stack financial management and cooperative platform built for the **ASCON Staff Multi-Purpose Co-operative Society Limited**. This platform digitizes community savings, automated payroll deductions, loan processing, and administrative reconciliation with a focus on strict risk management and real-time user engagement.

## 🚀 Key Features

### 👤 Cooperator (User) Experience
* **Progressive Web App (PWA):** Fully installable on iOS, Android, and Desktop for a native app-like experience.
* **Real-Time Dashboard:** Track total verified savings, available credit limits, and active loan statuses via an interactive UI powered by Recharts.
* **Automated Loan Engine:** Loan eligibility and estimated monthly deductions are dynamically calculated based on the cooperative's global interest rates and maximum credit limits.
* **Live Guarantor System:** Request loan guarantees from fellow cooperators using their ASCON File Numbers. Guarantors receive real-time UI notifications (via WebSockets) and secure email alerts (via MailerSend) to seamlessly accept or decline the risk.
* **Immutable Profile Records:** Official cooperative records (File Number, Official Join Date) are locked and protected by the 6-Month Probation Rule for new members.
* **Premium UX/UI Transitions:** Utilizes a centralized `<GlobalSpinner />` and Next.js `loading.tsx` to provide seamless, native-app-like frosted glass overlays during route changes, secure authentication, and data synchronization.
* **Server-Action Security:** Implements robust Next.js Server Actions for secure `HttpOnly` cookie manipulation and strictly enforced, memory-flushing redirects upon user logout.

### 🛡️ Admin Command Center & Risk Management
* **360-Degree CRM Modal:** A comprehensive, desktop-class drawer to view a cooperator's identity, communication logs, and financial ledger side-by-side.
* **Manual Ledger Adjustments:** Granular control to credit or debit accounts for physical cash deposits, dividends, or manual corrections.
* **Reconciliation Engine:** Pause or activate monthly automated payroll deductions for specific users, set custom savings rates, or run the global monthly deduction batch script.
* **System Architecture Controls:** Board-approved power to dynamically adjust global interest rates, credit multipliers, or trigger a "Maintenance Mode" lockout.
* **Immutable Audit Ledger:** Every administrative action (settings overrides, loan approvals, ledger adjustments) is permanently logged to an immutable database table for complete transparency.
* **HR Payroll Export:** Generate 1-click CSV reports of outstanding loan balances and custom date-range queries for the HR payroll team.

---

## 💻 Tech Stack

**Frontend (Client & SSR):**
* **Framework:** Next.js 16 (App Router, running on Turbopack)
* **Language:** TypeScript
* **State Management:** Redux Toolkit (with Server-Side Hydration)
* **Styling:** Tailwind CSS v4 & `next-themes` (Dark/Light Mode)
* **Data Visualization:** Recharts
* **Real-time:** `socket.io-client`
* **PWA Engine:** `@ducanh2912/next-pwa`

**Backend (API & WebSockets):**
* **Environment:** Node.js & Express.js
* **Database:** MongoDB with Mongoose ORM
* **Real-time Server:** Socket.io (WebSocket Tunnel)
* **Authentication:** JSON Web Tokens (JWT) secured via `HttpOnly` Cookies
* **Email Service:** MailerSend API
* **File Storage:** Cloudinary (Memory-buffer upload via Multer)

---

## 🛠️ Local Development Setup

### Prerequisites
* Node.js (v18 or higher)
* MongoDB (Local instance or MongoDB Atlas Cluster)
* Git

### 1. Clone the repository
```bash
git clone [https://github.com/HSSamuel/ASCON-Cooperative.git](https://github.com/HSSamuel/ASCON-Cooperative.git)
cd ascon-cooperative    

## Backend Setup
cd backend
npm install

## .env file in the backend directory:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_jwt_secret
FRONTEND_URL=http://localhost:3000
MAILERSEND_API_KEY=
EMAIL_FROM=alerts@asconalumni.org

# Start the backend server:
npm run dev

## Frontend Setup
** Open a new terminal window:
cd frontend
npm install

.env.local file in the frontend directory:
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000


📂 Project Architecture
The platform utilizes a highly decoupled, modern architecture:

Edge Protection: The Next.js frontend utilizes proxy.ts (Next.js Middleware) to intercept unauthorized access attempts at the edge before rendering.

Hydration Sync: Financial data is fetched securely on the server and injected into the Redux store before the first paint, completely eliminating loading flickers.

Event-Driven UI: Live events (like guarantor requests and admin notices) bypass standard HTTP polling and use a dedicated WebSocket tunnel for millisecond-level responsiveness.

👨‍💻 Developer
Developed and engineered by HUNSA S. Samuel (Admin Assistant | Graphic Design | Full-Stack Developer). Built to strictly enforce cooperative risk management while providing a premium, modern user experience.