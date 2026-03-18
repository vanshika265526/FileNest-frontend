import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, Loader2, Lock, FileText, CheckCircle, Database } from 'lucide-react';
import API_BASE_URL, { getFileUrl } from '../api/apiConfig';

const SharedFileView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [fileData, setFileData] = useState(null);
    const [accessData, setAccessData] = useState(null);
    const [error, setError] = useState(null);
    const [requestLoading, setRequestLoading] = useState(false);

    useEffect(() => {
        const checkAccess = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                // Redirect to login if not authenticated, asking them to log in to view
                navigate('/login', { state: { returnUrl: `/share/${id}` }});
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/api/files/shared/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    setFileData(data.file);
                    setAccessData({ hasAccess: true });
                } else if (res.status === 403 && data.requiresRequest) {
                    setAccessData(data);
                } else {
                    setError(data.message || 'File not found or unavailable');
                }
            } catch (err) {
                setError('Failed to connect to server');
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, [id, navigate]);

    const handleRequestAccess = async () => {
        setRequestLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/files/${id}/request-access`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await res.json();
            
            if (res.ok) {
                setAccessData(prev => ({
                    ...prev,
                    requestStatus: 'pending'
                }));
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('Failed to send request');
        } finally {
            setRequestLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
                <Loader2 size={40} className="animate-spin" color="var(--accent-primary)" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <ShieldAlert size={64} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Error</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>{error}</p>
                    <button onClick={() => navigate('/dashboard')} style={{ marginTop: '2rem', background: 'white', color: 'black', border: 'none', padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (accessData?.hasAccess && fileData) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px' }}>
                            {fileData.category === 'image' ? <Database size={24} color="#3b82f6" /> : <FileText size={24} color="#7b33ff" />}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{fileData.name}</h2>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Shared by {fileData.owner.fullName}</p>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => {
                            const url = getFileUrl(fileData.url);
                            window.open(`${url}${url.includes('?') ? '&' : '?'}token=${localStorage.getItem('token')}`, '_blank');
                        }} style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            Download / View Original
                        </button>
                    </div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    {fileData.category === 'image' || fileData.type.startsWith('image/') ? (
                        <img src={`${getFileUrl(fileData.url)}${getFileUrl(fileData.url).includes('?') ? '&' : '?'}token=${localStorage.getItem('token')}`} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} alt={fileData.name} />
                    ) : (
                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                            <FileText size={80} style={{ margin: '0 auto 2rem', opacity: 0.2 }} />
                            <p style={{ fontSize: '1.2rem' }}>Preview not available for this file type.</p>
                            <p>Please download to view contents.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Access Denied - Request Access View
    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
            <div style={{ width: '100%', maxWidth: '460px', background: 'rgba(255,255,255,0.02)', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={32} color="rgba(255,255,255,0.8)" />
                </div>
                
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Required</h2>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', lineHeight: 1.5 }}>
                    You need permission to access <strong>{accessData?.fileSummary?.name}</strong>. 
                    The owner ({accessData?.fileSummary?.owner?.fullName}) must approve your request.
                </p>

                {accessData?.requestStatus === 'pending' ? (
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#3b82f6', fontWeight: 600 }}>
                        <Loader2 size={18} className="animate-spin" /> Request Pending...
                    </div>
                ) : accessData?.requestStatus === 'rejected' ? (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '12px', color: '#ef4444', fontWeight: 600 }}>
                        Your request was denied by the owner.
                    </div>
                ) : (
                    <button 
                        onClick={handleRequestAccess}
                        disabled={requestLoading}
                        style={{ width: '100%', background: 'white', color: 'black', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: requestLoading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        {requestLoading ? <Loader2 size={20} className="animate-spin" /> : 'Request Access'}
                    </button>
                )}

                <button onClick={() => navigate('/dashboard')} style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
};

export default SharedFileView;
