import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ---------- Card ---------- */
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "glass-card relative rounded-3xl text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

/* ---------- Badge ---------- */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-semibold transition-colors [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-primary/12 text-primary ring-1 ring-inset ring-primary/20",
        solid: "bg-primary text-primary-foreground",
        glass: "glass relative text-foreground",
        outline: "ring-1 ring-inset ring-border text-muted-foreground",
      },
      size: {
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

/* ---------- Input / Textarea ---------- */
const field =
  "w-full min-w-0 rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-[15px] backdrop-blur-sm transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input data-slot="input" className={cn(field, "h-10", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(field, "min-h-20 resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-xs font-bold uppercase tracking-wider text-primary",
        className,
      )}
      {...props}
    />
  );
}

/* ---------- Kbd ---------- */
export function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center gap-0.5 rounded-md border border-border bg-muted/70 px-1.5 font-sans text-[11px] font-semibold text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/* ---------- Skeleton ---------- */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("animate-pulse rounded-2xl bg-foreground/[0.06]", className)} {...props} />
  );
}
