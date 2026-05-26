import React, { useEffect } from "react";

/**
 * Toast — lightweight in-app notification.
 * @param {string}  message
 * @param {"success"|"error"|"info"} type
 * @param {function} onClose
 */
export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-green-600",
    error:   "bg-red-600",
    info:    "bg-slate-700",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl text-white text-sm shadow-xl animate-slide-in ${styles[type]}`}
      role="alert"
    >
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white/70 hover:text-white transition-colors"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}
