import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

const AddProductPage = ({ onProductAdded }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    categoryId: "",
    images: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch("https://api.escuelajs.co/api/v1/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    else if (form.title.length > 150) errs.title = "Title must be 150 characters or less";
    if (!form.price) errs.price = "Price must be a number";
    else if (isNaN(Number(form.price)) || Number(form.price) < 0) errs.price = "Price must be a valid positive number";
    if (!form.categoryId) errs.categoryId = "Category is required";
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
      const imagesArray = form.images
        ? form.images.split(",").map((s) => s.trim()).filter(Boolean)
        : ["https://placehold.co/400x300/1A1A2E/F5F0E8?text=Product"];

      const payload = {
        title: form.title,
        price: Number(form.price),
        description: form.description || "",
        categoryId: Number(form.categoryId),
        images: imagesArray,
      };

      const res = await fetch("https://api.escuelajs.co/api/v1/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create product");
      }

      const created = await res.json();
      onProductAdded(created);
      setToast({ message: `"${created.title}" added successfully!`, type: "success" });

      // Reset form
      setForm({ title: "", price: "", description: "", categoryId: "", images: "" });

      // Navigate after short delay
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setToast({ message: err.message || "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-ink/40 hover:text-vermillion transition-colors mb-6 font-body text-sm">
          <span>←</span> Back to products
        </button>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-vermillion mb-2">New Entry</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink">Add Product</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white border border-ink/5 p-8 space-y-8">
          {/* Title */}
          <div className="animate-fade-up stagger-1">
            <label className="block font-mono text-xs uppercase tracking-widest text-ink/50 mb-2">
              Product Title <span className="text-vermillion">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter product title..."
              maxLength={150}
              className="input-field"
            />
            <div className="flex justify-between mt-1">
              {errors.title ? (
                <p className="font-body text-xs text-vermillion">{errors.title}</p>
              ) : <span />}
              <p className={`font-mono text-xs ${form.title.length > 130 ? "text-vermillion" : "text-ink/30"}`}>
                {form.title.length}/150
              </p>
            </div>
          </div>

          {/* Price + Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-up stagger-2">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-ink/50 mb-2">
                Price (USD) <span className="text-vermillion">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-ink/40 pb-1">$</span>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="input-field pl-4"
                />
              </div>
              {errors.price && <p className="mt-1 font-body text-xs text-vermillion">{errors.price}</p>}
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-ink/50 mb-2">
                Category <span className="text-vermillion">*</span>
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="input-field appearance-none cursor-pointer"
              >
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 font-body text-xs text-vermillion">{errors.categoryId}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="animate-fade-up stagger-3">
            <label className="block font-mono text-xs uppercase tracking-widest text-ink/50 mb-2">
              Description <span className="text-ink/30">(optional)</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your product..."
              rows={4}
              className="w-full bg-cream/50 border border-ink/10 px-4 py-3 font-body text-ink placeholder-ink/30 focus:outline-none focus:border-vermillion transition-colors resize-none text-base"
            />
          </div>

          {/* Images */}
          <div className="animate-fade-up stagger-4">
            <label className="block font-mono text-xs uppercase tracking-widest text-ink/50 mb-2">
              Image URLs <span className="text-ink/30">(optional, comma-separated)</span>
            </label>
            <input
              name="images"
              value={form.images}
              onChange={handleChange}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              className="input-field"
            />
            <p className="mt-1 font-body text-xs text-ink/30">Separate multiple URLs with commas. Leave empty for placeholder.</p>
          </div>

          {/* Divider */}
          <div className="border-t border-ink/10" />

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                  Adding product...
                </>
              ) : (
                "Add Product"
              )}
            </button>
            <button type="button" onClick={() => navigate("/")} className="btn-secondary px-6">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
