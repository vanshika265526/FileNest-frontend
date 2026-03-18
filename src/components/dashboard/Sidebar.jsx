import { useNavigate, Link } from 'react-router-dom';
import { Target, LayoutGrid, Folder, Clock, LogOut, ChevronLeft, ChevronRight, Book, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/apiConfig';

const Sidebar = ({ user, isOpen, onToggle, activeView, onViewChange, usedStorage = 0 }) => {
    const navigate = useNavigate();
    const storageLimit = 15 * 1024 * 1024 * 1024; // 15GB in bytes
    const usagePercentage = Math.min((usedStorage / storageLimit) * 100, 100);

    const [requestCount, setRequestCount] = useState(0);

    const formatUsage = (bytes) => {
        if (bytes === 0) return '0 GB';
        const gb = bytes / (1024 * 1024 * 1024);
        if (gb < 0.1) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return gb.toFixed(1) + ' GB';
    };

    useEffect(() => {
        const fetchRequestCount = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await fetch(`${API_BASE_URL}/api/files/requests`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setRequestCount(data.length);
                }
            } catch (err) {
                console.error('Failed to fetch request count:', err);
            }
        };

        fetchRequestCount();
        const interval = setInterval(fetchRequestCount, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };


    const navItemStyle = (view) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.6rem 0.75rem',
        fontSize: '0.85rem',
        background: activeView === view ? 'var(--accent-primary)' : 'transparent',
        color: activeView === view ? 'white' : 'var(--text-secondary)',
        borderRadius: '8px',
        fontWeight: 500,
        cursor: 'pointer',
        justifyContent: isOpen ? 'flex-start' : 'center',
        boxShadow: activeView === view ? '0 4px 14px rgba(255, 122, 0, 0.3)' : 'none',
        transition: 'all 0.1s'
    });

    return (
        <div style={{ position: 'relative', height: '100%', display: 'flex' }}>
            <aside style={{
                width: isOpen ? '220px' : '70px',
                background: 'var(--bg-card)',
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: isOpen ? '1.5rem' : '1.5rem 0.5rem',
                height: '100%',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                <div>
                    {/* Branding */}
                    <Link to="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        marginBottom: '1.5rem',
                        justifyContent: isOpen ? 'flex-start' : 'center'
                    }}>
                        <div style={{
                            background: 'var(--accent-primary)',
                            padding: '0.4rem',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '32px'
                        }}>
                            <Target size={18} color="white" />
                        </div>
                        {isOpen && <span>FileNest</span>}
                    </Link>

                    {/* Navigation Links */}
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div
                            title="Dashboard"
                            onClick={() => onViewChange('overview')}
                            style={navItemStyle('overview')}
                        >
                            <LayoutGrid size={16} /> {isOpen && 'Dashboard'}
                        </div>
                        <div
                            title="All Files"
                            onClick={() => onViewChange('all-files')}
                            style={navItemStyle('all-files')}
                        >
                            <Folder size={16} /> {isOpen && 'All Files'}
                        </div>
                        <div
                            title="Recent"
                            onClick={() => onViewChange('recent')}
                            style={navItemStyle('recent')}
                            onMouseEnter={(e) => {
                                if (activeView !== 'recent') e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                            }}
                            onMouseLeave={(e) => {
                                if (activeView !== 'recent') e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <Clock size={16} /> {isOpen && 'Recent'}
                        </div>
                        <div
                            title="Documentation"
                            onClick={() => onViewChange('docs')}
                            style={navItemStyle('docs')}
                        >
                            <Book size={16} /> {isOpen && 'Docs'}
                        </div>


                    </nav>

                    {/* Storage Indicator */}
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: isOpen ? 'flex-start' : 'center' }}>
                        {isOpen ? (
                            <>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Storage</div>
                                <div style={{ height: '6px', width: '100%', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                    <div style={{ width: `${usagePercentage}%`, height: '100%', background: 'linear-gradient(to right, var(--accent-secondary), var(--accent-primary))', borderRadius: '3px' }} />
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formatUsage(usedStorage)} of 15 GB used</div>
                            </>
                        ) : (
                            <div title={`${formatUsage(usedStorage)} of 15 GB used`} style={{ width: '4px', height: '40px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px', position: 'relative' }}>
                                <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${usagePercentage}%`, background: 'var(--accent-primary)', borderRadius: '2px' }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom User Profile */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isOpen ? 'space-between' : 'center',
                    padding: isOpen ? '0.75rem' : '0.5rem',
                    background: 'var(--bg-dark)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            minWidth: '32px',
                            borderRadius: '50%',
                            background: 'rgba(123,51,255,0.1)',
                            color: 'var(--accent-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                        }}>
                            {user?.fullName?.charAt(0) || 'U'}
                        </div>
                        {isOpen && (
                            <div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{user?.fullName || 'User'}</div>
                            </div>
                        )}
                    </div>
                    {isOpen && (
                        <button onClick={handleSignOut} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }} title="Sign Out">
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </aside>

            {/* Toggle Button - Positioned on the edge */}
            <button
                onClick={onToggle}
                style={{
                    position: 'absolute',
                    right: '-12px',
                    top: '32px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 100,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
            >
                {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
        </div>
    );
};

export default Sidebar;
