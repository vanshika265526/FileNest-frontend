import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };
    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0,
            zIndex: 50, background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)'
        }}>
            <div className="container flex-between" style={{ height: '60px' }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
                    <div style={{ background: 'var(--accent-primary)', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Target size={20} color="white" />
                    </div>
                    FileNest
                </Link>

                {/* Links */}
                <div style={{ display: 'flex', gap: '2.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <a href="#features" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Features</a>
                    <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Pricing</a>
                    <a href="#security" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Security</a>
                </div>

                {/* CTA */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                                Welcome, <span className="text-gradient-purple" style={{ fontWeight: 700 }}>{user.fullName.split(' ')[0]}</span>
                            </span>
                            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Dashboard</button>
                            </Link>
                            <button onClick={handleSignOut} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/admin-login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Admin Portal</Link>
                            <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Login</Link>
                            <Link to="/signup">
                                <button className="btn btn-primary">Get Started</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
