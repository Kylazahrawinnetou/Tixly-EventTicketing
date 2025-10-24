import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  type: 'alert' | 'confirm';
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    // @ts-ignore
    window.lucide?.createIcons();
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative bg-card text-card-foreground border border-border rounded-lg shadow-xl w-full max-w-md m-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 id="modal-title" className="text-xl font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Close"
          >
            <i data-lucide="x" className="h-5 w-5"></i>
          </button>
        </div>
        <div className="p-6">
          <p className="text-muted-foreground">{message}</p>
        </div>
        <div className="flex justify-end space-x-4 p-6 bg-muted/50 rounded-b-lg">
          {type === 'confirm' && (
            <button
              onClick={onClose}
              className="py-2 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold rounded-md transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={type === 'alert' ? onClose : onConfirm}
            className={`py-2 px-4 font-semibold rounded-md transition-colors ${
              type === 'confirm' && (confirmText === 'Delete' || confirmText === 'Unpublish')
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {type === 'alert' ? 'OK' : confirmText}
          </button>
        </div>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
          .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default Modal;
