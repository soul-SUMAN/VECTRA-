import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

export default function Footer() {
  return (
    <div>    

        <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/VECTRA-LOGO.png" alt="Vectra" className="h-10 w-10 rounded-full" />
                <span className="text-xl font-bold text-white">VECTRA</span>
              </div>
              <p className="text-slate-500 text-sm">India's trusted car rental platform. Drive with confidence.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/cars" className="hover:text-yellow-400">Browse Cars</Link></li>
                <li><Link to="/bookings" className="hover:text-yellow-400">My Bookings</Link></li>
                <li><Link to="/wishlist" className="hover:text-yellow-400">Wishlist</Link></li>
                <li><Link to="/profile" className="hover:text-yellow-400">My Profile</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><HashLink smooth to="#about" className="hover:text-yellow-400">About Us</HashLink></li>
                <li><HashLink smooth to="#contact" className="hover:text-yellow-400">Contact</HashLink></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#" className="hover:text-yellow-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-yellow-400">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-800 pt-6 text-slate-500 text-sm sm:flex-row sm:justify-between">
            <span>© {new Date().getFullYear()} VECTRA. All rights reserved.</span>
            <span>Made with ❤️ in India</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
