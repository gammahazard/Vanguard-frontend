"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Stack,
    InputAdornment,
    IconButton,
    ThemeProvider,
    CssBaseline,
    Alert,
    Snackbar
} from "@mui/material";
import { Visibility, VisibilityOff, Security, Lock, ArrowBack, Face } from "@mui/icons-material";
import { theme } from "@/lib/theme";
import { startAuthentication } from '@simplewebauthn/browser';

export default function StaffLogin() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [faceIdAvailable, setFaceIdAvailable] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Initial check for capabilities
    useEffect(() => {
        const enabled = typeof window !== 'undefined' ? localStorage.getItem('vanguard_faceid_enabled') : null;
        const lastEmail = typeof window !== 'undefined' ? localStorage.getItem('vanguard_email') : null;
        if (enabled === 'true') setFaceIdAvailable(true);
        if (lastEmail) setEmail(lastEmail);
    }, []);

    // Check if user has Face ID
    const checkEmail = async (currentEmail: string) => {
        if (currentEmail.includes('@') && currentEmail.includes('.')) {
            try {
                const res = await fetch(`${API_BASE_URL}/api/auth/check?email=${encodeURIComponent(currentEmail)}`);
                const data = await res.json();
                if (data.faceid_registered) {
                    setFaceIdAvailable(true);
                    localStorage.setItem('vanguard_faceid_enabled', 'true');
                } else {
                    const stored = localStorage.getItem('vanguard_faceid_enabled');
                    if (stored !== 'true') setFaceIdAvailable(false);
                }
            } catch (err) {
                console.error("Face ID check failed:", err);
            }
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();

                // Security Check: Only allow Staff/Owner roles here? 
                // Actually, the backend handles role capability, but for UX we verify.
                if (data.role === 'client') {
                    setError("Access Denied: Please use the Client Login portal.");
                    return;
                }

                localStorage.setItem('vanguard_token', data.token);
                localStorage.setItem('vanguard_role', data.role);
                localStorage.setItem('vanguard_user', data.name);
                localStorage.setItem('vanguard_email', email);
                localStorage.setItem('vanguard_faceid_enabled', data.faceid_enabled ? 'true' : 'false');

                router.push('/staff/dashboard');
            } else {
                const errorText = await res.text();
                setError(errorText || "Invalid credentials");
            }
        } catch (err) {
            setError("Connection failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleFaceIdLogin = async () => {
        if (!email) {
            setError("Enter your email ID first.");
            return;
        }

        try {
            const resStart = await fetch(`${API_BASE_URL}/api/auth/webauthn/login/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!resStart.ok) throw new Error("Face ID not found.");
            const options = await resStart.json();

            // CRITICAL CHECK for Wipe Recovery
            if (!options.publicKey.allowCredentials || options.publicKey.allowCredentials.length === 0) {
                throw new Error("Credential expired: Please login with your password and re enable face-id login");
            }

            const cleanOptions = { ...options.publicKey };
            if ((cleanOptions as any).challenge_id) delete (cleanOptions as any).challenge_id;

            const attResp = await startAuthentication(cleanOptions);

            const resFinish = await fetch(`${API_BASE_URL}/api/auth/webauthn/login/finish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ challenge_id: options.challenge_id, response: attResp })
            });

            if (resFinish.ok) {
                const data = await resFinish.json();
                if (data.role === 'client') {
                    setError("Access Denied: Please use the Client Login portal.");
                    return;
                }
                localStorage.setItem('vanguard_token', data.token);
                localStorage.setItem('vanguard_user', data.name);
                localStorage.setItem('vanguard_role', data.role);
                localStorage.setItem('vanguard_email', email);
                localStorage.setItem('vanguard_faceid_enabled', 'true');
                router.push('/staff/dashboard');
            } else {
                throw new Error("Verification failed.");
            }
        } catch (err: any) {
            setError(err.message || "Face ID login failed");
            setSnackbarOpen(true);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100dvh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    position: 'relative',
                    overflow: 'hidden',
                    p: 3
                }}
            >
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity="error" variant="filled">{error}</Alert>
                </Snackbar>

                {/* Background Tech Glow */}
                <Box sx={{
                    position: 'absolute',
                    bottom: '-30%',
                    left: '-20%',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    bgcolor: 'rgba(59, 130, 246, 0.05)', // Blue tint for Staff
                    filter: 'blur(100px)',
                    zIndex: 0
                }} />

                {/* Back Navigation */}
                <Link href="/" passHref style={{ textDecoration: 'none' }}>
                    <IconButton sx={{ position: 'absolute', top: 20, left: 20, color: 'rgba(255,255,255,0.5)', zIndex: 10 }}>
                        <ArrowBack />
                    </IconButton>
                </Link>

                <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack spacing={4} alignItems="center">

                        {/* FACE ID BUTTON - Very Top if available! */}
                        {faceIdAvailable && (
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={<Face />}
                                onClick={handleFaceIdLogin}
                                sx={{
                                    py: 2,
                                    bgcolor: '#3b82f6', // Blue for staff
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    borderRadius: 3,
                                    mb: 1,
                                    '&:hover': { bgcolor: '#2563eb' }
                                }}
                            >
                                Secure Staff Login
                            </Button>
                        )}

                        {/* Security Icon */}
                        <Box sx={{
                            width: 64, height: 64, borderRadius: '50%',
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1
                        }}>
                            <Security sx={{ fontSize: 32, color: 'text.secondary' }} />
                        </Box>

                        <Box textAlign="center">
                            <Typography variant="overline" color="primary" sx={{ letterSpacing: '0.2em', fontWeight: 'bold' }}>
                                LakeShore Staff
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                                Operations Portal
                            </Typography>
                        </Box>

                        <Stack spacing={3} width="100%">
                            {faceIdAvailable && <Alert severity="info" sx={{ bgcolor: 'transparent', color: 'text.secondary' }}>Or use ID & Password</Alert>}

                            <TextField
                                fullWidth
                                placeholder="Email ID"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => checkEmail(email)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Typography color="text.secondary">@</Typography>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                placeholder="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!error}
                                helperText={error}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ fontSize: 20, color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleLogin}
                                disabled={loading}
                                sx={{
                                    py: 2,
                                    background: '#333',
                                    '&:hover': { background: '#444' }
                                }}
                            >
                                {loading ? "Authenticating..." : "Authorize Access"}
                            </Button>
                        </Stack>

                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <Typography variant="caption" color="text.secondary">
                                Return to Gateway
                            </Typography>
                        </Link>
                    </Stack>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
