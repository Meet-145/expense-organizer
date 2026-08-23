import * as React from "react";

import { cn } from "@/lib/utils";

const Table = React.forwardRef                                                          (
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={                                              } {...props} />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef

 (({ className, ...props }, ref) => (
  <thead ref={ref} className={                                } {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef

 (({ className, ...props }, ref) => (
  <tbody ref={ref} className={                                           } {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef

 (({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={                                                                        }
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef                                                                (
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={

       }
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef

 (({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={

     }
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef

 (({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={

     }
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef

 (({ className, ...props }, ref) => (
  <caption ref={ref} className={                                                   } {...props} />
));
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
