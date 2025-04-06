import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useMobileDetection } from '../../hooks/useMediaQuery';

interface ModalProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({ 
  children, 
  title, 
  description,
  trigger, 
  open, 
  onOpenChange,
  className,
  size = 'md'
}) => {
  // Use the custom hook instead of direct window check
  const isMobile = useMobileDetection();

  // Size classes mapping
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl w-[95vw]'
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      
      <Dialog.Portal>
        <Dialog.Overlay 
          className={cn(
            "fixed inset-0 bg-black/70 z-50 backdrop-blur-sm animate-in fade-in-0",
            isMobile && "touch-none"
          )}
        />
        
        <Dialog.Content 
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 duration-200",
            "bg-white dark:bg-metal-darker rounded-lg shadow-lg",
            "animate-in fade-in-0 zoom-in-90",
            sizeClasses[size],
            isMobile ? "mobile-modal" : "max-h-[90vh]",
            "flex flex-col",
            className
          )}
          aria-describedby={description ? `${title}-description` : undefined}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-metal-darkest">
            {title && (
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-metal-lightblue font-metal-mania">
                {title}
              </Dialog.Title>
            )}
            
            {description && (
              <Dialog.Description
                id={`${title}-description`}
                className="sr-only"
              >
                {description}
              </Dialog.Description>
            )}
            
            <Dialog.Close className="p-1.5 rounded-full bg-gray-100 dark:bg-metal-darkest hover:bg-gray-200 dark:hover:bg-metal-dark text-gray-500 dark:text-metal-silver">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          
          <div className={cn(
            "flex-1 overflow-y-auto p-4",
            isMobile && "mobile-modal-content"
          )}>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;