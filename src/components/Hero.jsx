import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <section style={{
            paddingTop: '100px',
            paddingBottom: '80px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Glows */}
            <div style={{
                position: 'absolute', top: '10%', left: '-10%',
                width: '500px', height: '500px',
                background: 'radial-gradient(circle, rgba(255,122,0,0.15) 0%, rgba(255,255,255,0) 70%)',
                filter: 'blur(60px)', zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <span className="badge">
                            <Shield size={14} /> MINI END-TO-END ENCRYPTION
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        Your files,<br />
                        <span className="text-gradient-purple">secured</span> in the<br />
                        cloud.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        style={{ fontSize: '1.1rem', maxWidth: '480px', lineHeight: 1.6 }}
                    >
                        Experience lightning-fast uploads and smart sharing with FileNest. Secure, reliable, and accessible from anywhere in the world.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}
                    >
                        {user ? (
                            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                                <button className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                                    Go to Dashboard <ArrowRight size={18} />
                                </button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup" style={{ textDecoration: 'none' }}>
                                    <button className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                                        Start Storing Free <ArrowRight size={18} />
                                    </button>
                                </Link>
                                <Link to="/admin-login" style={{ textDecoration: 'none' }}>
                                    <button className="btn btn-outline" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', background: 'rgba(0,0,0,0.02)', borderColor: 'rgba(0,0,0,0.1)' }}>
                                        Admin Portal
                                    </button>
                                </Link>
                            </>
                        )}
                    </motion.div>
                </motion.div>

                {/* Right Graphic/Illustration */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    style={{ position: 'relative', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    {/* Card Glass Container */}
                    <div className="glass-card" style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        borderRadius: '32px'
                    }}>
                        {/* Inner Grid Graphic */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                        }} />

                        <div className="flex-center" style={{ width: '100%', height: '100%', position: 'relative' }}>
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                style={{
                                    width: '140px', height: '140px',
                                    background: 'rgba(123,51,255,0.05)',
                                    border: '1px solid rgba(123,51,255,0.2)',
                                    borderRadius: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    boxShadow: '0 0 30px rgba(123,51,255,0.1)'
                                }}
                            >
                                <Lock size={40} color="var(--accent-secondary)" />
                                <div style={{ height: '4px', width: '60px', background: 'rgba(123,51,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <motion.div
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                                        style={{ width: '50%', height: '100%', background: 'var(--accent-secondary)' }}
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* Decorative Nodes Container */}
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                            <motion.circle cx="20" cy="30" r="1.5" fill="#FF7A00" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} />
                            <motion.circle cx="80" cy="20" r="2" fill="#7b33ff" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }} />
                            <motion.circle cx="70" cy="80" r="1.5" fill="#7b33ff" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} />
                            <motion.circle cx="30" cy="75" r="2.5" fill="#FF7A00" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 3, delay: 1.5 }} />
                            <path d="M 20 30 L 30 75 L 70 80 L 80 20 Z" vectorEffect="non-scaling-stroke" stroke="rgba(123,51,255,0.1)" fill="none" />
                        </svg>
                    </div>
                </motion.div>
            </div>

            {/* Bottom fade for transition to next section */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px',
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.05))',
                zIndex: 2,
                pointerEvents: 'none'
            }} />
        </section>
    );
};

export default Hero;
