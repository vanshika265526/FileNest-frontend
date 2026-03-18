import { Trash2, FileIcon, ImageIcon, VideoIcon, FileTextIcon, MoreVertical, Filter, Loader2 } from 'lucide-react';

const FileListTable = ({ files, onRefresh, isLoading, onFileClick, onDelete }) => {
    // We now use the centralized onDelete passed from Dashboard

    const getIcon = (category) => {
        switch (category) {
            case 'pdf': return <FileTextIcon size={18} color="#EF4444" />;
            case 'video': return <VideoIcon size={18} color="#FF7A00" />;
            case 'image': return <ImageIcon size={18} color="#7B33FF" />;
            case 'document': return <FileTextIcon size={18} color="#3B82F6" />;
            default: return <FileIcon size={18} color="var(--accent-primary)" />;
        }
    };

    if (isLoading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                <p>Loading your files...</p>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Storage View</h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.01)' }}>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>File Name</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upload Date</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    No files found. Start by uploading some!
                                </td>
                            </tr>
                        ) : (
                            files.map(file => (
                                <tr key={file._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'} onClick={() => onFileClick(file)}>
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div style={{ padding: '0.35rem', borderRadius: '6px', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {getIcon(file.category)}
                                            </div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{file.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        {new Date(file.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{file.size}</td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(file._id);
                                            }}
                                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.4rem' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Showing {files.length} files</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }}>Previous</button>
                    <button className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', background: 'white' }}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default FileListTable;
