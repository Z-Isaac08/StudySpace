/**
 * Reusable Motion Components
 * Pre-configured Framer Motion components for common animations
 */

"use client";

import {
  dropdownVariants,
  fadeUpVariants,
  fadeVariants,
  modalVariants,
  overlayVariants,
  respectMotionPreference,
  staggerContainerVariants,
  staggerItemVariants,
  toastVariants,
} from "@/lib/animations";
import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";

// ============================================
// MODAL COMPONENTS
// ============================================

/**
 * Animated Modal Container
 * Usage: <MotionModal>Content</MotionModal>
 */
export const MotionModal = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  (props, ref) => (
    <motion.div
      ref={ref}
      variants={respectMotionPreference(modalVariants)}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...props}
    />
  )
);
MotionModal.displayName = "MotionModal";

/**
 * Animated Modal Overlay/Backdrop
 * Usage: <MotionOverlay />
 */
export const MotionOverlay = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  (props, ref) => (
    <motion.div
      ref={ref}
      variants={respectMotionPreference(overlayVariants)}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...props}
    />
  )
);
MotionOverlay.displayName = "MotionOverlay";

// ============================================
// TOAST COMPONENT
// ============================================

/**
 * Animated Toast
 * Usage: <MotionToast>Message</MotionToast>
 */
export const MotionToast = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  (props, ref) => (
    <motion.div
      ref={ref}
      variants={respectMotionPreference(toastVariants)}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...props}
    />
  )
);
MotionToast.displayName = "MotionToast";

// ============================================
// DROPDOWN COMPONENT
// ============================================

/**
 * Animated Dropdown/Popover
 * Usage: <MotionDropdown>Items</MotionDropdown>
 */
export const MotionDropdown = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>((props, ref) => (
  <motion.div
    ref={ref}
    variants={respectMotionPreference(dropdownVariants)}
    initial="hidden"
    animate="visible"
    exit="exit"
    {...props}
  />
));
MotionDropdown.displayName = "MotionDropdown";

// ============================================
// STAGGER COMPONENTS
// ============================================

/**
 * Stagger Container - Animates children in sequence
 * Usage:
 * <MotionStaggerContainer>
 *   <MotionStaggerItem>Item 1</MotionStaggerItem>
 *   <MotionStaggerItem>Item 2</MotionStaggerItem>
 * </MotionStaggerContainer>
 */
export const MotionStaggerContainer = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>((props, ref) => (
  <motion.div
    ref={ref}
    variants={staggerContainerVariants}
    initial="hidden"
    animate="visible"
    {...props}
  />
));
MotionStaggerContainer.displayName = "MotionStaggerContainer";

export const MotionStaggerItem = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>((props, ref) => (
  <motion.div ref={ref} variants={staggerItemVariants} {...props} />
));
MotionStaggerItem.displayName = "MotionStaggerItem";

// ============================================
// FADE COMPONENTS
// ============================================

/**
 * Simple Fade In/Out
 * Usage: <MotionFade>Content</MotionFade>
 */
export const MotionFade = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  (props, ref) => (
    <motion.div
      ref={ref}
      variants={respectMotionPreference(fadeVariants)}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...props}
    />
  )
);
MotionFade.displayName = "MotionFade";

/**
 * Fade with Slide Up
 * Usage: <MotionFadeUp>Content</MotionFadeUp>
 */
export const MotionFadeUp = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  (props, ref) => (
    <motion.div
      ref={ref}
      variants={respectMotionPreference(fadeUpVariants)}
      initial="hidden"
      animate="visible"
      {...props}
    />
  )
);
MotionFadeUp.displayName = "MotionFadeUp";

// ============================================
// GENERIC MOTION COMPONENTS
// ============================================

/**
 * Generic motion div with proper typing
 */
export const MotionDiv = motion.div;

/**
 * Generic motion button with proper typing
 */
export const MotionButton = motion.button;

/**
 * Generic motion section
 */
export const MotionSection = motion.section;
