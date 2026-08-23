import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef                                                      (
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={                                                                      }
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef                                                      (
  ({ className, ...props }, ref) => (
    <div ref={ref} className={                                              } {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef                                                      (
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={                                                          }
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef                                                      (
  ({ className, ...props }, ref) => (
    <div ref={ref} className={                                              } {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef                                                      (
  ({ className, ...props }, ref) => (
    <div ref={ref} className={                         } {...props} />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef                                                      (
  ({ className, ...props }, ref) => (
    <div ref={ref} className={                                           } {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
