"use client";

import { useState } from "react";
import { validateConcertForm, ValidationError } from "@/utils/validation";

interface CreateConcertFormProps {
  onSubmit: (data: { name: string; description: string; totalSeats: number }) => void;
}

export default function CreateConcertForm({ onSubmit }: CreateConcertFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    totalSeats: 500,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const validation = validateConcertForm(formData);
    const newErrors: Record<string, string> = {};

    validation.errors.forEach((error: ValidationError) => {
      newErrors[error.field] = error.message;
    });

    setErrors(newErrors);
    return validation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        setFormData({ name: "", description: "", totalSeats: 500 });
        setErrors({});
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Concert Name
          </label>
          <input type="text" id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Please input concert name" className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"}`} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="totalSeats" className="block text-sm font-medium text-gray-700 mb-2">
            Total of seat
          </label>
          <div className="relative">
            <input type="number" id="totalSeats" value={formData.totalSeats} onChange={(e) => handleChange("totalSeats", parseInt(e.target.value) || 0)} min="1" className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.totalSeats ? "border-red-500" : "border-gray-300"}`} />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">👥</span>
          </div>
          {errors.totalSeats && <p className="mt-1 text-sm text-red-600">{errors.totalSeats}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea id="description" value={formData.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Please input description" rows={4} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? "border-red-500" : "border-gray-300"}`} />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
            <span>💾</span>
            <span>{isSubmitting ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
