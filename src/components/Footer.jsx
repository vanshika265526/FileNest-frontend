import { Target } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ padding: '60px 0', borderTop: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', color: 'var(--text-secondary)' }}>
            <div className="container flex-between" style={{ flexWrap: 'wrap', gap: '2rem' }}>

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <div style={{ background: 'var(--accent-primary)', padding: '0.35rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Target size={16} color="white" />
                    </div>
                    FileNest
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Privacy Policy</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Terms of Service</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Contact</a>
                </div>

                {/* Copyright */}
                <div style={{ fontSize: '0.85rem' }}>
                    © 2024 FileNest. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
