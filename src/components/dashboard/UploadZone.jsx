import { Cloud, Loader2 } from 'lucide-react';
import { useRef } from 'react';

const UploadZone = ({ onUploadFile, isUploading }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && onUploadFile) {
            onUploadFile(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.style.background = 'rgba(123,51,255,0.05)';
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.currentTarget.style.background = 'rgba(123,51,255,0.02)';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.style.background = 'rgba(123,51,255,0.02)';
        const file = e.dataTransfer.files[0];
        if (file && onUploadFile) onUploadFile(file);
    };

    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
                padding: '2rem 2rem',
                background: 'rgba(123,51,255,0.02)',
                border: '2px dashed rgba(123,51,255,0.2)',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                marginBottom: '1.5rem',
                transition: 'all 0.3s'
            }}
        >
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
            />
            
            <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'rgba(123,51,255,0.1)', color: 'var(--accent-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem'
            }}>
                {isUploading ? <Loader2 size={24} className="animate-spin" /> : <Cloud size={24} />}
            </div>

            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                {isUploading ? 'Uploading...' : 'Drop your files here'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '400px', marginBottom: '1.5rem' }}>
                Upload PDFs, Images, or Documents. Support for files up to 100MB.
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                    disabled={isUploading}
                    onClick={() => fileInputRef.current.click()}
                    className="btn btn-outline" 
                    style={{ background: 'white', padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                >
                    {isUploading ? 'Please wait' : 'Browse Files'}
                </button>
            </div>
        </div>
    );
};

export default UploadZone;
