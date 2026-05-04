# ASCON Cooperative Management Platform

An enterprise-grade, full-stack financial management and cooperative platform built for the ASCON Staff Multi-Purpose Co-operative Society Limited. This platform digitizes community savings, automated payroll deductions, loan processing, and administrative reconciliation.

## 🚀 Key Features

### 👤 Cooperator (User) Features
* **Real-Time Dashboard:** Track total verified savings, available credit limits, and active loan statuses with an interactive UI.
* **Automated Loan Engine:** Loan eligibility is automatically calculated based on the cooperative's strict risk-management rules.
* **Guarantor System:** Request loan guarantees from fellow cooperators using their ASCON File Numbers. Guarantors receive real-time UI notifications (WebSockets) and email alerts to accept or decline the risk.
* **Live Notifications:** Get instant alerts for account credits, loan approvals, and system broadcasts.
* **Immutable Profile Records:** Official cooperative records (File Number, Date Joined) are locked to maintain financial integrity.

### 🛡️ Admin & Risk Management Command Center
* **360-Degree CRM Drawer:** A massive, desktop-class modal to view a cooperator's identity and financial ledger side-by-side.
* **Manual Ledger Adjustments:** Easily credit or debit accounts for physical cash deposits or manual corrections.
* **Reconciliation Engine Settings:** Pause or activate monthly automated payroll deductions for specific users, or set custom savings rates.
* **Legacy Member Backdating:** Securely adjust the "Official Join Date" for legacy cooperators migrating to the digital platform.
* **Credit Limit Override:** Board-approved power to manually bypass the 2x savings rule for special cases.
* **System Audit Ledger:** Every admin action (overrides, loan approvals, ledger adjustments) is permanently logged to an immutable database table for complete transparency.
* **Payroll Report Generation:** Export 1-click CSV files of outstanding loan balances for HR payroll processing.

## ⚙️ Core Business Rules Enforced
1. **The 2x Savings Rule:** A user's maximum credit limit is strictly calculated as `Total Verified Savings × 2`.
2. **The 6-Month Probation:** New members must be active for 6 months before unlocking loan eligibility.
3. **Single Active Loan:** Cooperators cannot request a new loan if they have an active/pending loan in the system.
4. **Guarantor Independence:** A user cannot guarantee their own loan, and two *different* guarantors are strictly required.

## 💻 Tech Stack

**Frontend:**
* [Next.js](https://nextjs.org/) (React Framework)
* TypeScript
* Tailwind CSS
* Axios (Data Fetching)
* React Hot Toast (Notifications)
* Socket.io-client (Real-time updates)

**Backend:**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
* MongoDB with Mongoose (Database & ORM)
* Socket.io (WebSocket Server)
* JSON Web Tokens (JWT) for secure Authentication
* Nodemailer (Automated Emails & Magic Links)

## 🛠️ Local Development Setup

### Prerequisites
* Node.js (v18 or higher)
* MongoDB (Local instance or MongoDB Atlas URI)
* Git

### 1. Clone the repository
```bash
git clone [https://github.com/HSSamuel/ASCON-Cooperative.git]
cd ascon-cooperative    

## Backend Setup
cd backend
npm install

## .env file in the backend directory:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_jwt_secret
FRONTEND_URL=http://localhost:3000
EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_smtp_user
EMAIL_PASS=your_smtp_password

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
The platform utilizes a decoupled architecture. The Next.js frontend securely communicates with the Express REST API via JWT Bearer tokens. Live events (like guarantor requests) bypass standard HTTP polling and use a dedicated WebSocket tunnel for millisecond-level responsiveness.

👨‍💻 Developer
Developed and engineered by Samuel (Technical Design Consultant & Full-Stack Developer). Built to strictly enforce cooperative risk management while providing a premium, modern user experience.