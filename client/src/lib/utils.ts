import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function waitFor(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}