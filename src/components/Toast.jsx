import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-sage text-white",
    error: "bg-vermillion text-white",
    info: "bg-ink text-cream",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "i",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 ${colors[type]} shadow-2xl animate-fade-up min-w-64 max-w-sm`}
    >
      <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold shrink-0">
        {icons[type]}
      </span>
      <p className="font-body text-sm">{message}</p>
      <button onClick={onClose} className="ml-auto opacity-70 hover:opacity-100 text-lg leading-none">
        ×
      </button>
    </div>
  );
};

export default Toast;
