import nodemailer from "nodemailer";

// ─── Transporter ───────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,   // Gmail App Password
  },
});

// ─── Base HTML wrapper — matches Vectra dark theme ────────────────────────────
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body { margin:0; padding:0; background:#0f172a; font-family:'Segoe UI',sans-serif; }
    .wrapper { max-width:600px; margin:40px auto; background:#1e293b; border-radius:20px; overflow:hidden; border:1px solid #334155; }
    .header { background:linear-gradient(135deg,#f59e0b,#ea580c); padding:32px; text-align:center; }
    .header img { width:64px; height:64px; border-radius:50%; }
    .header h1 { color:#fff; margin:12px 0 0; font-size:22px; font-weight:700; letter-spacing:1px; }
    .body { padding:32px; }
    .body h2 { color:#f1f5f9; font-size:18px; margin:0 0 12px; }
    .body p { color:#94a3b8; font-size:14px; line-height:1.7; margin:0 0 12px; }
    .card { background:#0f172a; border-radius:14px; border:1px solid #334155; padding:20px; margin:20px 0; }
    .card-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #1e293b; }
    .card-row:last-child { border-bottom:none; }
    .card-label { color:#64748b; font-size:13px; }
    .card-value { color:#f1f5f9; font-size:13px; font-weight:600; }
    .total { color:#f59e0b; font-size:18px; font-weight:700; }
    .btn { display:inline-block; margin-top:20px; padding:14px 32px; background:#f59e0b; color:#0f172a; border-radius:12px; text-decoration:none; font-weight:700; font-size:14px; }
    .otp-box { background:#0f172a; border:2px dashed #f59e0b; border-radius:14px; text-align:center; padding:24px; margin:20px 0; }
    .otp-code { font-size:42px; font-weight:800; color:#f59e0b; letter-spacing:12px; }
    .otp-note { color:#64748b; font-size:12px; margin-top:8px; }
    .footer { padding:20px 32px; border-top:1px solid #334155; text-align:center; color:#475569; font-size:12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>⚡ VECTRA</h1>
    </div>
    <div class="body">${content}</div>
    <div class="footer">© ${new Date().getFullYear()} VECTRA Car Rentals · India's Fastest Growing Car Rental Platform</div>
  </div>
</body>
</html>`;

// ─── Send helper ───────────────────────────────────────────────────────────────
const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"VECTRA 🚗" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

// ─── 1. Welcome email on registration ─────────────────────────────────────────
export const sendWelcomeEmail = async ({ to, fullname }) => {
  await sendMail({
    to,
    subject: "Welcome to VECTRA 🚗",
    html: baseTemplate(`
      <h2>Welcome, ${fullname}! 🎉</h2>
      <p>Your VECTRA account has been created successfully. You can now browse our fleet, book cars, and manage your rides all in one place.</p>
      <p>Here's what you can do on VECTRA:</p>
      <div class="card">
        <div class="card-row"><span class="card-label">🚗 Browse Cars</span><span class="card-value">500+ vehicles</span></div>
        <div class="card-row"><span class="card-label">📍 Flexible Pickup</span><span class="card-value">50+ cities</span></div>
        <div class="card-row"><span class="card-label">🧑‍✈️ Driver Option</span><span class="card-value">₹500/day</span></div>
        <div class="card-row"><span class="card-label">🛡️ Fully Insured</span><span class="card-value">Every ride</span></div>
      </div>
      <a href="${process.env.FRONTEND_URL}/cars" class="btn">Browse Cars →</a>
    `),
  });
};

// ─── 2. OTP email ─────────────────────────────────────────────────────────────
export const sendOtpEmail = async ({ to, otp, purpose = "verification" }) => {
  await sendMail({
    to,
    subject: `Your VECTRA OTP: ${otp}`,
    html: baseTemplate(`
      <h2>OTP ${purpose === "reset" ? "for Password Reset" : "Verification"}</h2>
      <p>Use the code below to complete your ${purpose}. It expires in <strong style="color:#f59e0b">10 minutes</strong>.</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <div class="otp-note">Do not share this code with anyone.</div>
      </div>
      <p style="color:#475569;font-size:12px;">If you didn't request this OTP, please ignore this email.</p>
    `),
  });
};

// ─── 3. Booking confirmation email ────────────────────────────────────────────
export const sendBookingConfirmationEmail = async ({
  to, fullname, carName, startDate, endDate, totalDay, totalPrice, pickupLocation, paymentId
}) => {
  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  await sendMail({
    to,
    subject: `Booking Confirmed — ${carName} | VECTRA`,
    html: baseTemplate(`
      <h2>Your Booking is Confirmed! ✅</h2>
      <p>Hi ${fullname}, your car rental has been confirmed and payment received. Here are your booking details:</p>
      <div class="card">
        <div class="card-row"><span class="card-label">Car</span><span class="card-value">${carName}</span></div>
        <div class="card-row"><span class="card-label">Pickup Date</span><span class="card-value">${fmt(startDate)}</span></div>
        <div class="card-row"><span class="card-label">Drop-off Date</span><span class="card-value">${fmt(endDate)}</span></div>
        <div class="card-row"><span class="card-label">Duration</span><span class="card-value">${totalDay} day${totalDay !== 1 ? "s" : ""}</span></div>
        <div class="card-row"><span class="card-label">Pickup Location</span><span class="card-value">${pickupLocation}</span></div>
        <div class="card-row"><span class="card-label">Payment ID</span><span class="card-value">${paymentId}</span></div>
        <div class="card-row"><span class="card-label">Total Paid</span><span class="card-value total">₹${Number(totalPrice).toLocaleString("en-IN")}</span></div>
      </div>
      <a href="${process.env.FRONTEND_URL}/bookings" class="btn">View My Bookings →</a>
    `),
  });
};