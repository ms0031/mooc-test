"use client";

import React from 'react';

// Defines the props that the ToggleSwitch component will accept.
type ToggleSwitchProps = {
  label: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
    isDisabled?: boolean;
    isRed?: boolean;
};

const ToggleSwitch = ({
  label,
  description,
  isEnabled,
  onToggle,
  isDisabled = false,
  isRed = false,
}: ToggleSwitchProps) => {
  return (
    <div className={`flex items-center justify-between py-3 ${isDisabled ? 'opacity-30' : ''}`}>
      {/* Text content for the toggle */}
      <div>
        <label className="block font-medium text-gray-200">{label}</label>
        <p className="text-sm text-gray-400">{description}</p>
      </div>

      {/* The actual switch button */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={onToggle}
        className={`relative inline-flex h-8 w-14 flex-shrink-0 rounded-full border-2 border-white/20 p-1 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500/15 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          isEnabled ? (isRed ? 'bg-red-500/30' : 'bg-teal-500/30') : 'bg-black/20'
        } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        aria-pressed={isEnabled}
      >
        <span className="sr-only">Use setting</span>
        {/* The moving circle inside the switch */}
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white/80 shadow-lg ring-0 transition duration-300 ease-in-out ${
            isEnabled ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;

