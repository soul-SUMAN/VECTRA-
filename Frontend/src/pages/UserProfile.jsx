import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUserDetails, updateUserAvatar, changePassword } from "../api/userService";
import Toast from "../components/Toast";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const CameraIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

// ─── Avatar Upload ─────────────────────────────────────────────────────────────
function AvatarUpload({ currentAvatar, onSuccess }) {
  const fileRef = useRef(null);
  const [preview,   setPreview]   = useState(currentAvatar || "/boy.png");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const formData = new FormData();
    formData.append("avtar", file);
    try {
      const res = await updateUserAvatar(formData);
      onSuccess(res.data.data.avatar);
    } catch {
      setPreview(currentAvatar || "/boy.png");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-fit">
      <div className="relative">
        <img
          src={preview}
          alt="avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-yellow-500 shadow-xl shadow-yellow-500/20"
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
            <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      {/* Camera button overlay */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full
                   bg-yellow-500 text-slate-900 shadow-lg border-2 border-slate-800
                   hover:bg-yellow-400 transition disabled:opacity-60"
        title="Change photo"
      >
        <CameraIcon />
      </button>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}

// ─── Field ─────────────────────────────────────────────────────────────────────
function Field({ label, name, value, onChange, type = "text", placeholder, disabled }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
        {label}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} disabled={disabled}
        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500
                   focus:outline-none focus:ring-2 focus:ring-yellow-400 transition
                   disabled:opacity-40 disabled:cursor-not-allowed"
      />
    </div>
  );
}

// ─── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({ icon, title, children }) {
  return (
    <div className="rounded-3xl border border-slate-700/60 bg-slate-800 shadow-lg overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-700/60 px-6 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
          {icon}
        </span>
        <h3 className="text-base font-bold text-white">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function UserProfile() {
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    fullname: "", phone: "", licenceNumber: "",
    address: { addressline1: "", addressline2: "", city: "", state: "", postalcode: "", country: "India" },
  });
  const [passwordForm,    setPasswordForm]    = useState({ oldPassword: "", newPassword: "" });
  const [profileLoading,  setProfileLoading]  = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [toast,           setToast]           = useState(null);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      fullname:      user.fullname      || "",
      phone:         user.phone         || "",
      licenceNumber: user.licenceNumber || "",
      address: {
        addressline1: user.address?.addressline1 || "",
        addressline2: user.address?.addressline2 || "",
        city:         user.address?.city         || "",
        state:        user.address?.state        || "",
        postalcode:   user.address?.postalcode   || "",
        country:      user.address?.country      || "India",
      },
    });
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (["addressline1","addressline2","city","state","postalcode","country"].includes(name)) {
      setProfileForm((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setProfileForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await updateUserDetails(profileForm);
      updateUser(res.data.data);
      setToast({ message: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Update failed", type: "error" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      await changePassword(passwordForm);
      setPasswordForm({ oldPassword: "", newPassword: "" });
      setToast({ message: "Password changed successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Password change failed", type: "error" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ── Hero card ──────────────────────────────────────────────────── */}
        <div className="rounded-3xl border border-slate-700/60 bg-slate-800 shadow-lg overflow-hidden">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-yellow-500/20 via-orange-500/10 to-slate-800 border-b border-slate-700/60" />

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14">
              <AvatarUpload
                currentAvatar={user?.avatar}
                onSuccess={(url) => updateUser({ avatar: url })}
              />
              <div className="sm:pb-1">
                <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                  <h2 className="text-2xl font-extrabold text-white">{user?.fullname}</h2>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-bold ${
                    isAdmin
                      ? "bg-purple-500/15 border-purple-500/30 text-purple-400"
                      : "bg-yellow-500/15 border-yellow-500/30 text-yellow-400"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? "bg-purple-400" : "bg-yellow-400"}`} />
                    {isAdmin ? "Admin" : "User"}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Personal Info ──────────────────────────────────────────────── */}
        <SectionCard icon={<UserIcon />} title="Personal Information">
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Full Name"      name="fullname"      value={profileForm.fullname}      onChange={handleProfileChange} placeholder="Your full name" />
              <Field label="Phone"          name="phone"         value={profileForm.phone}         onChange={handleProfileChange} placeholder="+91 XXXXX XXXXX" />
              <Field label="Licence Number" name="licenceNumber" value={profileForm.licenceNumber} onChange={handleProfileChange} placeholder="DL-XXXXXXXXXX" />
              <Field label="Email"          name="email"         value={user?.email || ""}         onChange={() => {}} disabled />
            </div>

            <div className="border-t border-slate-700/60 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Address</p>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Address Line 1" name="addressline1" value={profileForm.address.addressline1} onChange={handleProfileChange} placeholder="House / Flat no." />
                <Field label="Address Line 2" name="addressline2" value={profileForm.address.addressline2} onChange={handleProfileChange} placeholder="Street / Area" />
                <Field label="City"           name="city"         value={profileForm.address.city}         onChange={handleProfileChange} placeholder="City" />
                <Field label="State"          name="state"        value={profileForm.address.state}        onChange={handleProfileChange} placeholder="State" />
                <Field label="Postal Code"    name="postalcode"   value={profileForm.address.postalcode}   onChange={handleProfileChange} placeholder="PIN Code" />
                <Field label="Country"        name="country"      value={profileForm.address.country}      onChange={handleProfileChange} placeholder="Country" />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="px-8 py-3 rounded-2xl bg-yellow-500 text-slate-900 font-bold text-sm
                         hover:bg-yellow-400 transition active:scale-95 shadow-lg shadow-yellow-500/20
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </SectionCard>

        {/* ── Change Password ────────────────────────────────────────────── */}
        <SectionCard icon={<LockIcon />} title="Change Password">
          <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
            <Field
              label="Current Password" name="oldPassword" type="password"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, oldPassword: e.target.value }))}
              placeholder="Enter current password"
            />
            <Field
              label="New Password" name="newPassword" type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
              placeholder="Min 8 chars, uppercase, number, symbol"
            />
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-8 py-3 rounded-2xl border border-slate-600 bg-slate-700 text-white font-bold text-sm
                         hover:bg-slate-600 transition active:scale-95
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </SectionCard>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}