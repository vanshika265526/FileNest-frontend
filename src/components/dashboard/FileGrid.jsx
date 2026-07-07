import { FileIcon, MoreVertical, Trash, ExternalLink, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getFileUrl } from '../../api/apiConfig';

/**
 * Converts a Cloudinary PDF URL into a thumbnail image URL for the first page.
 * Cloudinary supports PDF-to-image transformation natively.
 *
 * Input:  https://res.cloudinary.com/CLOUD/raw/upload/v123/.../file.pdf
 * Output: https://res.cloudinary.com/CLOUD/image/upload/pg_1,w_400,h_300,c_fill,f_jpg,q_80/v123/.../file.pdf
 */
const getCloudinaryPdfThumbnail = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    try {
        const transformation = 'pg_1,w_400,h_300,c_fill,f_jpg,q_80';

        // Handle all possible Cloudinary resource type paths
        if (url.includes('/raw/upload/')) {
            return url.replace('/raw/upload/', `/image/upload/${transformation}/`);
        }
        if (url.includes('/image/upload/')) {
            // Already image resource — inject transformation after /image/upload/
            return url.replace('/image/upload/', `/image/upload/${transformation}/`);
        }
        if (url.includes('/video/upload/')) {
            return url.replace('/video/upload/', `/image/upload/${transformation}/`);
        }
        // Generic fallback: insert transformation before the version token (v12345...)
        return url.replace(/(\/upload\/)/, `/upload/${transformation}/`);
    } catch {
        return null;
    }
};

const getCategoryStyle = (category) => {
    switch (category) {
        case 'pdf':      return { bg: 'linear-gradient(135deg, #ff4e50, #f9d423)', icon: '📄', label: 'PDF' };
        case 'image':    return { bg: 'linear-gradient(135deg, #667eea, #764ba2)', icon: '🖼️', label: 'IMG' };
        case 'document': return { bg: 'linear-gradient(135deg, #2193b0, #6dd5ed)', icon: '📝', label: 'DOC' };
        case 'video':    return { bg: 'linear-gradient(135deg, #1a1a2e, #16213e)', icon: '🎬', label: 'VID' };
        default:         return { bg: 'linear-gradient(135deg, #485563, #29323c)', icon: '📁', label: 'FILE' };
    }
};

/**
 * DocxThumbnail — renders the actual first page of a .docx/.doc file as a real image preview.
 *
 * Key fix: html2canvas cannot capture visibility:hidden elements. Instead we append
 * a portal div directly to document.body, positioned far off-screen to the LEFT
 * (position:fixed; left:-9999px) — it's invisible to the user but fully visible to
 * html2canvas, so it can render and screenshot the docx content.
 */
const DocxThumbnail = ({ file }) => {
    const [imgSrc, setImgSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    const isExcel = file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls');
    const label = isExcel ? 'XLS' : 'DOC';
    const labelColor = isExcel ? '#16a34a' : '#2563eb';

    useEffect(() => {
        let cancelled = false;

        const generate = async () => {
            // Only .docx/.doc get real previews — Excel falls through to fallback
            const ext = file.name.toLowerCase().split('.').pop();
            if (!['docx', 'doc'].includes(ext)) {
                setFailed(true);
                setLoading(false);
                return;
            }

            // Create an off-screen portal div appended to <body>
            // MUST NOT use visibility:hidden — that blocks html2canvas
            const portal = document.createElement('div');
            portal.style.cssText = [
                'position:fixed',
                'top:0',
                'left:-9999px',
                'width:794px',       /* A4 width at 96 dpi */
                'min-height:600px',
                'background:white',
                'overflow:hidden',
                'z-index:-1',
                'pointer-events:none',
            ].join(';');
            document.body.appendChild(portal);

            try {
                // Fetch the file blob (with auth token)
                const fileUrl = getFileUrl(file.url);
                const token = localStorage.getItem('token');
                const sep = fileUrl.includes('?') ? '&' : '?';
                const resp = await fetch(`${fileUrl}${sep}token=${token}`);
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const blob = await resp.blob();

                if (cancelled) return;

                // Render the docx HTML into the portal
                const { renderAsync } = await import('docx-preview');
                await renderAsync(blob, portal, null, {
                    className: 'docx-thumb-inner',
                    inWrapper: false,
                    ignoreWidth: false,
                    ignoreHeight: false,
                    breakPages: false,
                    useBase64URL: true,
                });

                if (cancelled) return;

                // Allow DOM to paint fully before screenshotting
                await new Promise(r => setTimeout(r, 300));
                if (cancelled) return;

                const { default: html2canvas } = await import('html2canvas');
                const captureHeight = Math.min(portal.scrollHeight, 1123); // A4 height
                const canvas = await html2canvas(portal, {
                    scale: 0.6,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    x: 0,
                    y: 0,
                    width: 794,
                    height: captureHeight,
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: 794,
                    windowHeight: captureHeight,
                    logging: false,
                });

                if (!cancelled) {
                    setImgSrc(canvas.toDataURL('image/jpeg', 0.85));
                }
            } catch (e) {
                console.warn('[DocxThumbnail] render error:', e);
                if (!cancelled) setFailed(true);
            } finally {
                // Always clean up the portal from the DOM
                if (document.body.contains(portal)) {
                    document.body.removeChild(portal);
                }
                if (!cancelled) setLoading(false);
            }
        };

        generate();
        return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file.url]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#f8fafc' }}>

            {imgSrc ? (
                /* ── Real first-page screenshot ── */
                <>
                    <img
                        src={imgSrc}
                        alt={file.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                    />
                    <span style={{
                        position: 'absolute', top: '0.5rem', left: '0.5rem',
                        background: labelColor, color: 'white',
                        fontSize: '0.55rem', fontWeight: 800,
                        letterSpacing: '0.08em', padding: '0.18rem 0.45rem',
                        borderRadius: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                    }}>{label}</span>
                </>
            ) : loading ? (
                /* ── Spinner while generating ── */
                <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '0.5rem', background: '#f8fafc'
                }}>
                    <Loader2 size={22} style={{ opacity: 0.4, animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 500 }}>Generating preview…</span>
                </div>
            ) : (
                /* ── Fallback gradient card if render fails ── */
                <div style={{
                    width: '100%', height: '100%',
                    background: isExcel
                        ? 'linear-gradient(135deg,#166534,#16a34a)'
                        : 'linear-gradient(135deg,#1e40af,#2563eb)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '0.45rem'
                }}>
                    <span style={{ fontSize: '2.6rem', lineHeight: 1 }}>{isExcel ? '📊' : '📝'}</span>
                    <span style={{
                        background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)',
                        color: 'white', fontWeight: 800, fontSize: '0.6rem',
                        letterSpacing: '0.12em', padding: '0.18rem 0.6rem',
                        borderRadius: '999px', border: '1px solid rgba(255,255,255,0.32)'
                    }}>{label}</span>
                </div>
            )}
        </div>
    );
};

/* ── Single file card ── */
const FileCard = ({ file, onFileClick, onDelete }) => {
    const [thumbError, setThumbError] = useState(false);
    const catStyle = getCategoryStyle(file.category);

    // For PDFs: try Cloudinary thumbnail first, fall back to styled card
    const pdfThumbUrl = file.category === 'pdf' ? getCloudinaryPdfThumbnail(file.url) : null;
    const showRealThumb = (file.category === 'image') || (file.category === 'pdf' && pdfThumbUrl && !thumbError);

    return (
        <div
            className="file-card"
            onClick={() => onFileClick(file)}
            style={{
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'transform 0.22s, box-shadow 0.22s',
                cursor: 'pointer',
                position: 'relative'
            }}
        >
            {/* ── Thumbnail area ── */}
            <div style={{
                height: '150px',
                background: showRealThumb ? '#f0f0f0' : catStyle.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid var(--border-color)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {showRealThumb ? (
                    <img
                        src={file.category === 'pdf' ? pdfThumbUrl : getFileUrl(file.url)}
                        alt={file.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={() => setThumbError(true)}
                    />
                ) : (file.category === 'document') ? (
                    <DocxThumbnail file={file} />
                ) : (
                    /* Styled fallback card — used when no real preview available */
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        width: '100%',
                        height: '100%',
                        padding: '0.75rem'
                    }}>
                        <span style={{ fontSize: '2.8rem', lineHeight: 1 }}>{catStyle.icon}</span>
                        <span style={{
                            background: 'rgba(255,255,255,0.22)',
                            backdropFilter: 'blur(6px)',
                            color: 'white',
                            fontWeight: 800,
                            fontSize: '0.6rem',
                            letterSpacing: '0.12em',
                            padding: '0.18rem 0.6rem',
                            borderRadius: '999px',
                            border: '1px solid rgba(255,255,255,0.32)'
                        }}>
                            {catStyle.label}
                        </span>
                        <span style={{
                            color: 'rgba(255,255,255,0.82)',
                            fontSize: '0.64rem',
                            fontWeight: 500,
                            maxWidth: '85%',
                            textAlign: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {file.name.replace(/\.[^/.]+$/, '')}
                        </span>
                    </div>
                )}

                {/* PDF badge overlay (when showing real PDF preview) */}
                {file.category === 'pdf' && !thumbError && pdfThumbUrl && (
                    <span style={{
                        position: 'absolute', top: '0.5rem', left: '0.5rem',
                        background: '#e53935',
                        color: 'white',
                        fontSize: '0.55rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        padding: '0.18rem 0.45rem',
                        borderRadius: '4px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                    }}>
                        PDF
                    </span>
                )}

                {/* Open in new tab — fades in on hover */}
                <button
                    className="action-btn-grid"
                    title="Open in new tab"
                    onClick={(e) => {
                        e.stopPropagation();
                        const url = getFileUrl(file.url);
                        window.open(
                            `${url}${url.includes('?') ? '&' : '?'}token=${localStorage.getItem('token')}`,
                            '_blank'
                        );
                    }}
                    style={{
                        position: 'absolute', top: '0.5rem', right: '0.5rem',
                        background: 'rgba(0,0,0,0.45)',
                        backdropFilter: 'blur(4px)',
                        color: 'white', border: 'none', borderRadius: '6px',
                        padding: '0.3rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: 0, transition: 'opacity 0.2s'
                    }}
                >
                    <ExternalLink size={14} />
                </button>
            </div>

            {/* ── Footer ── */}
            <div style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem', gap: '0.5rem' }}>
                    <h4 style={{
                        fontSize: '0.85rem', fontWeight: 600,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        flex: 1, margin: 0
                    }}>
                        {file.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', flexShrink: 0 }}>
                        <button
                            title="Delete"
                            onClick={(e) => { e.stopPropagation(); onDelete(file._id); }}
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
                        >
                            <Trash size={14} />
                        </button>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}>
                            <MoreVertical size={14} />
                        </button>
                    </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {file.size} • {new Date(file.createdAt).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
};

/* ── Grid wrapper ── */
const FileGrid = ({ files, isLoading, onFileClick, onDelete }) => {
    if (isLoading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                <p>Loading your nest...</p>
            </div>
        );
    }

    if (!files || files.length === 0) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <FileIcon size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>No files found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.5rem'
            }}>
                {files.map(file => (
                    <FileCard
                        key={file._id}
                        file={file}
                        onFileClick={onFileClick}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            <style>{`
                .file-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 32px rgba(0,0,0,0.10);
                }
                .file-card:hover .action-btn-grid {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
};

export default FileGrid;
