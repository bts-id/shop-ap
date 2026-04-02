import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password.trim()) errs.password = "Password is required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setToast({ message: err.message || "Invalid credentials. Try john@mail.com / changeme", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setForm({ email: "john@mail.com", password: "changeme" });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink relative overflow-hidden flex-col justify-between p-12">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-vermillion flex items-center justify-center">
              <span className="text-cream font-display font-bold text-sm">S</span>
            </div>
            <span className="font-display font-bold text-cream text-xl">ShopDip</span>
          </Link>
        </div>

        <div className="relative z-10">
          <blockquote className="font-display text-4xl text-cream leading-tight mb-6">
            "Discover products that<br />
            <em className="text-amber">define your style.</em>"
          </blockquote>
          <p className="font-body text-mist text-sm">Access thousands of curated products.</p>
        </div>

        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-6 h-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border-r border-cream/50 h-full" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-vermillion/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 animate-fade-up">
            <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
              <div className="w-6 h-6 bg-ink flex items-center justify-center">
                <span className="text-cream font-display font-bold text-xs">S</span>
              </div>
              <span className="font-display font-bold text-ink">ShopDip</span>
            </Link>
            <p className="font-mono text-vermillion text-xs uppercase tracking-[0.3em] mb-2">Welcome back</p>
            <h1 className="font-display text-4xl font-bold text-ink">Sign in to your account</h1>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            {/* Email */}
            <div className="animate-fade-up stagger-1">
              <label className="block font-mono text-xs uppercase tracking-widest text-ink/50 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="input-field"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 font-body text-xs text-vermillion">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="animate-fade-up stagger-2">
              <label className="block font-mono text-xs uppercase tracking-widest text-ink/50 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="mt-1 font-body text-xs text-vermillion">{errors.password}</p>
              )}
            </div>

            <div className="animate-fade-up stagger-3 space-y-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary w-full relative">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : "Sign In"}
              </button>

              <button type="button" onClick={fillDemo} className="w-full text-center font-body text-sm text-ink/50 hover:text-vermillion transition-colors py-2 underline underline-offset-4">
                Use demo credentials
              </button>
            </div>
          </form>

          {/* Demo hint */}
          <div className="mt-8 p-4 bg-ink/5 border border-ink/10 animate-fade-up stagger-4">
            <p className="font-mono text-xs text-ink/50 uppercase tracking-widest mb-2">Demo Account</p>
            <p className="font-body text-sm text-ink/70">Email: <span className="font-mono text-ink">john@mail.com</span></p>
            <p className="font-body text-sm text-ink/70">Password: <span className="font-mono text-ink">changeme</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
