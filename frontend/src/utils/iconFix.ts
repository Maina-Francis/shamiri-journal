/**
 * This is a workaround to handle missing icons in the lucide-react package.
 * It provides a fallback mechanism for when an icon is requested that doesn't exist.
 */
import { AlertCircle } from 'lucide-react';

// This function returns a fallback icon if the requested icon is not found
export const getFallbackIcon = () => {
  return AlertCircle;
};

// This can be used to wrap icon imports that might be problematic
export const withFallback = (iconImport: any, fallback = getFallbackIcon()) => {
  return iconImport || fallback;
};
