import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
  noBlur?: boolean;
}

const modalBackdrop = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(160,154,188,0.18)',
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)'
};

const modalBox = {
  background: 'rgba(255,255,255,0.7)',
  borderRadius: 16,
  padding: 0,
  minWidth: 600,
  maxWidth: 700,
  boxShadow: '0 4px 24px #D5CFE1',
  color: '#A09ABC',
  position: 'relative' as const,
  overflow: 'hidden',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)'
};

const modalHeader = {
  padding: '32px 48px 0 48px',
  fontWeight: 700,
  fontSize: 32,
  color: '#7c3aed',
  textAlign: 'center' as const,
};

const modalContent = {
  padding: '24px 48px 48px 48px',
};

const closeBtn = {
  position: 'absolute' as const,
  top: 18,
  right: 24,
  background: 'none',
  border: 'none',
  fontSize: 28,
  color: '#A09ABC',
  cursor: 'pointer',
  lineHeight: 1,
};

export default function Modal({ isOpen, onClose, children, title, style, noBlur }: ModalProps) {
  if (!isOpen) return null;
  const backdropStyle = noBlur
    ? { ...modalBackdrop, backdropFilter: undefined, WebkitBackdropFilter: undefined }
    : modalBackdrop;
  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={{ ...modalBox, ...style }} onClick={e => e.stopPropagation()}>
        <button style={closeBtn} onClick={onClose} aria-label="Close Modal">&times;</button>
        {title && <div style={modalHeader}>{title}</div>}
        <div style={modalContent}>{children}</div>
      </div>
    </div>
  );
} 