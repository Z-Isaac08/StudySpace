/**
 * Framer Motion Animation Utilities
 * Based on StudySpace Design Guide Section 6.4
 *
 * Animation Durations:
 * - Ultra Fast: 100ms (Hover states)
 * - Fast: 200ms (Dropdowns, tooltips)
 * - Standard: 300ms (Modals, slides)
 * - Slow: 500ms (Page transitions)
 *
 * Easing:
 * - ease-in: Acceleration (closures)
 * - ease-out: Deceleration (openings) ← Default
 * - ease-in-out: Smooth (large movements)
 */

import { Transition, Variants } from "framer-motion";

// ============================================
// DURATION CONSTANTS
// ============================================

export const DURATION = {
  ultraFast: 0.1, // 100ms - Hover states
  fast: 0.2, // 200ms - Dropdowns, tooltips
  standard: 0.3, // 300ms - Modals, slides
  slow: 0.5, // 500ms - Page transitions
} as const;

// ============================================
// EASING CONSTANTS
// ============================================

export const EASING = {
  easeIn: [0.4, 0, 1, 1], // Acceleration (closures)
  easeOut: [0, 0, 0.2, 1], // Deceleration (openings) - Default
  easeInOut: [0.4, 0, 0.2, 1], // Smooth (large movements)
} as const;

// ============================================
// TRANSITION PRESETS
// ============================================

export const transition = {
  /** Default transition - ease-out 300ms */
  default: {
    duration: DURATION.standard,
    ease: EASING.easeOut,
  } as Transition,

  /** Fast transition for dropdowns/tooltips */
  fast: {
    duration: DURATION.fast,
    ease: EASING.easeOut,
  } as Transition,

  /** Slow transition for page changes */
  slow: {
    duration: DURATION.slow,
    ease: EASING.easeInOut,
  } as Transition,

  /** Spring animation for playful interactions */
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 25,
  } as Transition,
} as const;

// ============================================
// MODAL ANIMATIONS (Section 6.4)
// ============================================

/**
 * Modal Animation - Fade + Scale
 * Entrance: opacity 0→1 + scale 0.95→1 (300ms ease-out)
 * Exit: opacity 1→0 + scale 1→0.95 (200ms ease-in)
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.standard,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: DURATION.fast,
      ease: EASING.easeIn,
    },
  },
};

/**
 * Modal Overlay - Simple fade
 */
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.fast },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.fast },
  },
};

// ============================================
// TOAST ANIMATIONS (Section 6.4)
// ============================================

/**
 * Toast Animation - Slide-in-right + Fade
 * Entrance: slide-in-right + fade-in (200ms)
 * Exit: fade-out (150ms)
 */
export const toastVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: DURATION.fast,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: EASING.easeIn,
    },
  },
};

// ============================================
// DROPDOWN ANIMATIONS (Section 6.4)
// ============================================

/**
 * Dropdown Animation - translateY + Fade
 * Entrance: opacity 0→1 + translateY(-10px→0) (200ms)
 */
export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.fast,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: DURATION.ultraFast,
      ease: EASING.easeIn,
    },
  },
};

// ============================================
// LIST/STAGGER ANIMATIONS
// ============================================

/**
 * Container for staggered children animations
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

/**
 * Individual item in staggered list
 */
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.standard,
      ease: EASING.easeOut,
    },
  },
};

// ============================================
// FADE ANIMATIONS
// ============================================

/**
 * Simple fade in/out
 */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.standard },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.fast },
  },
};

/**
 * Fade with slide up
 */
export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.standard,
      ease: EASING.easeOut,
    },
  },
};

// ============================================
// PAGE TRANSITION ANIMATIONS
// ============================================

/**
 * Page transition - Fade only (subtle)
 */
export const pageVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATION.slow,
      ease: EASING.easeInOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: DURATION.standard,
      ease: EASING.easeIn,
    },
  },
};

// ============================================
// CARD ANIMATIONS
// ============================================

/**
 * Card hover animation
 */
export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    transition: {
      duration: DURATION.ultraFast,
      ease: EASING.easeOut,
    },
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create custom fade variant with custom duration
 */
export const createFadeVariant = (
  duration: number = DURATION.standard
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration * 0.7 },
  },
});

/**
 * Create custom slide variant
 */
export const createSlideVariant = (
  direction: "up" | "down" | "left" | "right",
  distance: number = 20
): Variants => {
  const axes = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return {
    hidden: {
      opacity: 0,
      ...axes[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: DURATION.standard,
        ease: EASING.easeOut,
      },
    },
  };
};

/**
 * Respects user's motion preferences (Section 6.4)
 * Returns instant animations if user prefers reduced motion
 */
export const respectMotionPreference = (variants: Variants): Variants => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.01 } },
      exit: { opacity: 0, transition: { duration: 0.01 } },
    };
  }
  return variants;
};
