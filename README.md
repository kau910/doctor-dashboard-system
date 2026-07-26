# 🏥 Doctor Dashboard & Appointment Management System with AI Health Assistant

A full-stack **MERN** based Hospital Management System that provides secure role-based access for **Admin**, **Doctor**, and **Patient**. The application includes appointment booking, prescription management, PDF generation, AI-powered health recommendations, and reporting features.

---

## 📌 Features

### 👨‍💼 Admin
- Dashboard Overview
- Manage Doctors (CRUD)
- Manage Patients (CRUD)
- Manage Appointments
- Manage Prescriptions
- Reports & Analytics
- Export Reports

### 👨‍⚕️ Doctor
- Dashboard
- View Assigned Appointments
- Approve / Reject Appointments
- Complete Appointments
- Create Prescriptions
- Download Prescription PDF
- AI Health Recommendation

### 👤 Patient
- Register & Login
- Dashboard
- Book Appointment
- Cancel Appointment
- View Prescriptions
- Download Prescription PDF
- AI Health Assistant

---

# 🚀 Tech Stack

## Frontend
- React.js
- React Router
- Axios
- Tailwind CSS
- React Toastify

## Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt
- PDFKit

## Database
- MongoDB
- Mongoose

## AI
- Google Gemini API

---

# 📂 Project Structure

```
doctor-dashboard-system
│
├── doctor-dashboard-frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
├── docter-dashboard-backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 🔐 Authentication

- JWT Authentication
- Role Based Authorization
- Protected Routes
- Secure Password Hashing (bcrypt)

---

# 👥 User Roles

| Role | Permissions |
|------|-------------|
| Admin | Manage Doctors, Patients, Appointments, Prescriptions & Reports |
| Doctor | Approve Appointments, Create Prescriptions, AI Recommendation |
| Patient | Book Appointments, View Prescriptions, AI Health Assistant |

---

# 📅 Appointment Workflow

```
Patient
    │
    ▼
Book Appointment
    │
    ▼
Pending
    │
    ▼
Doctor Approval
    │
    ▼
Completed
    │
    ▼
Create Prescription
    │
    ▼
Download PDF
```

---

# 🤖 AI Health Assistant

Patients and doctors can enter symptoms to receive AI-generated health recommendations.

Example:

Symptoms

- Fever
- Headache
- Body Pain

Output

- Possible Disease
- Health Recommendation

> AI recommendations are for informational purposes only and are **not a substitute for professional medical advice**.

---

# 📄 Prescription Module

- Create Prescription
- Medicine Details
- Diagnosis
- Doctor Notes
- Follow-up Date
- PDF Download

---

# 📊 Reports

Admin Dashboard includes

- Total Doctors
- Total Patients
- Total Appointments
- Total Prescriptions
- Pending Appointments
- Approved Appointments
- Completed Appointments
- Cancelled Appointments

---

# 🗄️ Database Collections

- Users
- Doctors
- Patients
- Appointments
- Prescriptions

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/kau910/doctor-dashboard-system.git
```

---

## Backend

```bash
cd docter-dashboard-backend
npm install
npm start
```

---

## Frontend

```bash
cd doctor-dashboard-frontend
npm install
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

> Never upload your `.env` file to GitHub.

---

# 📷 Screenshots

Add screenshots inside a `screenshots` folder.

```
screenshots/
│
├── login.png
├── register.png
├── admin-dashboard.png
├── doctor-dashboard.png
├── patient-dashboard.png
├── appointment.png
├── prescription.png
├── ai-assistant.png
└── reports.png
```

---

# 🔮 Future Scope

- Online Video Consultation
- Payment Gateway Integration
- Email Notifications
- SMS Alerts
- Medicine Inventory
- Lab Report Upload
- Mobile Application

---

# 👨‍💻 Author

**Kausen Ansari**

- GitHub: https://github.com/kau910

---

## ⭐ If you like this project, don't forget to give it a Star.
