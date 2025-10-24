import React, { createContext, useState, useContext, ReactNode, useCallback, useRef } from 'react';
import Modal from '../components/Modal';

interface ModalState {
  isOpen: boolean;
  type: 'alert' | 'confirm';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface ModalContextType {
  showAlert: (title: string, message: string) => void;
  showConfirmation: (title: string, message: string, options?: { confirmText?: string; cancelText?: string }) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: '',
  });
  
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const showAlert = useCallback((title: string, message: string) => {
    setModalState({
      isOpen: true,
      type: 'alert',
      title,
      message,
    });
  }, []);

  const showConfirmation = useCallback((title: string, message: string, options?: { confirmText?: string; cancelText?: string }) => {
    return new Promise<boolean>((resolve) => {
      setModalState({
        isOpen: true,
        type: 'confirm',
        title,
        message,
        confirmText: options?.confirmText,
        cancelText: options?.cancelText,
      });
      resolver.current = resolve;
    });
  }, []);
  
  const handleClose = () => {
     if (modalState.type === 'confirm' && resolver.current) {
        resolver.current(false); // Resolve with false if closed without confirmation
     }
     setModalState({ ...modalState, isOpen: false });
  };
  
  const handleConfirm = () => {
    if (resolver.current) {
        resolver.current(true);
    }
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirmation }}>
      {children}
      <Modal 
        {...modalState} 
        onClose={handleClose} 
        onConfirm={handleConfirm}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
