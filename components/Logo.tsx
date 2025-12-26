import { cn } from "@/lib/utils";

interface LogoProps {
  /**
   * Size variant of the logo
   * @default "default"
   */
  size?: "sm" | "default" | "lg";
  /**
   * Whether to show the Beta badge
   * @default true
   */
  showBeta?: boolean;
  /**
   * Additional className for the container
   */
  className?: string;
}

export function Logo({ size = "default", showBeta = true, className }: LogoProps) {
  const sizeClasses = {
    sm: {
      text: "text-lg",
      badge: "text-[10px] px-1.5 py-0.5",
    },
    default: {
      text: "text-2xl",
      badge: "text-xs px-2 py-0.5",
    },
    lg: {
      text: "text-3xl",
      badge: "text-sm px-2.5 py-1",
    },
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent",
          sizeClasses[size].text
        )}
      >
        StudySpace
      </span>
      {showBeta && (
        <span
          className={cn(
            "font-semibold rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
            sizeClasses[size].badge
          )}
        >
          Beta
        </span>
      )}
    </div>
  );
}
