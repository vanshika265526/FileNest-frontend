import { useState, useEffect } from 'react';
import { Search, Trash2, User, Mail, Calendar, AlertCircle, Loader2, ShieldCheck, Shield, UserCheck, Database } from 'lucide-react';
import API_BASE_URL from '../../api/apiConfig';
import { motion, AnimatePresence } from 'framer-motion';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUsers(data);
        } catch (err) {
            console.error(err);
            // Fallback mock
            setUsers([
                { _id: '1', fullName: 'John Doe', email: 'john@example.com', createdAt: new Date().toISOString() },
                { _id: '2', fullName: 'Jane Smith', email: 'jane@smith.io', createdAt: new Date().toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this user and ALL their files? This cannot be undone.')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Delete failed');
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert(`Failed to delete user: ${err.message}`);
        }
    };

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1.5rem' }}>
                <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '500px' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%', padding: '0.85rem 1rem 0.85rem 3rem',
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '14px', color: 'white', outline: 'none', fontSize: '0.9rem'
                        }}
                    />
                </div>
                <button
                    onClick={() => { setLoading(true); fetchUsers(); }}
                    style={{ background: 'var(--accent-primary)', border: 'none', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
                >
                    Refresh Users
                </button>
            </div>

            <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '20px',
                overflowX: 'auto',
                width: '100%'
            }}>
                <table style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                            <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
                            <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                            <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Joined Date</th>
                            <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Shared Files</th>
                            <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                            <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                        <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                                        <p>Loading user records...</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                            <AlertCircle size={32} />
                                            <p style={{ marginTop: '1rem' }}>No users found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                                >
                                    <td style={{ padding: '0.75rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,122,0,0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                                                {user.fullName.charAt(0)}
                                            </div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user.fullName}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                                        {user.email}
                                    </td>
                                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '0.75rem 1.5rem', textAlign: 'center' }}>
                                        <span style={{ 
                                            background: user.sharedFilesCount > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', 
                                            color: user.sharedFilesCount > 0 ? '#10b981' : 'rgba(255,255,255,0.4)', 
                                            padding: '0.25rem 0.6rem', 
                                            borderRadius: '12px', 
                                            fontSize: '0.7rem', 
                                            fontWeight: 600 
                                        }}>
                                            {user.sharedFilesCount || 0}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontSize: '0.7rem', fontWeight: 600 }}>
                                            <ShieldCheck size={12} /> Active
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default AdminUserList;
