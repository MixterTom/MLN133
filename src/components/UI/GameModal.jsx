import { useEffect } from 'react';
import './GameModal.css';

export default function GameModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    type = 'confirm', // 'confirm', 'alert', 'info'
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    icon = '✨'
}) {
    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="game-modal-overlay" onClick={handleCancel}>
            <div className="game-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="game-modal-header">
                    <div className="modal-icon">{icon}</div>
                    <h2 className="modal-title">{title}</h2>
                </div>
                
                <div className="game-modal-body">
                    <p className="modal-message">{message}</p>
                </div>

                <div className="game-modal-footer">
                    {type === 'confirm' ? (
                        <>
                            <button 
                                className="modal-btn modal-btn-cancel" 
                                onClick={handleCancel}
                            >
                                {cancelText}
                            </button>
                            <button 
                                className="modal-btn modal-btn-confirm" 
                                onClick={handleConfirm}
                                autoFocus
                            >
                                {confirmText}
                            </button>
                        </>
                    ) : (
                        <button 
                            className="modal-btn modal-btn-confirm" 
                            onClick={handleConfirm}
                            autoFocus
                        >
                            {confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
