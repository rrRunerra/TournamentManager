import React from 'react';
import '../styles/confirmDialog.css';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Potvrdiť", cancelText = "Zrušiť", danger = false }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-header">
                    <h3 className="confirm-title">{title}</h3>
                </div>
                <div className="confirm-body">
                    <p className="confirm-message">{message}</p>
                </div>
                <div className="confirm-actions">
                    <button className="confirm-btn confirm-btn-cancel" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button
                        className={`confirm-btn ${danger ? 'confirm-btn-danger' : 'confirm-btn-primary'}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
