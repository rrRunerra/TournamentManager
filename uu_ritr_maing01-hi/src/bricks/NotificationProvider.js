import React, { createContext, useContext, useState, useCallback } from 'react';
import NotificationCard from './NotificationCard';
import '../styles/notificationContainer.css';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((type, message, subText = null, duration = 5000) => {
        const id = Date.now() + Math.random();
        const notification = {
            id,
            type,
            message,
            subText,
            duration
        };

        setNotifications(prev => [...prev, notification]);

        // Auto-remove after duration + animation time
        setTimeout(() => {
            removeNotification(id);
        }, duration + 500);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, []);

    const showSuccess = useCallback((message, subText) => {
        showNotification('success', message, subText);
    }, [showNotification]);

    const showError = useCallback((message, subText) => {
        showNotification('error', message, subText);
    }, [showNotification]);

    const showWarning = useCallback((message, subText) => {
        showNotification('warning', message, subText);
    }, [showNotification]);

    const showInfo = useCallback((message, subText) => {
        showNotification('info', message, subText);
    }, [showNotification]);

    const value = {
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <div className="notification-container">
                {notifications.map(notif => (
                    <NotificationCard
                        key={notif.id}
                        type={notif.type}
                        message={notif.message}
                        subText={notif.subText}
                        duration={notif.duration}
                        onClose={() => removeNotification(notif.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
