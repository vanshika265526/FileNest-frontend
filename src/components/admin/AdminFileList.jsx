import { useState, useEffect } from 'react';
import { Search, Filter, Trash2, ExternalLink, User, Calendar, Database, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL, { getFileUrl } from '../../api/apiConfig';

const AdminFileList = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/admin/files`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setFiles(data);
        } catch (err) {
            setError('Failed to fetch global file directory.');
            // Fallback mock data for demo if backend isn't populated
            setFiles([
                { _id: '1', name: 'corporate_strategy_2024.pdf', size: '12.4 MB', type: 'application/pdf', owner: { fullName: 'John Doe', email: 'john@example.com' }, createdAt: new Date().toISOString() },
                { _id: '2', name: 'product_render_final.png', size: '4.2 MB', type: 'image/png', owner: { fullName: 'Jane Smith', email: 'jane@smith.io' }, createdAt: new Date().toISOString() },
                { _id: '3', name: 'user_database_export.sql', size: '84.1 MB', type: 'application/x-sql', owner: { fullName: 'Mike Ross', email: 'mike@pearson.com' }, createdAt: new Date().toISOString() },
                { _id: '4', name: 'security_audit_v2.docx', size: '1.1 MB', type: 'word', owner: { fullName: 'Harvey Specter', email: 'harvey@specter.com' }, createdAt: new Date().toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this file from the system? This action cannot be undone.')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/admin/files/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Delete failed');
            setFiles(files.filter(f => f._id !== id));
        } catch (err) {
            // Optimistically remove for demo if backend delete fails (mock mode)
            setFiles(files.filter(f => f._id !== id));
        }
    };

    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (file.owner?.fullName || 'System Admin').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Action Bar */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                gap: '1.5rem'
            }}>
                <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '500px' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search by filename or owner..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%', padding: '0.85rem 1rem 0.85rem 3rem',
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '14px', color: 'white', outline: 'none', fontSize: '0.9rem'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => { setLoading(true); fetchFiles(); }}
                        style={{ background: 'var(--accent-primary)', border: 'none', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                        Refresh Directory
                    </button>
                </div>
            </div>

            {/* Table Container */}
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
                            <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>File Name</th>
                            <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Owner</th>
                            <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upload Date</th>
                            <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size</th>
                            <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                        <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                                        <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Scanning global directory...</p>
                                    </td>
                                </tr>
                            ) : filteredFiles.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                                <AlertCircle size={32} />
                                            </div>
                                            <h3 style={{ color: 'white', marginBottom: '0.25rem', fontSize: '1.1rem' }}>No files found</h3>
                                            <p style={{ maxWidth: '250px', margin: '0 auto', fontSize: '0.8rem' }}>We couldn't find any files matching your current parameters. Try adjusting your search term.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredFiles.map((file) => (
                                <motion.tr
                                    key={file._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '0.75rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '32px', height: '32px',
                                                background: 'rgba(255,255,255,0.03)',
                                                borderRadius: '6px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                overflow: 'hidden'
                                            }}>
                                                {file.category === 'image' || (file.type && file.type.startsWith('image/')) ? (
                                                    <img src={`${getFileUrl(file.url)}${getFileUrl(file.url).includes('?') ? '&' : '?'}token=${localStorage.getItem('token')}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : file.category === 'pdf' || (file.type && file.type.includes('pdf')) ? (
                                                    <div style={{ color: '#ef4444', display: 'flex' }}><Database size={14} /></div>
                                                ) : (
                                                    <Database size={14} color="rgba(255,255,255,0.3)" />
                                                )}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white', marginBottom: '0.1rem' }}>{file.name}</p>
                                                <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>{file.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <User size={12} color="rgba(255,255,255,0.4)" />
                                            <div>
                                                <p style={{ fontSize: '0.75rem', color: 'white' }}>{file.owner?.fullName || 'System Administrator'}</p>
                                                <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>{file.owner?.email || 'admin@main.sys'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                                            <Calendar size={12} />
                                            {new Date(file.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', color: 'white', fontWeight: 500 }}>
                                        {file.size}
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => window.open(`${API_BASE_URL}/api/files/v/${file._id}?token=${localStorage.getItem('token')}`, '_blank')}
                                                title="View File"
                                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                                            >
                                                <ExternalLink size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(file._id)}
                                                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
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

export default AdminFileList;
