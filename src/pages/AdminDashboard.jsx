import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminFileList from '../components/admin/AdminFileList';
import AdminStats from '../components/admin/AdminStats';
import AdminUserList from '../components/admin/AdminUserList';
import { Shield, LayoutDashboard, Files, Users, LogOut } from 'lucide-react';

const AdminDashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [activeTab, setActiveTab] = useState('files');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (!token || user.role !== 'admin') {
            navigate('/admin-login');
        } else {
            setAdmin(user);
        }
    }, [navigate]);

    if (!admin) return null;

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#050505', overflow: 'hidden', color: 'white' }}>

            {/* Sidebar */}
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                adminName={admin.fullName}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

                {/* Tech Background Overlay */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(255,122,0,0.05) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }} />

                {/* Header */}
                <header style={{
                    padding: '1.25rem clamp(1rem, 5vw, 3rem)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 10,
                    background: 'rgba(5,5,5,0.8)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                            {activeTab === 'files' ? 'Global File Directory' :
                                activeTab === 'stats' ? 'System Analytics' : 'Security Settings'}
                        </h1>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                            Logged in as Security Administrator
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>System Online</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem clamp(1rem, 5vw, 3rem)', zIndex: 5 }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                        {activeTab === 'files' && <AdminFileList />}
                        {activeTab === 'stats' && <AdminStats />}
                        {activeTab === 'users' && <AdminUserList />}

                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
