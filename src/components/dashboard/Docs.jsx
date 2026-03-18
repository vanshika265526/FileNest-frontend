import React from 'react';
import {
    Book,
    Upload,
    Shield,
    Share2,
    HardDrive,
    Search,
    Smartphone,
    Cpu,
    CheckCircle2,
    AlertCircle,
    Info,
    ChevronRight,
    HelpCircle
} from 'lucide-react';

const Docs = () => {
    const sections = [
        { id: 'intro', title: 'Introduction', icon: <Info size={18} /> },
        { id: 'getting-started', title: 'Getting Started', icon: <ChevronRight size={18} /> },
        { id: 'uploading', title: 'Uploading Files', icon: <Upload size={18} /> },
        { id: 'organizing', title: 'Organizing & Management', icon: <HardDrive size={18} /> },
        { id: 'security', title: 'Security & Privacy', icon: <Shield size={18} /> },
        { id: 'faq', title: 'Frequently Asked Questions', icon: <HelpCircle size={18} /> },
    ];

    const DocSection = ({ title, children, id }) => (
        <section id={id} style={{ marginBottom: '4rem', scrollMarginTop: '2rem' }}>
            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-color)'
            }}>
                {title}
            </h2>
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                {children}
            </div>
        </section>
    );

    const Tip = ({ children }) => (
        <div style={{
            background: 'rgba(255,122,0,0.05)',
            borderLeft: '4px solid var(--accent-primary)',
            padding: '1rem 1.25rem',
            borderRadius: '4px 12px 12px 4px',
            margin: '1.5rem 0',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start'
        }}>
            <div style={{ color: 'var(--accent-primary)', marginTop: '0.2rem' }}><CheckCircle2 size={18} /></div>
            <div>
                <strong style={{ color: 'var(--accent-primary)', display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pro Tip</strong>
                {children}
            </div>
        </div>
    );

    const Alert = ({ children }) => (
        <div style={{
            background: 'rgba(239,68,68,0.05)',
            borderLeft: '4px solid #EF4444',
            padding: '1rem 1.25rem',
            borderRadius: '4px 12px 12px 4px',
            margin: '1.5rem 0',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start'
        }}>
            <div style={{ color: '#EF4444', marginTop: '0.2rem' }}><AlertCircle size={18} /></div>
            <div>
                <strong style={{ color: '#EF4444', display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Important</strong>
                {children}
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', gap: '3rem', position: 'relative' }}>
            {/* Main Content */}
            <div style={{ flex: 1, maxWidth: '800px' }}>
                <header style={{ marginBottom: '3rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(123,51,255,0.1)',
                        color: 'var(--accent-secondary)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        marginBottom: '1rem'
                    }}>
                        <Book size={14} /> Documentation
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Welcome to FileNest Docs</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        Your comprehensive guide to mastering secure cloud storage. Learn how to upload, manage, and protect your data with the power of FileNest.
                    </p>
                </header>

                <DocSection title="Introduction" id="intro">
                    <p>
                        FileNest is a next-generation cloud storage platform designed for speed, security, and simplicity. Whether you're a creative professional storing high-res assets or a developer archiving projects, FileNest provides the tools you need to stay organized.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                        {[
                            { title: 'Blazing Fast', desc: 'Optimized upload engines for files of any size.', icon: <Cpu size={20} /> },
                            { title: 'Secure by Default', desc: 'End-to-end encryption for all your stored data.', icon: <Shield size={20} /> },
                            { title: 'Device Sync', desc: 'Access your nest from any device, anywhere.', icon: <Smartphone size={20} /> }
                        ].map((feat, i) => (
                            <div key={i} style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                                <div style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>{feat.icon}</div>
                                <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{feat.title}</h4>
                                <p style={{ fontSize: '0.85rem', margin: 0 }}>{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </DocSection>

                <DocSection title="Getting Started" id="getting-started">
                    <p>Setting up your account is the first step toward better file management. Follow these simple steps:</p>
                    <ol style={{ paddingLeft: '1.25rem' }}>
                        <li style={{ marginBottom: '0.75rem' }}><strong>Create an Account:</strong> Sign up with your email and verify your identity.</li>
                        <li style={{ marginBottom: '0.75rem' }}><strong>Customize Profile:</strong> Set your avatar and preferences in the Account Settings.</li>
                        <li style={{ marginBottom: '0.75rem' }}><strong>First Upload:</strong> Head over to the Dashboard to drop your first file into the Nest.</li>
                    </ol>
                    <Tip>
                        Start with the "Dashboard" view to quickly see your overall storage usage and recent activity.
                    </Tip>
                </DocSection>

                <DocSection title="Uploading Files" id="uploading">
                    <p>We've made uploading as intuitive as possible. You have two main ways to add content:</p>
                    <div style={{ margin: '1.5rem 0' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>1</div>
                            <div>
                                <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>Drag & Drop</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>Simply grab files from your computer and drop them anywhere in the orange upload zone on your main dashboard.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>2</div>
                            <div>
                                <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>File Browser</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>Click the "Browse Files" button to open your system's file picker and select multiple items at once.</p>
                            </div>
                        </div>
                    </div>
                    <Alert>
                        Ensure you don't exceed your current storage limit (Free plan: 15GB). Uploads will fail if the Nest is full.
                    </Alert>
                </DocSection>

                <DocSection title="Organizing & Management" id="organizing">
                    <p>Finding your files should never be a chore. Use our built-in tools to stay on top of your data:</p>
                    <ul style={{ paddingLeft: '1.25rem' }}>
                        <li style={{ marginBottom: '1rem' }}>
                            <strong>Smart Search:</strong> Use the search bar in the top header to instantly find files by name or extension.
                        </li>
                        <li style={{ marginBottom: '1rem' }}>
                            <strong>All Files View:</strong> A dense, tabular view for bulk management. Perfect for when you need to see file sizes and upload dates clearly.
                        </li>
                        <li style={{ marginBottom: '1rem' }}>
                            <strong>Recent Activity:</strong> Check the "Recent" tab to find exactly what you were working on just moments ago.
                        </li>
                    </ul>
                    <div style={{
                        background: 'var(--bg-dark)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem'
                    }}>
                        {`// Keyboard Shortcut Tip
// Press '/' to focus the search bar instantly`}
                    </div>
                </DocSection>

                <DocSection title="Security & Privacy" id="security">
                    <p>Security is our top priority. Every file uploaded to FileNest goes through multiple layers of protection:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                        {[
                            { t: 'Encrypted Storage', d: 'Files are encrypted at rest using AES-256 standard.' },
                            { t: 'Secure Transport', d: 'SSL/TLS encryption for all data moving between your device and our servers.' },
                            { t: 'Zero-Knowledge', d: 'Optional end-to-end encryption where even we can\'t see your file contents.' }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
                                <div style={{ color: '#10B981' }}><CheckCircle2 size={18} /></div>
                                <div>
                                    <h5 style={{ margin: '0 0 0.1rem 0', color: 'var(--text-primary)' }}>{item.t}</h5>
                                    <p style={{ margin: 0, fontSize: '0.85rem' }}>{item.d}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </DocSection>

                <DocSection title="FAQ" id="faq">
                    {[
                        { q: 'What is the maximum file size I can upload?', a: 'Individual file uploads are limited to 15GB on the free plan.' },
                        { q: 'Can I recover deleted files?', a: 'Currently, deletions are permanent. We recommend double-checking before confirming a deletion.' }
                    ].map((faq, i) => (
                        <div key={i} style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>{faq.q}</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>{faq.a}</p>
                        </div>
                    ))}
                </DocSection>

                <footer style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginTop: '4rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        © 2026 FileNest Documentation. Still need help? <a href="mailto:support@filenest.com" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>Contact Support</a>
                    </p>
                </footer>
            </div>

            {/* Sidebar TOC - Visible on larger screens */}
            <div style={{
                width: '200px',
                position: 'sticky',
                top: '2rem',
                height: 'fit-content',
                display: 'none',
                '@media (min-width: 1200px)': { display: 'block' }
            }}>
                <h5 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>On This Page</h5>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {sections.map(s => (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                            <span style={{ opacity: 0.5 }}>{s.icon}</span> {s.title}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Docs;
