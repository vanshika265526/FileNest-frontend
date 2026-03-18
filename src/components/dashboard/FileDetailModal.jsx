import React, { useState, useEffect } from 'react';
import {
    X, Download, Maximize2, Share2, Copy,
    MoreHorizontal, ChevronDown, Check,
    UserPlus, ShieldCheck, Globe, Search,
    FileIcon, ImageIcon, FileTextIcon, VideoIcon,
    Loader2
} from 'lucide-react';
import API_BASE_URL, { FRONTEND_BASE_URL, getFileUrl } from '../../api/apiConfig';

const FileDetailModal = ({ file: initialFile, isOpen, onClose, user, onRefresh }) => {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState('view');
    const [isSharing, setIsSharing] = useState(false);
    const [file, setFile] = useState(initialFile);
    const [error, setError] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        setFile(initialFile);
        setError(null);
        setCopySuccess(false);
    }, [initialFile]);

    if (!isOpen || !file) return null;

    const handleInvite = async () => {
        if (!email) return;
        setIsSharing(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/files/${file._id}/share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email, permission })
            });
            const data = await response.json();
            if (response.ok) {
                setFile(data);
                setEmail('');
                setPermission('view');
                if (onRefresh) onRefresh();
                alert('File shared successfully!');
            } else {
                setError(data.message || 'Failed to share file');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setIsSharing(false);
        }
    };

    const handleUpdatePermission = async (userId, newPermission) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/files/${file._id}/permission`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId, permission: newPermission })
            });
            const data = await response.json();
            if (response.ok) {
                setFile(data);
                if (onRefresh) onRefresh();
            }
        } catch (err) {
            console.error('Update Permission Error:', err);
        }
    };

    const handleTogglePublic = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/files/${file._id}/public`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setFile(prev => ({ ...prev, isPublic: data.isPublic }));
                if (onRefresh) onRefresh();
            }
        } catch (err) {
            console.error('Toggle Public Error:', err);
        }
    };

    const handleCopyLink = () => {
        // Direct, deployment-safe file link served by your backend
        const publicUrl = `${API_BASE_URL}/api/files/v/${file._id}`;
        navigator.clipboard.writeText(publicUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const getIcon = (category) => {
        switch (category) {
            case 'pdf': return <FileTextIcon size={24} color="#EF4444" />;
            case 'video': return <VideoIcon size={24} color="#FF7A00" />;
            case 'image': return <ImageIcon size={24} color="#7B33FF" />;
            case 'document': return <FileTextIcon size={24} color="#3B82F6" />;
            default: return <FileIcon size={24} color="var(--accent-primary)" />;
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = previewUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleMaximize = () => {
        window.open(previewUrl, '_blank');
    };

    const token = localStorage.getItem('token');
    // For PDFs, prefer the direct storage URL so Cloudinary/S3 can stream the file without proxy 401s
    const basePreviewUrl = file.category === 'pdf' 
        ? getFileUrl(file.url)
        : getFileUrl(file.url);
    
    const previewUrl = `${basePreviewUrl}${basePreviewUrl.includes('?') ? '&' : '?'}token=${token}`;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            padding: '2rem'
        }} onClick={onClose}>
            <div style={{
                background: '#f8fafc',
                width: '100%',
                maxWidth: '1000px',
                height: '85vh',
                borderRadius: '20px',
                display: 'flex',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                animation: 'modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }} onClick={e => e.stopPropagation()}>

                {/* Left Panel: Preview */}
                <div style={{
                    flex: 1.2,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'white',
                    borderRight: '1px solid #e2e8f0',
                    overflowY: 'auto'
                }}>
                    {/* Preview Header */}
                    <div style={{ padding: '1.25rem 1.5rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{ padding: '0.4rem', background: '#f1f5f9', borderRadius: '8px' }}>
                                {getIcon(file.category)}
                            </div>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{file.name}</h2>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button className="icon-btn-modal" title="Search in file"><Search size={16} /></button>
                            <button className="icon-btn-modal" onClick={handleDownload} title="Download file"><Download size={16} /></button>
                            <button className="icon-btn-modal" onClick={handleMaximize} title="Open in full view"><Maximize2 size={16} /></button>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div style={{
                        flex: 1,
                        margin: '0 1.5rem 1rem',
                        background: '#f8fafc',
                        borderRadius: '16px',
                        border: file.category === 'pdf' ? '1px solid #e2e8f0' : '2px dashed #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        {file.category === 'image' ? (
                            <img 
                                src={previewUrl} 
                                alt={file.name} 
                                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} 
                            />
                        ) : file.category === 'pdf' ? (
                            <iframe 
                                src={previewUrl} 
                                title={file.name}
                                style={{ width: '100%', height: '100%', border: 'none', borderRadius: '15px' }}
                            />
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ marginBottom: '1.5rem', transform: 'scale(2)' }}>{getIcon(file.category)}</div>
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#475569' }}>Preview not available</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>This file type cannot be previewed.</div>
                            </div>
                        )}
                    </div>

                    {/* Preview Footer Metadata */}
                    <div style={{ padding: '0 1.5rem 1.25rem', fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04rem' }}>
                        Metadata: Modified {new Date(file.updatedAt).toLocaleDateString()} • {file.size}
                    </div>
                </div>

                {/* Right Panel: Sharing Settings */}
                <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column', padding: '1.5rem', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
                        <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '0.4rem', cursor: 'pointer', color: '#64748b' }}><X size={18} /></button>
                    </div>

                    {/* Share Settings Card */}
                    <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                                <Share2 size={18} color="var(--accent-secondary)" />
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Share Settings</h3>
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Invite People</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        <Search size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email addresses..."
                                            style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '12px', border: error ? '1px solid #ef4444' : '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none' }}
                                        />
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleInvite}
                                        disabled={isSharing || !email}
                                        style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', minWidth: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        {isSharing ? <Loader2 size={16} className="animate-spin" /> : 'Invite'}
                                    </button>
                                </div>
                                {error && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.4rem' }}>{error}</p>}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.75rem' }}>Who has access</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {/* Current User */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,122,0,0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>{user?.fullName?.charAt(0) || 'U'}</div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b' }}>{user?.fullName} (You)</div>
                                                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{user?.email}</div>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Owner</span>
                                    </div>

                                    {/* Shared Users */}
                                    {(file.sharedWith || []).map(share => {
                                        // Handle both potential data structures (populated object or raw ID)
                                        const userId = share.user?._id || (typeof share.user === 'string' ? share.user : null);
                                        const userName = share.user?.fullName || 'Shared User';
                                        const userEmail = share.user?.email || '';
                                        const userRole = share.permission || 'view';

                                        if (!userId) return null;

                                        return (
                                            <AccessItem
                                                key={userId}
                                                id={userId}
                                                name={userName}
                                                email={userEmail}
                                                role={userRole}
                                                onPermissionChange={handleUpdatePermission}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.6rem' }}>Public Link</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.4rem 0.6rem' }}>
                                <Globe size={12} color="#94a3b8" />
                                <div style={{ flex: 1, fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {`${API_BASE_URL}/api/files/v/${file._id}`}
                                </div>
                                <button
                                    style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.25rem 0.5rem', fontSize: '0.7rem', fontWeight: 600, color: copySuccess ? '#10B981' : 'var(--accent-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.2s' }}
                                    onClick={handleCopyLink}
                                >
                                    {copySuccess ? <Check size={10} /> : <Copy size={10} />} {copySuccess ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: '#64748b' }}>
                                <Globe size={12} color={file.isPublic ? "#10B981" : "#94a3b8"} />
                                <span>{file.isPublic ? "Public link is active" : "Only invited people"}</span>
                                <button
                                    onClick={handleTogglePublic}
                                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    {file.isPublic ? "Disable" : "Enable"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Encrypted Sharing Tip */}
                    <div style={{ marginTop: '1rem', background: 'rgba(57, 133, 255, 0.03)', border: '1px solid rgba(57, 133, 255, 0.1)', borderRadius: '14px', padding: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ padding: '0.4rem', background: 'rgba(57, 133, 255, 0.1)', borderRadius: '8px', color: '#3985FF' }}>
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.1rem' }}>Encrypted Sharing</h4>
                            <p style={{ fontSize: '0.65rem', color: '#64748b', lineHeight: 1.3 }}>Shared links are protected with AES-256 bit encryption.</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .icon-btn-modal {
                    background: #f1f5f9;
                    border: none;
                    border-radius: 8px;
                    padding: 0.5rem;
                    cursor: pointer;
                    color: #64748b;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .icon-btn-modal:hover {
                    background: #e2e8f0;
                    color: #1e293b;
                }
                .permission-select:hover {
                    filter: brightness(0.95);
                    border-color: rgba(0,0,0,0.05);
                }
                .permission-select option {
                    background: white;
                    color: #1e293b;
                    padding: 10px;
                }
            `}</style>
        </div>
    );
};

const AccessItem = ({ id, name, email, role, onPermissionChange }) => {
    const getRoleColor = (r) => {
        switch (r?.toLowerCase()) {
            case 'edit': return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' };
            case 'download': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' };
            default: return { bg: 'rgba(57, 133, 255, 0.1)', text: '#3985FF' };
        }
    };

    const roleStyle = getRoleColor(role);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 0',
            borderBottom: '1px solid #f1f5f9'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: '#f1f5f9',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    {name?.charAt(0) || 'U'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>{email}</div>
                </div>
            </div>

            {onPermissionChange ? (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <select
                        value={role}
                        onChange={(e) => onPermissionChange(id, e.target.value)}
                        className="permission-select"
                        style={{
                            background: roleStyle.bg,
                            border: 'none',
                            color: roleStyle.text,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            outline: 'none',
                            padding: '0.35rem 1.4rem 0.35rem 1rem',
                            borderRadius: '8px',
                            appearance: 'none',
                            width: '115px',
                            textAlign: 'center',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <option value="view">Can view</option>
                        <option value="edit">Can edit</option>
                        <option value="download">Can download</option>
                        <option value="remove" style={{ color: '#EF4444' }}>Remove access</option>
                    </select>
                    <ChevronDown size={14} color={roleStyle.text} style={{ position: 'absolute', right: '0.6rem', pointerEvents: 'none' }} />
                </div>
            ) : (
                <div style={{
                    width: '115px',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        background: '#f1f5f9',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        letterSpacing: '0.02em',
                        display: 'inline-block',
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        Owner
                    </span>
                </div>
            )}
        </div>
    );
};

export default FileDetailModal;
