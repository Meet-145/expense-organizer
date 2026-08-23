import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef

 (({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={

     }
    {...props}
  >
    <CheckboxPrimitive.Indicator className={                                            }>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
