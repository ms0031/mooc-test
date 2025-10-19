"use client";

import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useBookmarkStore } from "@/lib/stores/bookmarkStore";
import { triggerHapticFeedback, HapticFeedbackType } from "@/utils/haptics";

interface BookmarkButtonProps {
  qid: string;
}

export default function BookmarkButton({ qid }: BookmarkButtonProps) {
  const { bookmarkedQids, addBookmark, removeBookmark } = useBookmarkStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const isBookmarked = bookmarkedQids.includes(qid);

  const handleToggleBookmark = async () => {
    triggerHapticFeedback(HapticFeedbackType.Heavy);
    setIsAnimating(true);
    const wasBookmarked = isBookmarked;

    try {
      // Make API call first
      const response = await fetch(
        wasBookmarked
          ? `/api/bookmarks?qid=${encodeURIComponent(qid)}`
          : "/api/bookmarks",
        {
          method: wasBookmarked ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: wasBookmarked ? null : JSON.stringify({ qid }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update bookmark");
      }

      // Update state only after successful API call
      if (wasBookmarked) {
        removeBookmark(qid);
        toast.success("Bookmark removed", {
          style: {
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            color: "#f1f5f9",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: '9999px',
          },
          icon: "🗑️",
        });
      } else {
        addBookmark(qid);
        toast.success("Bookmark added", {
          style: {
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            color: "#f1f5f9",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: '9999px',
          },
          icon: "⭐",
        });
      }
    } catch (error) {
      toast.error(
        wasBookmarked ? "Failed to remove bookmark" : "Failed to add bookmark",
        {
          style: {
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            color: "#f1f5f9",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          },
        }
      );
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <>
      <button
        onClick={handleToggleBookmark}
        className={`bg-white/10 border border-white/15 backdrop-blur-sm rounded-full p-1 transition-colors duration-300 ${
          isBookmarked
            ? "text-yellow-400 hover:text-yellow-500"
            : "text-gray-400 hover:text-yellow-300"
        } ${isAnimating ? "scale-110" : "scale-100"} transition-transform`}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          className={`transition-all duration-300 ${
            isAnimating ? "animate-pulse" : ""
          }`}
          fill={isBookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
    </>
  );
}
