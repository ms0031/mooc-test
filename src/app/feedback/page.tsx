"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

// NEW: A reusable Star component for the rating system
const Star = ({ filled, onClick }: { filled: boolean; onClick: () => void; }) => (
    <button type="button" onClick={onClick} className="focus:outline-none focus:ring-2 focus:ring-yellow-400/50 rounded-full">
        <svg
            className={`w-8 h-8 transition-colors duration-200 ${
            filled ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-400'
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
        >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
    </button>
);

export default function FeedbackPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    type: "bug",
    rating: 0, // Changed initial rating to 0 for better UX
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const feedbackTypes = [
      { id: "bug", label: "Report a Bug" },
      { id: "feature", label: "Suggest a Feature" },
      { id: "improvement", label: "Suggest an Improvement" },
      { id: "other", label: "Other" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleTypeSelect = (type: string) => {
      setFormData(prev => ({ ...prev, type }));
      setIsDropdownOpen(false);
  };

  const handleRating = (rating: number) => {
      setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) {
        setError("Please provide a rating.");
        return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit feedback");
      }

      setSubmitSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit feedback. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const selectedTypeLabel = feedbackTypes.find(t => t.id === formData.type)?.label;

  return (
    <main className="min-h-screen relative">
      <BackgroundGradientAnimation 
            gradientBackgroundStart="rgb(2, 6, 23)" 
            gradientBackgroundEnd="rgb(2, 6, 23)" 
            firstColor="20, 90, 100"       // Darkest Teal
            secondColor="50, 40, 130"      // Deep Indigo
            thirdColor="80, 60, 110"       // Muted Purple
            fourthColor="30, 80, 70"       // Forest Green
            fifthColor="120, 80, 40"       // Muted Amber
            interactive={false}
            containerClassName="fixed inset-0 -z-10"
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg bg-black/20 rounded-3xl border border-white/15 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10 text-center">
            <h1 className="text-2xl font-bold text-white">Share Your Feedback</h1>
            <p className="text-gray-400 text-sm mt-1">We'd love to hear what you think.</p>
          </div>

          <div className="p-8">
            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                    <div className="bg-green-500/10 p-3 rounded-full border-2 border-green-500/30">
                        <svg className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                </div>
                <h2 className="mt-2 text-xl font-medium text-gray-200">
                  Thank you!
                </h2>
                <p className="mt-2 text-gray-300">
                  Your feedback has been submitted successfully.
                </p>
                <div className="mt-8">
                  <Button variant="glass" onClick={() => router.push("/")}>
                    Return to Home
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-xl bg-red-500/20 border border-red-500/50 p-3 text-center text-sm font-medium text-red-300">
                    {error}
                  </div>
                )}

                {/* Custom Dropdown for Feedback Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Feedback Type
                  </label>
                  <div className="relative">
                    <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full flex items-center justify-between bg-black/20 border border-white/15 rounded-xl py-3 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <span>{selectedTypeLabel}</span>
                        <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-gray-200">
                        Change
                          <svg className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute z-20 mt-2 w-full bg-slate-900 backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-lg">
                        {feedbackTypes.map((type) => (
                          <button key={type.id} type="button" onClick={() => handleTypeSelect(type.id)} className={`w-full text-white text-left rounded-xl px-2 py-2 mb-1 hover:bg-white/10 ${formData.type === type.id ? 'bg-white/10' : ''}`}>
                            {type.label}
                          </button>
                        ))}
                          
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Custom Star Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Rate Your Experience
                    </label>
                    <div className="mt-1 flex items-center justify-center space-x-2 bg-black/20 p-4 rounded-xl border border-white/15">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <Star
                                key={rating}
                                filled={rating <= formData.rating}
                                onClick={() => handleRating(rating)}
                            />
                        ))}
                    </div>
                </div>

                {/* Styled Textarea */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    id="message" name="message" rows={5}
                    value={formData.message} onChange={handleChange} required
                    className="shadow-sm block w-full sm:text-sm border border-white/20 bg-white/5 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-teal-500"
                    placeholder="Please describe your issue or suggestion..."
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="glass" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="glassTeal" disabled={isSubmitting || !formData.message}>
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
