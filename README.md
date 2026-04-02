# Zorvyn — Assignment 
**Name**: Sumit Negi  
**Email**: negisumit308@gmail.com  
**Role**: Backend Developer Intern (Internship Assignment)

**Note**: for frontend i use ai help to design page and for styling for backend i design first database model, and create api/routes i use ai help to check logs and where i was struggling, rest backend is design by me itself
i use node js and express , mongo beacuse i used this in my  prior internship and have foundation knowledge of mern
although i am comfortable to work with java and spring boot.... 

---

## Project Overview
This is a **Finance Data Processing and Access Control** system. It helps organizations manage financial records and gives different access levels to users based on their roles. I have built this using **Node.js/Express** for the backend and **Next.js** for the frontend dashboard.

### Core Features
1. **User & Role Management**: Admins can manage users and change their roles or status.
2. **Financial Records**: Support for Income/Expense entries with categories and filtering.
3. **Dashboard Analytics**: Real-time summary of Total Income, Expenses, and Net Balance.
4. **Access Control**: 
    - **Admin**: Full access to everything.
    - **Analyst**: Can view data and insights.
    - **Viewer**: Can only see the dashboard data.

---

## How to Run the Project

### 1. Backend Setup
1. Go to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Start the server: `npm install && npm start`
   - The **Live API** is available at: `https://zorvyn-finance-backend-2.onrender.com/api`
   - During local development, it runs on port `4000`.

### 2. Frontend Setup
1. Go to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the app: `npm run dev`
   - The app will now communicate with the **live Render backend** (configured in `.env.local`).
   - Open your browser at: `http://localhost:3000`

---

## Test Accounts (For Evaluation)
I have created these accounts so you can test different role-based accesses easily:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@zorvyn.com` | `pass@123` |
| **Analyst** | `analyst@zorvyn.com` | `pass@123` |
| **Viewer** | `viewer@zorvyn.com` | `pass@123` |

---

## API Endpoints (Quick Reference)
- **Auth**: `/api/auth/login`, `/api/auth/register`
- **Dashboard**: `/api/dashboard/summary`, `/api/dashboard/trends`, `/api/dashboard/recent`
- **Users**: `/api/users` (Admin only)
- **Records**: `/api/records` (CRUD)

---

## My Assumptions
- **First User**: The very first user to register on the platform automatically becomes an **Admin**.
- **Organization Centric**: I assumed that financial records are visible to all authenticated staff (Viewer/Analyst/Admin) within the same organization for transparency.
- **Security**: Used JWT for secure token-based authentication and Bcrypt for password hashing.
- **Data**: Used MongoDB with Mongoose for flexible data storage.

---

Thank you for reviewing my assignment! I hope this implementation meets your expectations.
