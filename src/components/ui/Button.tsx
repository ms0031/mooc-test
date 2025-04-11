import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700",
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-teal-500/80 dark:hover:bg-teal-700",
        destructive: "bg-red-500 text-white hover:bg-red-600 dark:bg-red-500/80 dark:hover:bg-red-800",
        outline: "bg-slate-500 border text-gray-200 border-slate-200 hover:bg-slate-800 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600",
        subtle: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
        ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800",
        link: "bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100",
      },
      size: {
        default: "h-10 rounded-xl py-2 px-4",
        sm: "h-9 px-3 rounded-3xl",
        lg: "h-11 px-8 rounded-3xl",
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
