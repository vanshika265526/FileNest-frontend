import { Clock, FileIcon, ImageIcon, FileTextIcon, VideoIcon, MoreHorizontal, Download, Trash } from 'lucide-react';
import API_BASE_URL, { getFileUrl } from '../../api/apiConfig';

const RecentFiles = ({ files, onFileClick, onDelete }) => {
    if (!files || files.length === 0) return null;
    const recentFiles = files;

    const getIcon = (type) => {
        switch (type) {
            case 'pdf': return <FileTextIcon size={16} color="#EF4444" />;
            case 'video': return <VideoIcon size={16} color="#FF7A00" />;
            case 'image': return <ImageIcon size={16} color="#7B33FF" />;
            default: return <FileIcon size={16} color="var(--accent-primary)" />;
        }
    };

    return (
        <div style={{ background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(255,122,0,0.1)', color: 'var(--accent-primary)' }}>
                        <Clock size={16} />
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Activity</h3>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Last 24 hours</div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.01)' }}>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>File Name</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Accessed</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size</th>
                            <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentFiles.map(file => (
                            <tr key={file._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'} onClick={() => onFileClick(file)}>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <div style={{ padding: '0.35rem', borderRadius: '6px', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', width: '28px', height: '28px' }}>
                                            {file.category === 'image' ? (
                                                <img src={getFileUrl(file.url)} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                            ) : (
                                                getIcon(file.category)
                                            )}
                                        </div>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{file.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                                        {new Date(file.createdAt).toLocaleString()}
                                    </div>
                                </td>
                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{file.size}</td>
                                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(file._id);
                                            }}
                                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center' }}
                                            title="Delete file"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.4rem' }}>
                                            <MoreVertical size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ padding: '0.75rem 1.25rem', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
                <button style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    margin: '0 auto'
                }}>
                    View Full History <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
};

// Internal sub-component for consistency
const ChevronRight = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
    </svg>
);

export default RecentFiles;
