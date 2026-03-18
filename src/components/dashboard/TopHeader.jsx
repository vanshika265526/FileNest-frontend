import { Search, Plus, Loader2 } from 'lucide-react';
import { useRef } from 'react';

const TopHeader = ({ searchQuery, onSearchChange, onUploadFile, isUploading }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && onUploadFile) {
            onUploadFile(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            background: 'var(--bg-dark)',
            borderBottom: '1px solid var(--border-color)',
            gap: '1.5rem'
        }}>
            {/* Search Bar */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                flex: 1, maxWidth: '600px',
                background: 'var(--bg-card)', padding: '0.6rem 1.25rem',
                border: '1px solid var(--border-color)', borderRadius: '12px',
                color: 'var(--text-secondary)'
            }}>
                <Search size={16} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search your files, folders, documents..."
                    style={{
                        background: 'transparent', border: 'none', outline: 'none',
                        width: '100%', fontSize: '0.85rem', color: 'var(--text-primary)'
                    }}
                />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} 
                />
                <button 
                    className="btn btn-primary" 
                    onClick={() => fileInputRef.current.click()}
                    disabled={isUploading}
                    style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} 
                    {isUploading ? 'Uploading...' : 'Upload New'}
                </button>
            </div>
        </header>
    );
};

export default TopHeader;
