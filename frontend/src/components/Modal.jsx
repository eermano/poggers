import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${className || ''}`}>
        <button className="modal-close" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
