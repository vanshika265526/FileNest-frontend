import { LayoutDashboard, Files, Users, LogOut, Shield, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSidebar = ({ activeTab, setActiveTab, adminName, isOpen, onToggle }) => {

    const menuItems = [
        { id: 'files', label: 'Files Management', icon: Files },
        { id: 'stats', label: 'System Stats', icon: LayoutDashboard },
        { id: 'users', label: 'User Directory', icon: Users },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin-login';
    };

    return (
        <div style={{ position: 'relative', height: '100%', display: 'flex' }}>
            <aside style={{
                width: isOpen ? '240px' : '70px',
                height: '100%',
                background: '#0a0a0b',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 100,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden'
            }}>
                {/* Branding */}
                <div style={{ padding: isOpen ? '1.25rem' : '1.25rem 0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: isOpen ? 'flex-start' : 'center' }}>
                        <div style={{ background: 'var(--accent-primary)', padding: '0.5rem', borderRadius: '10px', boxShadow: '0 0 15px rgba(255,122,0,0.2)' }}>
                            <Shield size={18} color="white" />
                        </div>
                        {isOpen && <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>FileNest <span style={{ color: 'var(--accent-primary)' }}>Admin</span></span>}
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: isOpen ? '0 0.75rem' : '0 0.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                title={!isOpen ? item.label : ''}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: isOpen ? 'space-between' : 'center',
                                    padding: '0.6rem 0.75rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: activeTab === item.id ? 'rgba(255,122,0,0.1)' : 'transparent',
                                    color: activeTab === item.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.5)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'left',
                                    fontWeight: activeTab === item.id ? 600 : 500,
                                    fontSize: '0.8rem'
                                }}
                                onMouseEnter={(e) => {
                                    if (activeTab !== item.id) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeTab !== item.id) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                                    }
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <item.icon size={16} />
                                    {isOpen && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                                </div>
                                {isOpen && activeTab === item.id && <ChevronRight size={12} />}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Footer / User Profile */}
                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{
                        padding: '0.75rem',
                        borderRadius: '14px',
                        background: 'rgba(255,255,255,0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        marginBottom: '0.75rem',
                        justifyContent: isOpen ? 'flex-start' : 'center'
                    }}>
                        <div style={{ width: '28px', height: '28px', minWidth: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #7b33ff, #ff7a00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                            {adminName ? adminName.charAt(0) : 'A'}
                        </div>
                        {isOpen && (
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminName}</p>
                                <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>Super Admin</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        title={!isOpen ? 'Logout' : ''}
                        style={{
                            width: '100%',
                            padding: '0.6rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            background: 'rgba(239, 68, 68, 0.05)',
                            color: '#ef4444',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
                        }}
                    >
                        <LogOut size={14} />
                        {isOpen && 'Logout'}
                    </button>
                </div>
            </aside>

            {/* Toggle Button */}
            <button
                onClick={onToggle}
                style={{
                    position: 'absolute',
                    right: '-12px',
                    top: '24px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#111',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 200,
                    color: 'rgba(255,255,255,0.5)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                }}
            >
                {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
        </div>
    );
};

export default AdminSidebar;
