function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer style={{
            padding: '40px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontFamily: 'Tinos, serif',
            color: '#ddd',
            textAlign: 'center'
        }}>
            <p style={{
                marginBottom: '15px',
                fontSize: '14px',
                letterSpacing: '0.5px'
            }}>
                &copy; {year} Lumière Weddings — All rights reserved.
            </p>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '30px',
                fontSize: '14px',
                opacity: 0.8
            }}>
                <a href="#" style={{ textDecoration: 'none', color: '#ccc' }}>Contact Us</a>
                <a href="#" style={{ textDecoration: 'none', color: '#ccc' }}>Privacy Policy</a>
                <a href="#" style={{ textDecoration: 'none', color: '#ccc' }}>Help Center</a>
            </div>
        </footer>
    );
}

export default Footer;
