// Header.jsx
import React from 'react';

function Header({ currentUser, onLogout }) {
    return (
        <header className="header">
            <div className="header-content">
                <h1>Lumière Weddings</h1>
                {currentUser && (
                    <div className="user-section">
                        <span style={{
                            marginTop: '23px'
                        }}>Welcome, {currentUser}</span>
                        <button
                            onClick={onLogout}
                            style={{
                                marginLeft: '15px',
                                backgroundColor: 'transparent',
                                color: 'inherit',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.color = '#ccc'}
                            onMouseOut={(e) => e.target.style.color = 'inherit'}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;