import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { onOpenChange });
        }
        return child;
      })}
    </div>
  );
};

const DialogTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <button ref={ref} className={className} {...props}>
    {children}
  </button>
));
DialogTrigger.displayName = "DialogTrigger";

const DialogPortal = ({ children }) => {
  return <>{children}</>;
};

const DialogClose = React.forwardRef(({ className, children, onClick, ...props }, ref) => (
  <button ref={ref} className={className} onClick={onClick} {...props}>
    {children}
  </button>
));
DialogClose.displayName = "DialogClose";

const DialogOverlay = React.forwardRef(({ className, onOpenChange, ...props }, ref) => (
  <div
    ref={ref}
    onClick={() => onOpenChange?.(false)}
    className={cn(
      "fixed inset-0 z-[99999] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef(({ className, children, onOpenChange, onInteractOutside, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay onOpenChange={onOpenChange} />
    <div
      ref={ref}
      onClick={(e) => {
        if (e.target === e.currentTarget && onInteractOutside) {
          onInteractOutside();
        }
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        className={cn(
          "relative z-[99999] grid w-full max-w-lg gap-4 border border-slate-200 bg-white p-6 shadow-2xl duration-200 sm:rounded-2xl my-auto",
          "animate-in fade-in-0 zoom-in-95",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
