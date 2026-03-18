import { useState, useEffect } from 'react';
import { Check, X, Clock, FileText, User, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../api/apiConfig';

const AccessRequests = ({ onRefreshCount }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/files/requests`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setRequests(data);
                if (onRefreshCount) onRefreshCount(data.length);
            }
        } catch (err) {
            console.error('Failed to fetch requests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleRespond = async (fileId, requesterId, action) => {
        setProcessingId(`${fileId}-${requesterId}`);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/files/${fileId}/respond-request`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ requesterId, action })
            });

            if (res.ok) {
                setRequests(prev => prev.filter(req => !(req.fileId === fileId && req.user._id === requesterId)));
                if (onRefreshCount) onRefreshCount(requests.length - 1);
            } else {
                const data = await res.json();
                alert(data.message || 'Action failed');
            }
        } catch (err) {
            alert('Failed to connect to server');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <Loader2 size={32} className="animate-spin" color="var(--accent-primary)" style={{ margin: '0 auto' }} />
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Checking for access requests...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '0.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Access Requests</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Manage permissions for users who want to view your private files.</p>
            </div>

            {requests.length === 0 ? (
                <div style={{ 
                    background: 'var(--bg-card)', 
                    border: '1px dashed var(--border-color)', 
                    borderRadius: '24px', 
                    padding: '5rem 2rem', 
                    textAlign: 'center' 
                }}>
                    <div style={{ 
                        width: '64px', height: '64px', background: 'rgba(255,255,255,0.03)', 
                        borderRadius: '20px', display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', margin: '0 auto 1.5rem' 
                    }}>
                        <ShieldAlert size={32} color="rgba(255,255,255,0.2)" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>No Pending Requests</h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '300px', margin: '0 auto', fontSize: '0.9rem' }}>
                        When users request access to your private share links, they will appear here.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
                    <AnimatePresence>
                        {requests.map((req) => (
                            <motion.div
                                key={`${req.fileId}-${req.user._id}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '20px',
                                    padding: '1.25rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.25rem'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div style={{ 
                                        width: '44px', height: '44px', background: 'rgba(59, 130, 246, 0.1)', 
                                        borderRadius: '12px', display: 'flex', alignItems: 'center', 
                                        justifyContent: 'center', color: '#3b82f6' 
                                    }}>
                                        <FileText size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '0.2rem' }}>{req.fileName}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                                            <Clock size={12} /> Requested {new Date(req.requestedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '30px', height: '30px', background: 'var(--accent-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                        {req.user.fullName.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white' }}>{req.user.fullName}</p>
                                        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{req.user.email}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        onClick={() => handleRespond(req.fileId, req.user._id, 'approve')}
                                        disabled={processingId === `${req.fileId}-${req.user._id}`}
                                        style={{ 
                                            flex: 1, background: '#10b981', color: 'white', border: 'none', 
                                            padding: '0.75rem', borderRadius: '12px', fontWeight: 700, 
                                            fontSize: '0.85rem', cursor: 'pointer', display: 'flex', 
                                            alignItems: 'center', justifyContent: 'center', gap: '0.4rem' 
                                        }}
                                    >
                                        {processingId === `${req.fileId}-${req.user._id}` ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Approve
                                    </button>
                                    <button
                                        onClick={() => handleRespond(req.fileId, req.user._id, 'reject')}
                                        disabled={processingId === `${req.fileId}-${req.user._id}`}
                                        style={{ 
                                            background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', 
                                            border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem 1rem', 
                                            borderRadius: '12px', fontWeight: 600, cursor: 'pointer' 
                                        }}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default AccessRequests;
