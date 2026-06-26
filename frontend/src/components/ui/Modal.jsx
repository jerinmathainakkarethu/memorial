import React, { useEffect, createContext, useContext } from 'react'
import '../../styles/Modal.css'

const ModalContext = createContext(null);

function Modal({ isOpen = true, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <ModalContext.Provider value={{ onClose }}>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          {title && (
            <div className="modal__header">
              <h3 className="modal__title">{title}</h3>
              <button className="modal__close" onClick={onClose}>&times;</button>
            </div>
          )}
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  )
}

// Attach Modal.Header and Modal.Body for backward-compatibility with subcomponent style
Modal.Header = function ModalHeader({ children }) {
  const context = useContext(ModalContext);
  const onClose = context ? context.onClose : null;
  return (
    <div className="modal__header">
      <h3 className="modal__title">{children}</h3>
      {onClose && <button className="modal__close" onClick={onClose}>&times;</button>}
    </div>
  );
};

Modal.Body = function ModalBody({ children }) {
  return <div className="modal__body">{children}</div>;
};

export default Modal
