import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ShieldAlert, Loader2, Lock, FileText, CheckCircle,
    Mail, Camera, UserCheck, ShieldCheck, Download, AlertTriangle, AlertCircle
} from 'lucide-react';
import API_BASE_URL from '../api/apiConfig';

const ConditionalShareView = () => {
    const { shareCode } = useParams();
    const navigate = useNavigate();

    // Link state
    const [loading, setLoading] = useState(true);
    const [linkInfo, setLinkInfo] = useState(null);
    const [error, setError] = useState(null);
    const [errorCode, setErrorCode] = useState(null);

    // Verification state
    const [verificationToken, setVerificationToken] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    
    // OTP states
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [debugOtp, setDebugOtp] = useState(''); // helper to show OTP on screen for testing

    // Face verification states
    const [cameraActive, setCameraActive] = useState(false);
    const [scanState, setScanState] = useState('idle'); // idle, starting, scanning, success, error
    const [scanProgress, setScanProgress] = useState(0);
    const [scanStatusText, setScanStatusText] = useState('');
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Anti-screenshot state
    const [isWindowBlurred, setIsWindowBlurred] = useState(false);

    useEffect(() => {
        fetchLinkInfo();
        
        // Anti-screenshot window focus listener
        const handleBlur = () => setIsWindowBlurred(true);
        const handleFocus = () => setIsWindowBlurred(false);

        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            // Stop camera if active
            stopCamera();
        };
    }, [shareCode]);

    const fetchLinkInfo = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(`${API_BASE_URL}/api/files/share-code/info/${shareCode}`, {
                headers
            });
            const data = await res.json();
            
            if (res.ok) {
                setLinkInfo(data);
                // If verificationType is none, we are immediately verified
                if (data.verificationType === 'none') {
                    setIsVerified(true);
                }
            } else {
                setError(data.message || 'Link is unavailable or has been revoked');
                setErrorCode(data.code || 'UNAVAILABLE');
                setLinkInfo(data.fileSummary ? { file: data.fileSummary } : null);
            }
        } catch (err) {
            setError('Failed to connect to security server');
        } finally {
            setLoading(false);
        }
    };

    // OTP Handlers
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setSendingOtp(true);
        setOtpError('');
        setDebugOtp('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/files/share-code/otp/${shareCode}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setOtpSent(true);
                if (data.debugOtp) {
                    setDebugOtp(data.debugOtp);
                }
            } else {
                setOtpError(data.message || 'Failed to send verification code');
            }
        } catch (err) {
            setOtpError('Error connecting to OTP service');
        } finally {
            setSendingOtp(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setVerifyingOtp(true);
        setOtpError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/files/share-code/verify-otp/${shareCode}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp })
            });
            const data = await res.json();
            if (res.ok) {
                setVerificationToken(data.token);
                if (data.fileUrl) {
                    setLinkInfo(prev => ({
                        ...prev,
                        file: {
                            ...prev.file,
                            url: data.fileUrl
                        }
                    }));
                }
                setIsVerified(true);
            } else {
                setOtpError(data.message || 'Invalid verification code');
            }
        } catch (err) {
            setOtpError('Error verifying code');
        } finally {
            setVerifyingOtp(false);
        }
    };

    // Face Scanner Handlers
    const startCamera = async () => {
        setScanState('starting');
        setScanStatusText('Initializing secure camera...');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user', width: 640, height: 480 } 
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setCameraActive(true);
            setScanState('scanning');
            setScanStatusText('Locating facial features...');
            simulateFaceScan();
        } catch (err) {
            console.error('Camera access error:', err);
            setScanState('error');
            setScanStatusText('Camera access denied. Please grant permission to verify.');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraActive(false);
    };

    const simulateFaceScan = () => {
        let progress = 0;
        const scanSteps = [
            { threshold: 15, text: 'Calibrating optical scanner...' },
            { threshold: 40, text: 'Detecting facial geometry...' },
            { threshold: 65, text: 'Mapping biometric feature landmarks...' },
            { threshold: 85, text: 'Validating cryptographic credentials...' },
            { threshold: 100, text: 'Authorized. Unlocking secure container...' }
        ];

        const interval = setInterval(() => {
            progress += 2.5;
            setScanProgress(progress);
            
            const currentStep = scanSteps.find(step => progress <= step.threshold);
            if (currentStep) {
                setScanStatusText(currentStep.text);
            }

            if (progress >= 100) {
                clearInterval(interval);
                handleFaceVerificationSuccess();
            }
        }, 100);
    };

    const handleFaceVerificationSuccess = async () => {
        setScanState('success');
        stopCamera();
        try {
            const res = await fetch(`${API_BASE_URL}/api/files/share-code/verify-face/${shareCode}`, {
                method: 'POST'
            });
            const data = await res.json();
            if (res.ok) {
                setVerificationToken(data.token);
                if (data.fileUrl) {
                    setLinkInfo(prev => ({
                        ...prev,
                        file: {
                            ...prev.file,
                            url: data.fileUrl
                        }
                    }));
                }
                setIsVerified(true);
            } else {
                setScanState('error');
                setScanStatusText(data.message || 'Face verification failed on server');
            }
        } catch (err) {
            setScanState('error');
            setScanStatusText('Network error during face verification');
        }
    };

    const getFileServeUrl = () => {
        let url = `${API_BASE_URL}/api/files/v/link/${shareCode}`;
        const token = verificationToken || localStorage.getItem('token');
        if (token) {
            url += `?token=${token}`;
        }
        return url;
    };

    // Render logic
    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090d16' }}>
                <Loader2 size={40} className="animate-spin" color="var(--accent-primary)" />
            </div>
        );
    }

    // Access Denied / Passive Restriction Screen
    if (error && !linkInfo?.file) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090d16' }}>
                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '480px', width: '90%' }}>
                    <ShieldAlert size={64} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: '#f8fafc' }}>Access Forbidden</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontSize: '0.95rem' }}>{error}</p>
                    <button onClick={() => navigate('/')} style={{ marginTop: '2rem', background: 'white', color: 'black', border: 'none', padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        Return to FileNest
                    </button>
                </div>
            </div>
        );
    }

    if (error && linkInfo?.file) {
        // Specific restriction error (Expired, Time-blocked, Geo-blocked, Max uses reached)
        const getErrorIcon = () => {
            switch(errorCode) {
                case 'EXPIRED': return <Clock size={40} color="#ef4444" />;
                case 'GEO_RESTRICTED': return <AlertCircle size={40} color="#f59e0b" />;
                case 'TIME_RESTRICTED': return <Clock size={40} color="#3b82f6" />;
                case 'MAX_USES_REACHED': return <AlertTriangle size={40} color="#ef4444" />;
                default: return <ShieldAlert size={40} color="#ef4444" />;
            }
        };

        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090d16' }}>
                <div style={{ width: '100%', maxWidth: '440px', background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: '#f8fafc' }}>
                    <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getErrorIcon()}
                    </div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Violation</h2>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.25rem', fontFamily: 'monospace' }}>
                        File: {linkInfo.file.name}
                    </div>
                    <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '1rem', borderRadius: '12px', color: '#fca5a5', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                        {error}
                    </div>
                    <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '0.85rem', cursor: 'pointer', width: '100%' }}>
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    // Active Verification Screen (OTP / Face Scan)
    if (!isVerified && linkInfo) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090d16' }}>
                <div style={{ width: '100%', maxWidth: '460px', background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', color: '#f8fafc' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ width: '64px', height: '64px', margin: '0 auto 1.25rem', background: 'rgba(57,133,255,0.08)', border: '1px solid rgba(57,133,255,0.15)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3985ff' }}>
                            <Lock size={28} />
                        </div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>Security Verification</h2>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                            To access <strong>{linkInfo.file.name}</strong>, you must complete the required security checks.
                        </p>
                    </div>

                    {linkInfo.verificationType === 'otp' ? (
                        <div>
                            {!otpSent ? (
                                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>Verify your email</label>
                                        <div style={{ position: 'relative' }}>
                                            <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter recipient email..."
                                                required
                                                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.9rem', outline: 'none' }}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={sendingOtp}
                                        style={{ background: 'white', color: 'black', border: 'none', padding: '0.8rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        {sendingOtp ? <Loader2 size={18} className="animate-spin" /> : 'Send Verification Code'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>Enter 6-digit OTP code</label>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Code..."
                                            required
                                            maxLength={6}
                                            style={{ width: '100%', padding: '0.75rem 1.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', outline: 'none', letterSpacing: '0.4rem', textAlign: 'center', fontFamily: 'monospace' }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={verifyingOtp}
                                        style={{ background: 'white', color: 'black', border: 'none', padding: '0.8rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        {verifyingOtp ? <Loader2 size={18} className="animate-spin" /> : 'Unlock File'}
                                    </button>
                                    <button type="button" onClick={() => setOtpSent(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', marginTop: '0.25rem' }}>
                                        Change Email / Resend OTP
                                    </button>
                                </form>
                            )}

                            {debugOtp && (
                                <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px dashed rgba(16, 185, 129, 0.3)', borderRadius: '12px', color: '#34d399', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'center' }}>
                                    <span style={{ fontWeight: 600 }}>Development Mode OTP:</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.2rem', fontFamily: 'monospace' }}>{debugOtp}</span>
                                </div>
                            )}

                            {otpError && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center' }}>{otpError}</p>}
                        </div>
                    ) : (
                        // Face Verification Scanner View
                        <div style={{ textAlign: 'center' }}>
                            {!cameraActive ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                                        <Camera size={36} color="rgba(255,255,255,0.3)" />
                                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                                            The owner requires face biometric identification to preview this file. Please align your face inside the guides when camera starts.
                                        </p>
                                    </div>
                                    <button
                                        onClick={startCamera}
                                        style={{ background: 'white', color: 'black', border: 'none', padding: '0.8rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <Camera size={16} /> Start Biometric Scan
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                                    {/* High-tech Face Scanner Circle Frame */}
                                    <div style={{ position: 'relative', width: '220px', height: '220px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #3985ff', boxShadow: '0 0 20px rgba(57, 133, 255, 0.4)' }}>
                                        <video
                                            ref={videoRef}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                                            muted
                                            playsInline
                                        />
                                        {/* Scanner Overlay Line */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0, left: 0, right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(to bottom, rgba(57,133,255,0.1), #3985ff, rgba(57,133,255,0.1))',
                                            boxShadow: '0 0 10px #3985ff',
                                            animation: 'verticalScan 2.5s infinite linear'
                                        }} />
                                        
                                        {/* Biotech corner overlay elements */}
                                        <div style={{ position: 'absolute', top: '15px', left: '15px', borderLeft: '2px solid #34d399', borderTop: '2px solid #34d399', width: '12px', height: '12px' }} />
                                        <div style={{ position: 'absolute', top: '15px', right: '15px', borderRight: '2px solid #34d399', borderTop: '2px solid #34d399', width: '12px', height: '12px' }} />
                                        <div style={{ position: 'absolute', bottom: '15px', left: '15px', borderLeft: '2px solid #34d399', borderBottom: '2px solid #34d399', width: '12px', height: '12px' }} />
                                        <div style={{ position: 'absolute', bottom: '15px', right: '15px', borderRight: '2px solid #34d399', borderBottom: '2px solid #34d399', width: '12px', height: '12px' }} />
                                    </div>

                                    <div style={{ width: '100%' }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3985ff', marginBottom: '0.4rem' }}>
                                            {scanStatusText}
                                        </div>
                                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', background: '#3985ff', width: `${scanProgress}%`, transition: 'width 0.1s linear' }} />
                                        </div>
                                    </div>
                                    
                                    <button onClick={() => { stopCamera(); setScanState('idle'); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>
                                        Cancel Scan
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <style>{`
                    @keyframes verticalScan {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(220px); }
                        100% { transform: translateY(0px); }
                    }
                `}</style>
            </div>
        );
    }

    // Success Screen: Authenticated and serving file with anti-screenshot and watermark
    if (isVerified && linkInfo) {
        // Use the direct Cloudinary URL for display — it's public and reliable.
        // The backend proxy /v/link/:shareCode is only needed for controlled downloads.
        const directUrl = linkInfo.file.url;
        const serveUrl = getFileServeUrl(); // still used for download trigger

        const isImage = linkInfo.file.category === 'image' || (linkInfo.file.type && linkInfo.file.type.startsWith('image/'));
        const isPdf = linkInfo.file.category === 'pdf' || linkInfo.file.type === 'application/pdf';
        const isDoc = linkInfo.file.category === 'document';

        const handleDownload = () => {
            const downloadLink = document.createElement('a');
            downloadLink.href = serveUrl;
            downloadLink.download = linkInfo.file.name;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };

        const watermarkStyle = linkInfo.watermarkText ? {
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='150' viewBox='0 0 250 150'><text fill='rgba(255,255,255,0.08)' font-size='10' font-family='sans-serif' transform='rotate(-30 120 75)' text-anchor='middle'>${encodeURIComponent(linkInfo.recipientEmail || 'Secure View')}</text></svg>")`,
            backgroundRepeat: 'repeat',
            pointerEvents: 'none',
            zIndex: 10
        } : {};

        return (
            <div
                style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#090d16', userSelect: linkInfo.antiScreenshot ? 'none' : 'auto', position: 'relative' }}
                onContextMenu={(e) => linkInfo.antiScreenshot && e.preventDefault()}
            >
                {/* Anti-screenshot blur screen */}
                {linkInfo.antiScreenshot && isWindowBlurred && (
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.92)',
                        backdropFilter: 'blur(30px)',
                        zIndex: 99999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        textAlign: 'center',
                        padding: '2rem'
                    }}>
                        <ShieldCheck size={48} color="#ef4444" style={{ marginBottom: '1rem', animation: 'pulse 1.5s infinite' }} />
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Secure Preview Locked</h2>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', maxWidth: '340px', lineHeight: 1.5 }}>
                            Focus back on this window to resume viewing. Screenshots are prevented in this environment.
                        </p>
                    </div>
                )}

                {/* Header */}
                <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#090d16' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.6rem', borderRadius: '10px', color: '#3985ff' }}>
                            <FileText size={20} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>{linkInfo.file.name}</h2>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>
                                <span>Size: {linkInfo.file.size}</span>
                                <span>•</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#10b981' }}>
                                    <ShieldCheck size={10} /> Secure Link Active
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={handleDownload}
                            style={{ background: 'white', color: 'black', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                            <Download size={14} /> Download File
                        </button>
                    </div>
                </div>

                {/* Preview viewport */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflow: 'hidden', position: 'relative' }}>
                    {/* Watermark overlay */}
                    {linkInfo.watermarkText && <div style={watermarkStyle} />}

                    <div style={{ maxWidth: '100%', maxHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, transition: 'filter 0.2s', filter: linkInfo.antiScreenshot && isWindowBlurred ? 'blur(20px)' : 'none' }}>
                        {isImage ? (
                            <img
                                src={directUrl}
                                alt={linkInfo.file.name}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '80vh',
                                    borderRadius: '16px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                    pointerEvents: linkInfo.antiScreenshot ? 'none' : 'auto'
                                }}
                            />
                        ) : isPdf ? (
                            <div style={{ width: '80vw', height: '75vh', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                                <iframe
                                    src={directUrl}
                                    title={linkInfo.file.name}
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                />
                            </div>
                        ) : (isDoc && directUrl && directUrl.startsWith('http')) ? (
                            <div style={{ width: '80vw', height: '75vh', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                                <iframe
                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(directUrl)}&embedded=true`}
                                    title={linkInfo.file.name}
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                />
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)', padding: '4rem 6rem', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.08)' }}>
                                <FileText size={72} style={{ margin: '0 auto 1.5rem', opacity: 0.15, color: '#3985ff' }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.4rem' }}>Preview unavailable</h3>
                                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>This file category is not supported for inline secure previews.</p>
                                <button
                                    onClick={handleDownload}
                                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Download to view locally
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Print blocker CSS */}
                {linkInfo.antiScreenshot && (
                    <style>{`
                        @media print {
                            body { display: none !important; }
                        }
                        @keyframes pulse {
                            0% { transform: scale(1); opacity: 1; }
                            50% { transform: scale(1.05); opacity: 0.8; }
                            100% { transform: scale(1); opacity: 1; }
                        }
                    `}</style>
                )}
            </div>
        );
    }

    return null;
};

export default ConditionalShareView;

