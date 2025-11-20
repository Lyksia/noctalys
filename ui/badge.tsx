import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/index";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors",
  {
    variants: {
      variant: {
        default: "bg-moon-700 text-moon-200 border-transparent",
        success: "bg-status-success/20 text-status-success border-status-success/40",
        warning: "bg-status-warning/20 text-status-warning border-status-warning/40",
        error: "bg-status-error/20 text-status-error border-status-error/40",
        destructive: "bg-status-error/20 text-status-error border-status-error/40",
        info: "bg-status-info/20 text-status-info border-status-info/40",
        outline: "text-moon-200 border-moon-600 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
