# ⚡ VECTRA — Car Rental Platform

> India's Fastest Growing Car Rental Platform — Book, Pay, Drive.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vectracars.vercel.app-yellow?style=for-the-badge&logo=vercel)](https://vectracars.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://vectra-backend-2er2.onrender.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://cloud.mongodb.com)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay-02042B?style=for-the-badge&logo=razorpay)](https://razorpay.com)

---

## 🚗 Live Links

| Service | URL |
|---|---|
| 🌐 Frontend | [vectracars.vercel.app](https://vectracars.vercel.app/) |
| ⚙️ Backend API | [vectra-backend-2er2.onrender.com](https://vectra-backend-2er2.onrender.com) |

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
```
vectra/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── user.controllers.js
│   │   │   ├── car.controllers.js
│   │   │   ├── booking.controllers.js
│   │   │   ├── payment.controllers.js
│   │   │   ├── wishlist.controllers.js
│   │   │   ├── dashboard.controllers.js
│   │   │   ├── contact.controllers.js
│   │   │   └── otp.controllers.js
│   │   ├── models/
│   │   │   ├── User.models.js
│   │   │   ├── Car.models.js
│   │   │   ├── Booking.models.js
│   │   │   ├── Payment.models.js
│   │   │   ├── Wishlist.models.js
│   │   │   ├── Contact.model.js
│   │   │   └── Otp.model.js
│   │   ├── routes/
│   │   │   ├── user.router.js
│   │   │   ├── car.router.js
│   │   │   ├── booking.router.js
│   │   │   ├── payment.router.js
│   │   │   ├── wishlist.router.js
│   │   │   ├── dashboard.router.js
│   │   │   ├── contact.router.js
│   │   │   └── otp.router.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── utils/
│   │   │   ├── mailer.js
│   │   │   ├── passport.js
│   │   │   ├── cloudinary.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── ApiError.js
│   │   │   └── ApiResponse.js
│   │   ├── app.js
│   │   └── index.js
│   └── package.json
│
└── frontend/
├── src/
│   ├── api/
│   │   ├── apiManager.js
│   │   ├── userService.js
│   │   ├── carService.js
│   │   ├── bookingService.js
│   │   ├── paymentService.js
│   │   ├── wishlistService.js
│   │   ├── contactService.js
│   │   ├── dashboardService.js
│   │   └── otpService.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── BookingModal.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Toast.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Cars.jsx
│   │   ├── MyBookings.jsx
│   │   ├── Wishlist.jsx
│   │   ├── UserProfile.jsx
│   │   ├── Login.jsx
│   │   ├── Admin.jsx
│   │   ├── AdminCars.jsx
│   │   └── AdminBookings.jsx
│   └── main.jsx
└── package.json
```
---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Razorpay account
- Gmail account with App Password

### 1. Clone the repository

```bash
git clone https://github.com/soul-SUMAN/vectra.git
cd vectra
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` — see [Environment Variables](#environment-variables) below.

```bash
npm run dev
```

Backend runs on `http://localhost:4000`

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔐 Environment Variables

### `backend/.env`

```env
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/vectra

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/v1/user/auth/google/callback

EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password

FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

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
