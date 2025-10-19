/**
 * @file Haptic feedback utility for providing tactile responses on supported devices.
 * This implementation centralizes haptic logic into a single, type-safe function.
 */

/**
 * Defines the standardized types of haptic feedback available.
 * Using an enum makes the calls more descriptive and prevents magic strings/numbers.
 */
export enum HapticFeedbackType {
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Light = 'light',
  Medium = 'medium',
  Heavy = 'heavy',
  Selection = 'selection',
}

// A map of feedback types to their corresponding vibration patterns in milliseconds.
// A single number is a simple vibration; an array creates a pattern of [vibrate, pause, vibrate, ...].
const HAPTIC_PATTERNS: Record<HapticFeedbackType, number | number[]> = {
  [HapticFeedbackType.Success]: [40, 50, 80],
  [HapticFeedbackType.Error]: [120, 40, 120],
  [HapticFeedbackType.Warning]: [100, 50, 100],     // Two medium buzzes
  [HapticFeedbackType.Light]: 10,                 // A very light tap
  [HapticFeedbackType.Medium]: 40,                // A standard tap
  [HapticFeedbackType.Heavy]: [70,350,10],                 // A strong, impactful tap
  [HapticFeedbackType.Selection]: [40,20,10]              // A refined, quicker tap for UI selections
};

/**
 * Lazily checks if the browser and device support the Vibration API.
 * The result is cached for performance, so this check only runs once.
 */
const isHapticSupported: boolean =
  typeof window !== 'undefined' && 'vibrate' in navigator;

/**
 * Triggers a haptic feedback vibration based on the specified type.
 * It does nothing if haptics are not supported, so it's safe to call anytime.
 *
 * @param {HapticFeedbackType} type - The semantic type of feedback to trigger.
 */
export const triggerHapticFeedback = (type: HapticFeedbackType): void => {
  if (isHapticSupported) {
    try {
      const pattern = HAPTIC_PATTERNS[type];
      navigator.vibrate(pattern);
    } catch (error) {
      console.error("Haptic feedback failed:", error);
    }
  }
};