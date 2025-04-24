import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

function LoginModal({ onClose, onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);

    const handleLoginSuccess = (email) => {
        if (onLoginSuccess) onLoginSuccess(email);
        onClose();
    };

    return (
        <div style={modalStyle.overlay}>
            <div style={modalStyle.modal}>
                <button
                    aria-label="Close"
                    onClick={onClose}
                    style={modalStyle.closeButton}
                >
                    ×
                </button>
                <h2 style={{ textAlign: 'center', color: 'white', marginBottom: '20px', marginTop: '35px' }}>
                    {isLogin ? 'Login' : 'Signup'}
                </h2>
                <div style={{ padding: '10px' }}>
                    {isLogin ? (
                        <Login
                            onSwitch={() => setIsLogin(false)}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    ) : (
                        <Register onSwitch={() => setIsLogin(true)} />
                    )}
                </div>
            </div>
        </div>
    );
}

const modalStyle = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    modal: {
        backgroundColor: 'transparent',
        padding: '30px',
        borderRadius: '12px',
        width: '360px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        position: 'relative',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.3)'
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'transparent',
        border: 'none',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
        cursor: 'pointer',
        zIndex: 10000,
    }
};

export default LoginModal;
