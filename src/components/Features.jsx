import { motion } from 'framer-motion';
import { Zap, FolderKey, ShieldAlert } from 'lucide-react';

const Features = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
    };

    return (
        <section id="features" style={{ padding: '100px 0', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
                    style={{ margin: '0 auto 4rem auto', maxWidth: '600px', textAlign: 'center' }}
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >Engineered for efficiency</motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        style={{ marginTop: '1.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}
                    >
                        We've stripped away the bloat of traditional cloud storage to give you a tool that's as fast as your local drive.
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
                >
                    {/* Feature 1 */}
                    <motion.div variants={item} className="card" whileHover={{ y: -8, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                        <div style={{
                            width: '56px', height: '56px',
                            borderRadius: '16px',
                            background: 'rgba(255,122,0,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '1.5rem',
                            color: 'var(--accent-primary)',
                            border: '1px solid rgba(255,122,0,0.2)'
                        }}>
                            <Zap size={28} />
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Fast Uploads</h3>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                            Multi-threaded uploading architecture ensures your files reach the cloud in record time, regardless of size.
                        </p>
                    </motion.div>

                    {/* Feature 2 */}
                    <motion.div variants={item} className="card" whileHover={{ y: -8, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                        <div style={{
                            width: '56px', height: '56px',
                            borderRadius: '16px',
                            background: 'rgba(123,51,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '1.5rem',
                            color: 'var(--accent-secondary)',
                            border: '1px solid rgba(123,51,255,0.2)'
                        }}>
                            <FolderKey size={28} />
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Smart Sharing</h3>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                            Granular permissions, expiring links, and password-protected folders give you total control over who sees what.
                        </p>
                    </motion.div>

                    {/* Feature 3 */}
                    <motion.div variants={item} className="card" whileHover={{ y: -8, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                        <div style={{
                            width: '56px', height: '56px',
                            borderRadius: '16px',
                            background: 'rgba(255,122,0,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '1.5rem',
                            color: 'var(--accent-primary)',
                            border: '1px solid rgba(255,122,0,0.2)'
                        }}>
                            <ShieldAlert size={28} />
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Zero Knowledge</h3>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                            With client-side encryption, only you hold the keys to your data. Not even we can see what you store.
                        </p>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
};

export default Features;
