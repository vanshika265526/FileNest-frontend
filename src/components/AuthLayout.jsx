import { Link } from 'react-router-dom';
import { Target, File, Cloud, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
            {/* Left Animated Section */}
            <div style={{
                flex: 1,
                display: 'none',
                position: 'relative',
                background: 'var(--bg-card)',
                borderRight: '1px solid rgba(0,0,0,0.05)',
                overflow: 'hidden'
            }} className="auth-image-panel">

                {/* Animated Gradient Background */}
                <motion.div
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                    }}
                    transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                    style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: 'radial-gradient(circle at top left, rgba(255,122,0,0.1) 0%, transparent 40%), radial-gradient(circle at bottom right, rgba(123,51,255,0.15) 0%, transparent 50%)',
                        backgroundSize: '200% 200%'
                    }} />

                {/* Animated Grid */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'linear-gradient(rgba(123,51,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(123,51,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0))',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0))'
                }} />

                {/* Unified Content Overlay */}
                <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4rem', padding: '2.5rem' }}>



                    {/* Floating Elements Container */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'nowrap' }}>
                        <motion.div
                            animate={{ y: [-15, 15, -15], rotate: [0, 3, -3, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                            style={{ background: 'white', padding: '0.6rem 0.8rem', borderRadius: '12px', boxShadow: '0 20px 40px rgba(123,51,255,0.1)', border: '1px solid rgba(123,51,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 'fit-content' }}
                        >
                            <div style={{ background: 'rgba(255,122,0,0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--accent-primary)' }}>
                                <Cloud size={18} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Uploading...</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Design_Assets.zip</div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [15, -15, 15], rotate: [0, -3, 3, 0] }}
                            transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
                            style={{ background: 'white', padding: '0.6rem 0.8rem', borderRadius: '12px', boxShadow: '0 20px 40px rgba(255,122,0,0.1)', border: '1px solid rgba(255,122,0,0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 'fit-content' }}
                        >
                            <div style={{ background: 'rgba(123,51,255,0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--accent-secondary)' }}>
                                <Shield size={18} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Encrypted</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>End-to-End Secure</div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 2 }}
                            style={{ background: 'white', padding: '0.6rem 0.8rem', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 'fit-content' }}
                        >
                            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '0.5rem', borderRadius: '8px', color: 'var(--text-primary)' }}>
                                <File size={18} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Synced</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Just now</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Text block */}
                    <div style={{ color: 'var(--text-primary)' }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>Built for the next<br /><span className="text-gradient-purple">Generation.</span></h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.6 }}>Streamline your file workflows with high-performance team management and intelligently structured storage.</p>
                    </div>
                </div>

                {/* Back Link (Arrow Only) on Image */}
                <div style={{ position: 'absolute', top: '2.5rem', right: '2.5rem', zIndex: 20 }}>
                    <Link to="/" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                        color: 'var(--text-primary)', textDecoration: 'none', transition: 'background 0.2s',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                        <ArrowLeft size={20} />
                    </Link>
                </div>
            </div>

            {/* Right Form Section */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-dark)',
                padding: '2rem',
                position: 'relative',
                zIndex: 20,
                boxShadow: '-20px 0 40px rgba(0,0,0,0.02)'
            }}>
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    {children}
                </div>
            </div>

            <style>{`
                @media (min-width: 900px) {
                    .auth-image-panel { display: block !important; }
                }
            `}</style>
        </div>
    );
};

export default AuthLayout;
