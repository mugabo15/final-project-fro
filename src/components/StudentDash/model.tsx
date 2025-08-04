import React, { ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000]">
      <div className="bg-white  rounded relative max-h-[90vh] max-w-[90vw] overflow-y-scroll max-md:w-[70%] max-md:h-[440px]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2.5 text-xl bg-transparent border-none text-gray-500 hover:text-red-600 transition-colors rounded-full p-1 cursor-pointer"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
