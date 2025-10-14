import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles for all buttons
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700",
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-teal-500/85 dark:hover:bg-teal-700",
        destructive: "bg-red-500 text-white hover:bg-red-600 dark:bg-red-500/75 dark:hover:bg-red-800",
        outline: "bg-slate-500 border text-gray-200 border-slate-200 hover:bg-slate-800 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600",
        subtle: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
        ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800",
        link: "bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100",
        cyan: "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-cyan-600/90 dark:hover:bg-cyan-800",
        orange: "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-orange-500/70 dark:hover:bg-orange-800",
        
        // ✨ New "glass" variant added here
        glass: "bg-white/5 text-white border border-white/20 backdrop-blur-sm hover:bg-white/10",
        glassRed: "bg-red-500/25 text-white border border-white/20 backdrop-blur-sm hover:bg-red-500/10",
        glassTeal: "bg-teal-500/25 text-white border border-white/20 backdrop-blur-sm hover:bg-teal-500/10",
        glassYellow: "bg-yellow-500/15 text-white border border-yellow-100/20 backdrop-blur-sm hover:bg-yellow-500/10",
      },
      size: {
        default: "h-10 rounded-xl py-2 px-4",
        sm: "h-9 px-3 rounded-3xl",
        lg: "h-11 px-8 rounded-3xl",
        round: "h-10 rounded-3xl py-2 px-4",
        // Added a new size to match the card's padding
        card: "px-6 py-8 rounded-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };