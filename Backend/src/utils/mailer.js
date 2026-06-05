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

// ───1. Welcome Email (redesigned with car imagery) ──────────────────────────────
  export const sendWelcomeEmail = async ({ to, fullname }) => {
    await sendMail({
      to,
      subject: "Welcome to VECTRA — Your Journey Starts Here 🚗",
      html: baseTemplate(`
        <div style="text-align:center;margin-bottom:24px">
          <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=560&q=80"
              alt="car" style="width:100%;border-radius:16px;max-height:200px;object-fit:cover"/>
        </div>
        <h2 style="color:#f1f5f9">Welcome aboard, <span style="color:#f59e0b">${fullname}</span>! 🎉</h2>
        <p>Your VECTRA account is ready. You now have access to 500+ cars across 50+ cities — all from your phone or laptop.</p>
        <div class="card">
          <div class="card-row"><span class="card-label">🚗 Browse Fleet</span><span class="card-value">500+ vehicles</span></div>
          <div class="card-row"><span class="card-label">📍 Pickup Anywhere</span><span class="card-value">50+ cities</span></div>
          <div class="card-row"><span class="card-label">🧑‍✈️ Driver Option</span><span class="card-value">₹500/day add-on</span></div>
          <div class="card-row"><span class="card-label">🛡️ Full Insurance</span><span class="card-value">Every car covered</span></div>
          <div class="card-row"><span class="card-label">💳 Secure Payment</span><span class="card-value">Razorpay powered</span></div>
        </div>
        <p style="color:#64748b;font-size:13px">Need help? Reply to this email or visit our website anytime.</p>
        <a href="${process.env.FRONTEND_URL}/cars" class="btn">Browse Cars Now →</a>
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
    to, fullname, carName, carId, licenceNumber,
    startDate, endDate, totalDay, totalPrice, pickupLocation, paymentId
  }) => {
    const fmt = (d) => new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric"
    });

    await sendMail({
      to,
      subject: `✅ Booking Confirmed — ${carName} | VECTRA`,
      html: baseTemplate(`
        <h2 style="color:#f1f5f9">Your Booking is <span style="color:#22c55e">Confirmed</span>! ✅</h2>
        <p>Hi <strong style="color:#f59e0b">${fullname}</strong>, great news — the car owner has confirmed your booking. Here are your complete details:</p>

        <div class="card">
          <div class="card-row"><span class="card-label">🚗 Car</span><span class="card-value">${carName}</span></div>
          <div class="card-row"><span class="card-label">🆔 Car ID</span><span class="card-value" style="font-family:monospace;font-size:11px">${carId}</span></div>
          <div class="card-row"><span class="card-label">📅 Pickup Date</span><span class="card-value">${fmt(startDate)}</span></div>
          <div class="card-row"><span class="card-label">🏁 Drop-off Date</span><span class="card-value">${fmt(endDate)}</span></div>
          <div class="card-row"><span class="card-label">⏱ Duration</span><span class="card-value">${totalDay} day${totalDay !== 1 ? "s" : ""}</span></div>
          <div class="card-row"><span class="card-label">📍 Pickup Location</span><span class="card-value">${pickupLocation}</span></div>
          <div class="card-row"><span class="card-label">🪪 Licence Number</span><span class="card-value">${licenceNumber || "Not provided"}</span></div>
          <div class="card-row"><span class="card-label">💳 Payment ID</span><span class="card-value" style="font-family:monospace;font-size:11px">${paymentId}</span></div>
        </div>

        <div style="background:#0f172a;border:1px solid #22c55e33;border-radius:12px;padding:16px;margin:16px 0;text-align:center">
          <p style="color:#22c55e;font-size:15px;font-weight:700;margin:0">
            Total Paid: ₹${Number(totalPrice).toLocaleString("en-IN")}
          </p>
        </div>

        <p style="color:#94a3b8;font-size:13px">Please carry a valid photo ID and your licence (<strong>${licenceNumber || "update in profile"}</strong>) at the time of pickup.</p>
        <a href="${process.env.FRONTEND_URL}/bookings" class="btn">View My Bookings →</a>
      `),
    });
  };

// ─── 4. Contact Form Submission Email ──────────────────────────────────────────
export const sendContactEmail = async ({ name, email, message }) => {
  // 1. Send notification copy to your platform admin email
  await sendMail({
    to: process.env.EMAIL_USER, // Sends the customer's message to your inbox
    subject: `New Contact Form Submission from ${name} 📬`,
    html: baseTemplate(`
      <h2>New Message Received via Web Contact Form</h2>
      <p>A user has submitted a message on the VECTRA platform. Here are the details:</p>
      <div class="card">
        <div class="card-row"><span class="card-label">Name</span><span class="card-value">${name}</span></div>
        <div class="card-row"><span class="card-label">Email Address</span><span class="card-value">${email}</span></div>
      </div>
      <div class="card" style="background:#0f172a; padding:16px;">
        <p style="color:#64748b; font-size:12px; margin-bottom:4px; text-transform:uppercase;">Message Context:</p>
        <p style="color:#f1f5f9; font-size:14px; white-space:pre-wrap; margin:0;">${message}</p>
      </div>
    `),
  });

  // 2. Send an automated confirmation back to the customer
  await sendMail({
    to: email, // Sends acknowledgment back to the visitor
    subject: "We received your message! — VECTRA 🚗",
    html: baseTemplate(`
      <h2>Hi ${name}, thank you for reaching out! 👋</h2>
      <p>We have successfully received your contact form submission. Our support team is available 24/7 and will review your message immediately.</p>
      <p>If your inquiry is urgent, feel free to reply directly to this email or reach us at +91 98765 43210.</p>
      <div class="card" style="border-left: 4px solid #f59e0b;">
        <p style="color:#94a3b8; font-style:italic; margin:0;">"Our goal is to make car rental simple, transparent, and completely stress-free."</p>
      </div>
    `),
  });
};