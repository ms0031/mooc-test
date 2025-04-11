"use client";

import { Button } from "./Button";

interface SocialShareProps {
  message: string;
  url?: string;
  platforms?: Array<"twitter" | "linkedin" | "whatsapp">;
  className?: string;
}

/**
 * SocialShare component for sharing content on social media platforms
 * Implements FR013 - Social Sharing requirement
 */
export default function SocialShare({
  message,
  url = typeof window !== "undefined" ? window.location.href : "",
  platforms = ["twitter", "linkedin", "whatsapp"],
  className = "",
}: SocialShareProps) {
  const encodedMessage = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(url);

  const platformConfig = {
    twitter: {
      url: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      bgColor: "bg-[#1DA1F2]",
      hoverColor: "hover:bg-[#1a94da]",
      label: "Twitter",
    },
    linkedin: {
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedMessage}`,
      bgColor: "bg-[#0077B5]",
      hoverColor: "hover:bg-[#006399]",
      label: "LinkedIn",
    },
    whatsapp: {
      url: `https://api.whatsapp.com/send?text=${encodedMessage}`,
      bgColor: "bg-[#25D366]",
      hoverColor: "hover:bg-[#20bd5a]",
      label: "WhatsApp",
    },
  };

  return (
    <div className={`flex space-x-3 ${className}`}>
      {platforms.map((platform) => {
        const config = platformConfig[platform];
        return (
          <a
            key={platform}
            href={config.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${config.bgColor} ${config.hoverColor} transition-colors`}
          >
            {config.label}
          </a>
        );
      })}
    </div>
  );
}