import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-300 outline-none select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_8px_24px_-6px] shadow-primary/50 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px] hover:shadow-primary/60 hover:brightness-110",
        glow:
          "text-white bg-[linear-gradient(110deg,var(--color-emerald-600),var(--color-green-500),var(--color-lime-500),var(--color-emerald-600))] bg-[length:200%_100%] animate-[shine_6s_linear_infinite] shadow-[0_10px_30px_-8px] shadow-emerald-500/60 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-10px] hover:shadow-emerald-500/70",
        secondary:
          "glass text-foreground hover:-translate-y-0.5 hover:brightness-105",
        outline:
          "border border-border bg-background/40 backdrop-blur-md hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-foreground/[0.06] text-foreground",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline rounded-none",
      },
      size: {
        default: "h-10 px-5 text-sm",
        sm: "h-8 px-3.5 text-[13px]",
        lg: "h-12 px-7 text-[15px]",
        xl: "h-14 px-8 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
