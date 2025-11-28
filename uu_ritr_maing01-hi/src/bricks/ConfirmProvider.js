import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmDialog from './ConfirmDialog';

const ConfirmContext = createContext();

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within ConfirmProvider');
    }
    return context;
};

export const ConfirmProvider = ({ children }) => {
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        onCancel: () => { },
        confirmText: 'Potvrdiť',
        cancelText: 'Zrušiť',
        danger: false
    });

    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            setConfirmState({
                isOpen: true,
                title: options.title || 'Potvrdenie',
                message: options.message || 'Ste si istí?',
                confirmText: options.confirmText || 'Potvrdiť',
                cancelText: options.cancelText || 'Zrušiť',
                danger: options.danger || false,
                onConfirm: () => {
                    setConfirmState(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmState(prev => ({ ...prev, isOpen: false }));
                    resolve(false);
                }
            });
        });
    }, []);

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <ConfirmDialog
                isOpen={confirmState.isOpen}
                title={confirmState.title}
                message={confirmState.message}
                confirmText={confirmState.confirmText}
                cancelText={confirmState.cancelText}
                danger={confirmState.danger}
                onConfirm={confirmState.onConfirm}
                onCancel={confirmState.onCancel}
            />
        </ConfirmContext.Provider>
    );
};
