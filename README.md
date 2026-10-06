# ⚡ VECTRA — Car Rental Platform

> India's Fastest Growing Car Rental Platform — Book, Pay, Drive.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vectracars.vercel.app-yellow?style=for-the-badge&logo=vercel)](https://vectracars.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://vectra-backend-docker.onrender.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://cloud.mongodb.com)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay-02042B?style=for-the-badge&logo=razorpay)](https://razorpay.com)

---

## 🚗 Live Links

| Service | URL |
|---|---|
| 🌐 Frontend | [vectracars.vercel.app](https://vectracars.vercel.app/) |
| ⚙️ Backend API | [vectra-backend-docker.onrender.com](https://vectra-backend-docker.onrender.com) |

---

## 📸 Preview

><img width="1919" height="859" alt="image" src="https://github.com/user-attachments/assets/38a87fbc-e357-4c56-a0b3-a4dd0d90561a" />


---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [API Overview](#api-overview)
- [Booking Flow](#booking-flow)
- [Screenshots](#screenshots)

---

## 🏁 About

**VECTRA** is a full-stack car rental platform built with the MERN stack. It allows users to browse cars, book them with date selection, pay securely via Razorpay, and manage their bookings — all in one place. Admins can manage their fleet, confirm bookings, and monitor revenue through a real-time dashboard.

Built as part of an internship project at **Euphoria GenX** (ISO 9001:2015 certified) — MERN Stack Development with AI Integration programme.

---

## ✨ Features

### 👤 User
- 🔐 Register / Login with JWT authentication (httpOnly cookies)
- 🔑 Google OAuth login via Passport.js
- 📧 Email OTP verification on registration
- 🚗 Browse and filter cars by body type, fuel, transmission, price
- 📅 Book cars with pickup/drop-off date selection
- 💳 Pay securely via Razorpay (UPI, Cards, Netbanking)
- 💵 Cash on pickup option
- ❤️ Wishlist — save cars for later
- 📦 View and cancel bookings
- 👤 Profile management with avatar upload
- 🔒 Forgot password via email OTP

### 🛠️ Admin
- 📊 Dashboard with revenue, bookings per month chart, top cars, pending alerts
- 🚗 Add, view, and delete cars from fleet
- 📋 View and update booking statuses
- ✅ Confirm bookings → triggers confirmation email to user
- 📩 View contact form submissions

### 📧 Automated Emails
- Welcome email on registration
- OTP email for verification and password reset
- Payment received email (pending confirmation)
- Booking confirmation email with car ID and licence number

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React.js + Vite | UI framework |
| Tailwind CSS | Styling |
| React Router v6 | Client-side routing |
| Axios | API calls |
| Recharts | Admin dashboard charts |
| Context API + useReducer | Global state management |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express.js | Server framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication tokens |
| Passport.js | Google OAuth |
| Razorpay | Payment gateway |
| Cloudinary | Image storage |
| Nodemailer | Transactional emails |
| bcrypt | Password hashing |
| otp-generator | OTP generation |

---

## 📁 Project Structure
```text
VECTRA/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── booking.controllers.js
│   │   │   ├── car.controllers.js
│   │   │   ├── contact.controllers.js
│   │   │   ├── dashboard.controllers.js
│   │   │   ├── otp.controllers.js
│   │   │   ├── payment.controllers.js
│   │   │   ├── user.controllers.js
│   │   │   └── wishlist.controllers.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── Booking.models.js
│   │   │   ├── Car.models.js
│   │   │   ├── Contact.model.js
│   │   │   ├── Otp.model.js
│   │   │   ├── Payment.models.js
│   │   │   ├── User.models.js
│   │   │   └── Wishlist.models.js
│   │   │
│   │   ├── routes/
│   │   │   ├── booking.router.js
│   │   │   ├── car.router.js
│   │   │   ├── contact.router.js
│   │   │   ├── dashboard.router.js
│   │   │   ├── otp.router.js
│   │   │   ├── payment.router.js
│   │   │   ├── user.router.js
│   │   │   └── wishlist.router.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── cloudinary.js
│   │   │   ├── mailer.js
│   │   │   └── passport.js
│   │   │
│   │   ├── app.js
│   │   ├── constants.js
|   |   └── server.js
│   │
│   |
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
└── Frontend/
    ├── public/
    │
    ├── src/
    │   ├── api/
    │   │   ├── apiManager.js
    │   │   ├── bookingService.js
    │   │   ├── carService.js
    │   │   ├── contactService.js
    │   │   ├── dashboardService.js
    │   │   ├── otpService.js
    │   │   ├── paymentService.js
    │   │   ├── userService.js
    │   │   └── wishlistService.js
    │   │
    │   ├── assets/
    │   │
    │   ├── authentication/
    │   │   └── login.jsx
    │   │
    │   ├── components/
    │   │   ├── AdminNavbar.jsx
    │   │   ├── BookingModal.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── OtpModal.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Toast.jsx
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   │
    │   ├── hooks/
    │   │   └── useApi.js
    │   │
    │   ├── pages/
    │   │   ├── Admin.jsx
    │   │   ├── AdminBookings.jsx
    │   │   ├── AdminCars.jsx
    │   │   ├── Cars.jsx
    │   │   ├── Home.jsx
    │   │   ├── MyBookings.jsx
    │   │   ├── UserProfile.jsx
    │   │   └── Wishlist.jsx
    │   │
    │   ├── utils/
    │   │
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    │
    ├── .env.local
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── README.md
    └── vite.config.js
```---

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or newer and npm
- MongoDB database
- Cloudinary account (for car image uploads)
- Razorpay account (for online payments)
- Resend account (for transactional emails)

### 1. Clone the repository

```bash
git clone https://github.com/soul-SUMAN/VECTRA-.git
cd VECTRA-
```

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create `Backend/.env` using the [backend environment variables](#backend-environment-variables) below, then start the API:

```bash
npm run dev
```

The backend listens on `http://localhost:8000` by default. Set `PORT` in `Backend/.env` to override it.

### 3. Setup Frontend

```bash
cd ../Frontend
npm install
```

Create `Frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_BACKEND_URL=http://localhost:8000/api/v1
```

Start the Vite development server:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`. The `VITE_*` values are included in the frontend bundle; do not put secrets in them.

---

## 🔐 Environment Variables

### Backend environment variables

```env
PORT=8000
NODE_ENV=development
MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net

ACCESS_TOKEN_SECKRET=your_access_secret
REFRESH_TOKEN_SECKRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

RESEND_API_KEY=your_resend_api_key

FRONTEND_URL=http://localhost:5173
```

`MONGODB_URL` is the MongoDB connection URL without a database name; the backend appends `vectraDB`. Google OAuth also requires `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL` to be configured in the backend environment. Keep production credentials in the hosting provider's environment settings, never in the repository.

### Frontend environment variables

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_BACKEND_URL=http://localhost:8000/api/v1
```

---

## 🚀 Deployment

The GitHub Actions workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs when code is pushed to `main`. It uses Node.js 24 to:

1. Install backend and frontend dependencies from their lockfiles with `npm ci`.
2. Build the frontend for production.
3. After the checks pass, send deployment webhook requests to Render (backend) and Vercel (frontend).

To enable deployment, add these repository secrets under **Settings → Secrets and variables → Actions**:

| Secret | Purpose |
|---|---|
| `RENDER_DEPLOY_WEBHOOK` | Render deploy hook URL for the backend service |
| `VERCEL_DEPLOY_WEBHOOK` | Vercel deploy hook URL for the frontend project |

Configure the Render service to deploy the `Backend` app and the Vercel project to use `Frontend` as its root directory. Add backend runtime credentials (MongoDB, token secrets, Cloudinary, Razorpay, Resend, and OAuth settings if used) to the Render service's environment variables. Set `FRONTEND_URL` there to the production frontend origin so CORS, authentication redirects, and email links use the deployed site.

The production backend base URL is `https://vectra-backend-docker.onrender.com`; the API base URL is `https://vectra-backend-docker.onrender.com/api/v1`. Set `VITE_API_URL` and `VITE_BACKEND_URL` to that API base in the Vercel project's production environment variables as well as in the GitHub Actions build-check environment. Vercel's deploy hook runs a separate Vercel build, so the values in the GitHub Actions build do not configure that deployment. These `VITE_*` values are compiled into the frontend. If the browser still calls a different Render hostname, update the Vercel environment variables and redeploy the frontend. A successful webhook step confirms that the hosting provider accepted the deployment request; check the Render and Vercel deployment logs to confirm the deployments completed.

---

## 📡 API Overview

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/user/register` | Register new user |
| POST | `/api/v1/user/login` | Login |
| POST | `/api/v1/user/logout` | Logout |
| GET | `/api/v1/user/me` | Get current user |
| POST | `/api/v1/user/refresh` | Refresh access token |
| GET | `/api/v1/user/auth/google` | Google OAuth |

### Cars
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/cars` | Get all cars (with filters) |
| GET | `/api/v1/cars/:id` | Get single car |
| POST | `/api/v1/cars` | Add car (admin) |
| DELETE | `/api/v1/cars/:id` | Delete car (admin) |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/bookings` | Create booking (cash) |
| GET | `/api/v1/bookings/my-bookings` | User's bookings |
| DELETE | `/api/v1/bookings/:id` | Cancel booking |
| GET | `/api/v1/bookings/admin/booking-list` | All bookings (admin) |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/payment/create-order` | Create Razorpay order |
| POST | `/api/v1/payment/verify` | Verify payment + create booking |

### OTP
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/otp/send` | Send OTP to email |
| POST | `/api/v1/otp/verify` | Verify OTP |
| POST | `/api/v1/otp/reset-password` | Reset password |

---

## 💳 Booking Flow

User fills booking form
↓
Selects Online payment
↓
createRazorpayOrder called
(no booking in DB yet)
↓
Razorpay popup opens
↓
User pays
↓
verifyPayment called
(HMAC SHA256 signature check)
↓
Booking created in DB
Status = Pending
↓
Payment received email sent to user
↓
Admin reviews and confirms
↓
Booking Status = Confirmed
↓
Confirmation email sent with
car ID + licence number

---

## 👨‍💻 Author

**Suman Mondal**

[![GitHub](https://img.shields.io/badge/GitHub-soul--SUMAN-black?style=flat&logo=github)](https://github.com/soul-SUMAN)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-suman--mondal-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/suman-mondal-755659266/)
[![Email](https://img.shields.io/badge/Email-sumanmondal1009@gmail.com-red?style=flat&logo=gmail)](mailto:sumanmondal1009@gmail.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ in India</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
