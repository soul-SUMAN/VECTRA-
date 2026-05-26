import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

const STATS = [
  { value: "500+", label: "Cars Available" },
  { value: "1k+", label: "Happy Customers" },
  { value: "50+", label: "Cities Covered" },
  { value: "24/7", label: "Customer Support" },
];

const FEATURES = [
  { icon: "🚗", title: "Wide Selection", desc: "From compact hatchbacks to luxury SUVs — find the exact car that fits your journey and budget." },
  { icon: "⚡", title: "Instant Booking", desc: "Book in under 2 minutes. Choose your dates, pick your car, confirm — done." },
  { icon: "🛡️", title: "Fully Insured", desc: "Every car on VECTRA is fully insured and verified so you drive with complete peace of mind." },
  { icon: "🧑‍✈️", title: "Driver Option", desc: "Need a driver? Add one at checkout for ₹500/day and sit back and enjoy the ride." },
  { icon: "📍", title: "Flexible Pickup", desc: "Pick up your car from any location that suits you. Drop-off flexibility included." },
  { icon: "💰", title: "Best Prices", desc: "Transparent pricing with zero hidden charges. What you see is exactly what you pay." },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Search & Filter", desc: "Browse our fleet by body type, fuel, transmission, or price. Find your perfect match." },
  { step: "02", title: "Book Instantly", desc: "Select pickup & drop-off dates, choose a driver if needed, and confirm your booking." },
  { step: "03", title: "Pay Securely", desc: "Pay online, by card, or cash. All transactions are safe and fully transparent." },
  { step: "04", title: "Drive & Enjoy", desc: "Pick up your car and hit the road. Our team is on standby 24/7 if you need help." },
];

const TESTIMONIALS = [
  { name: "Arjun Sharma", location: "Kolkata", avatar: "AS", rating: 5, text: "Booked a sedan for a week-long trip. The process was effortless and the car was spotless. VECTRA is my go-to now." },
  { name: "Priya Mehta", location: "Mumbai", avatar: "PM", rating: 5, text: "The driver add-on was a lifesaver on my business trip. Punctual, professional, and great value." },
  { name: "Rahul Das", location: "Delhi", avatar: "RD", rating: 4, text: "Wide variety of cars, fair prices, and customer support actually responds. Highly recommend." },
];

const CAR_TYPES = [
  { label: "SUV", icon: "🚙" },
  { label: "Sedan", icon: "🚗" },
  { label: "Luxury", icon: "💎" },
  { label: "Hatchback", icon: "🚘" },
  { label: "Electric", icon: "⚡" },
  { label: "MUV", icon: "🚐" },
];

function StatCard({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-3xl sm:text-4xl font-extrabold text-yellow-400">{value}</span>
      <span className="text-slate-400 text-sm">{label}</span>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group rounded-3xl border border-slate-700/80 bg-slate-900/90 p-6 transition hover:-translate-y-1 hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-500/10">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10 text-3xl text-yellow-300">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ step, title, desc, isLast }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500 text-slate-950 font-bold text-sm shadow-lg shadow-yellow-500/10">
          {step}
        </div>
        {!isLast && <div className="mt-2 h-full w-px bg-slate-700" />}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ avatar, name, location, rating, text }) {
  return (
    <div className="rounded-3xl border border-slate-700/80 bg-slate-900/90 p-7 shadow-xl shadow-slate-950/20">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-300 font-bold">{avatar}</div>
        <div>
          <p className="text-white font-semibold">{name}</p>
          <p className="text-slate-500 text-sm">{location}</p>
        </div>
      </div>
      <div className="flex gap-1 text-yellow-400 text-sm mb-4">
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </div>
      <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("keyword", search);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    navigate(`/cars?${params.toString()}`);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSent(true);
    setContactForm({ name: "", email: "", message: "" });
    setTimeout(() => setContactSent(false), 4000);
  };

  return (
    <div className="bg-slate-950 text-white">
      <section
        id="home"
        className="relative min-h-[90vh] overflow-hidden"
        style={{
          backgroundImage: "url('/cars.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/80" />
        <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-center mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-300">
              🚀 India's Fastest Growing Car Rental Platform
            </span>
            <h1 className="mt-8 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-white">
              Drive Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Journey.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Rent the car you love — when you need it, where you need it. <span className="text-yellow-400 font-semibold">Zero hassle.</span>
            </p>

            <form onSubmit={handleSearch} className="mt-12 rounded-3xl border border-slate-700/80 bg-slate-900/90 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur">
              <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr_auto]">
                <label className="sr-only" htmlFor="home-search">Search cars</label>
                <input
                  id="home-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by car name or brand"
                  className="min-w-0 rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                />

                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                />

                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                />

                <button
                  type="submit"
                  className="rounded-2xl bg-yellow-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-400"
                >
                  Search Cars
                </button>
              </div>
            </form>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/cars" className="rounded-2xl bg-yellow-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-400">
                Browse All Cars
              </Link>
              <HashLink smooth to="#about" className="rounded-2xl border border-slate-700 px-6 py-3 text-sm text-slate-300 transition hover:border-yellow-500/60 hover:text-white">
                Learn More
              </HashLink>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 border-y border-slate-800">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 mb-10">Browse by type</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {CAR_TYPES.map((type) => (
              <Link
                key={type.label}
                to={`/cars?bodyType=${encodeURIComponent(type.label)}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-yellow-500/50 hover:bg-yellow-500/10 hover:text-yellow-300"
              >
                <span className="text-lg">{type.icon}</span>
                {type.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">Why VECTRA</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Everything you need for a stress-free rental.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400 text-lg leading-8">
              Book the right car, manage your rental, and get support whenever you need it.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 grid gap-16 lg:grid-cols-2 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">How it works</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Book your ride in four simple steps.</h2>
            <p className="mt-5 text-slate-400 text-lg leading-8">
              Start with a search, choose your vehicle, confirm your booking, and enjoy the ride.
            </p>
            <div className="mt-12 space-y-8">
              {HOW_IT_WORKS.map((step, index) => (
                <StepCard key={step.step} {...step} isLast={index === HOW_IT_WORKS.length - 1} />
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-yellow-500/10 blur-3xl" />
            <img
              src="/car-togather.png"
              alt="VECTRA fleet"
              className="relative rounded-[2rem] object-cover shadow-2xl border border-slate-700 w-full max-h-[520px]"
            />
            <div className="absolute -bottom-5 left-5 rounded-3xl border border-slate-700 bg-slate-950/95 px-5 py-4 shadow-xl">
              <p className="text-2xl font-bold text-yellow-400">₹699</p>
              <p className="text-sm text-slate-400">Starting per day</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">Testimonials</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">What our customers say</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400 text-lg leading-8">
              Real reviews from people who rented with VECTRA.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-slate-900 py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 grid gap-16 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-orange-500/10 blur-3xl" />
              <img
                src="/car-togather.png"
                alt="About VECTRA"
                className="relative rounded-[2rem] object-cover shadow-2xl border border-slate-700 w-full max-h-[520px]"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
              🏢 About Us
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Built for <span className="text-orange-500">Indian Roads</span> ;& Drivers</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              At <span className="font-semibold text-white">VECTRA</span>, we believe renting a car should be simple, affordable, and stress-free.
            </p>
            <p className="text-slate-500 leading-relaxed">
              Our platform brings together a wide range of cars, personalized recommendations, transparent pricing, and end-to-end booking management.
            </p>
            <div className="flex flex-wrap gap-10 pt-4">
              <div>
                <p className="text-3xl font-extrabold text-yellow-400">500+</p>
                <p className="text-slate-400 text-sm">Cars Available</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-yellow-400">1k+</p>
                <p className="text-slate-400 text-sm">Satisfied Users</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-6">
              <Link to="/cars" className="rounded-2xl bg-yellow-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-400">
                Explore Our Fleet
              </Link>
              <HashLink smooth to="#contact" className="rounded-2xl border border-slate-700 px-6 py-3 text-sm text-slate-300 transition hover:border-yellow-500/60 hover:text-white">
                Contact Us
              </HashLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-yellow-500 to-orange-500 py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Ready to hit the road?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-900 text-lg leading-8">
            Join 1000+ happy customers who trust VECTRA for their every journey.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/cars" className="rounded-2xl bg-slate-950 px-8 py-3 text-lg font-semibold text-yellow-400 transition hover:bg-slate-900">
              Book a Car Now
            </Link>
            <Link to="/login" className="rounded-2xl border-2 border-slate-950 bg-transparent px-8 py-3 text-lg font-semibold text-slate-950 transition hover:bg-slate-950/10">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-slate-900 py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 grid gap-16 lg:grid-cols-2 items-start">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-300">
              📬 Contact
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Get in <span className="text-orange-500">Touch</span></h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Have a question, feedback, or need support? Our team is available <span className="text-white font-semibold">24/7</span> to help you.
            </p>
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
                <p className="text-slate-500 text-sm">Address</p>
                <p className="mt-2 text-white">123 Car Street, Kolkata, West Bengal</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
                <p className="text-slate-500 text-sm">Phone</p>
                <p className="mt-2 text-white">+91 98765 43210</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
                <p className="text-slate-500 text-sm">Email</p>
                <p className="mt-2 text-white">support@vectra.com</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/30">
            <h3 className="text-xl font-semibold text-white">Send us a message</h3>
            {contactSent && (
              <div className="mt-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                Message sent! We'll get back to you shortly.
              </div>
            )}
            <form onSubmit={handleContactSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  required
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  required
                  rows="5"
                  placeholder="Write your message here..."
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                />
              </div>
              <button type="submit" className="w-full rounded-2xl bg-yellow-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-400">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

     
    </div>
  );
}