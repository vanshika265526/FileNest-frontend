import { FileIcon, ImageIcon, FileTextIcon, VideoIcon, MoreVertical, Download, Link, Trash, ExternalLink, Loader2 } from 'lucide-react';
import API_BASE_URL, { getFileUrl } from '../../api/apiConfig';

const FileGrid = ({ files, isLoading, onFileClick, onDelete }) => {

    const getPreviewColor = (category) => {
        switch (category) {
            case 'pdf': return 'rgba(123,51,255,0.05)';
            case 'image': return 'linear-gradient(135deg, #FF7A00, #7b33ff)';
            case 'document': return '#111827';
            default: return 'var(--bg-card)';
        }
    };

    if (isLoading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                <p>Loading your nest...</p>
            </div>
        );
    }

    if (files.length === 0) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <FileIcon size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>No files found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1.5rem'
            }}>
                {files.map(file => (
                    <div key={file._id} style={{
                        background: 'white',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer'
                    }} className="file-card" onClick={() => onFileClick(file)}>

                        {/* Preview Area */}
                        <div style={{
                            height: '140px',
                            background: getPreviewColor(file.category),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottom: '1px solid var(--border-color)',
                            position: 'relative'
                        }}>
                            {file.category === 'pdf' ? (
                                <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <iframe
                                        src={`${getFileUrl(file.url)}${getFileUrl(file.url).includes('?') ? '&' : '?'}token=${localStorage.getItem('token')}`}
                                        title={file.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            border: 'none',
                                            pointerEvents: 'none'
                                        }}
                                    />
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            const url = getFileUrl(file.url);
                                            window.open(`${url}${url.includes('?') ? '&' : '?'}token=${localStorage.getItem('token')}`, '_blank'); 
                                        }} 
                                        className="action-btn-grid" 
                                        title="Open Link" 
                                        style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '5px', padding: '0.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <ExternalLink size={14} />
                                    </button>
                                </div>
                            ) : file.category === 'image' ? (
                                <img src={`${getFileUrl(file.url)}${getFileUrl(file.url).includes('?') ? '&' : '?'}token=${localStorage.getItem('token')}`} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <FileIcon size={40} color="var(--accent-primary)" />
                            )}
                        </div>

                        <div style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '0.5rem' }}>
                                <h4 style={{ 
                                    fontSize: '0.85rem', 
                                    fontWeight: 600,
                                    color: 'var(--text-primary)', 
                                    whiteSpace: 'nowrap', 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    flex: 1
                                }}>{file.name}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(file._id);
                                        }}
                                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
                                        title="Delete file"
                                    >
                                        <Trash size={14} />
                                    </button>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}>
                                        <MoreVertical size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-between">
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                    {file.size} • {new Date(file.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .file-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }
            `}</style>
        </div>
    );
};

export default FileGrid;
