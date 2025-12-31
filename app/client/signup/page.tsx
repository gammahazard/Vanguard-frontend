"use client";

import { useState } from "react";
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
    IconButton,
    InputAdornment,
    ThemeProvider,
    CssBaseline,
    Paper,
    Grid,
    Divider,
    Tooltip,
    LinearProgress
} from "@mui/material";
import {
    ArrowForward,
    ArrowBack,
    CheckCircle,
    Person,
    Phone,
    Email,
    Lock,
    Visibility,
    VisibilityOff,
    Info,
    Cancel
} from "@mui/icons-material";
import { theme } from "@/lib/theme";

export default function ClientSignup() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Password requirement checks
    const hasMinLength = password.length >= 5;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const allRequirementsMet = hasMinLength && hasUppercase && hasSpecialChar;
    const passwordStrength = [hasMinLength, hasUppercase, hasSpecialChar].filter(Boolean).length;

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                // Auto-login
                localStorage.setItem('vanguard_token', data.token);
                localStorage.setItem('vanguard_role', data.role);
                localStorage.setItem('vanguard_user', data.name);
                localStorage.setItem('vanguard_email', email); // Save for login pre-fill
                router.push('/client/dashboard');
            } else {
                const errorText = await res.text();
                setError(errorText || "Registration failed.");
            }
        } catch (err) {
            setError("Connection failed.");
        } finally {
            setLoading(false);
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
                {/* Background Ambient Glow */}
                <Box sx={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    bgcolor: 'rgba(212, 175, 55, 0.03)',
                    filter: 'blur(100px)',
                    zIndex: 0
                }} />

                <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>

                    {/* Back Navigation */}
                    <Link href="/client/login" passHref style={{ textDecoration: 'none' }}>
                        <IconButton sx={{ position: 'absolute', top: -60, left: 0, color: 'text.secondary' }}>
                            <ArrowBack />
                        </IconButton>
                    </Link>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            bgcolor: 'rgba(21, 22, 26, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: 4
                        }}
                    >
                        <Stack spacing={4}>

                            {/* Header */}
                            <Box textAlign="center">
                                <Typography variant="overline" color="primary" fontWeight="bold" letterSpacing={2}>
                                    Create Account
                                </Typography>
                                <Typography variant="h4" color="white" fontWeight={300} sx={{ mt: 1 }}>
                                    Join Vanguard
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 300, mx: 'auto' }}>
                                    Create your secure portal account to manage bookings and live feeds.
                                </Typography>

                                {error && !error.includes("Passwords") && !error.includes("match") && (
                                    <Box sx={{
                                        mt: 2,
                                        p: 1.5,
                                        bgcolor: 'rgba(211, 47, 47, 0.1)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(211, 47, 47, 0.2)'
                                    }}>
                                        <Typography variant="caption" color="error" sx={{ textAlign: 'center', display: 'block' }}>
                                            {error}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* Form */}
                            <Stack spacing={3}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Box sx={{ width: '100%' }}>
                                        <TextField
                                            fullWidth
                                            placeholder="Full Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            InputProps={{ startAdornment: <Person sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }}
                                        />
                                    </Box>
                                    <Box sx={{ width: '100%' }}>
                                        <TextField
                                            fullWidth
                                            placeholder="Phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            InputProps={{ startAdornment: <Phone sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }}
                                        />
                                    </Box>
                                </Stack>

                                <TextField
                                    fullWidth
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    InputProps={{ startAdornment: <Email sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }}
                                />

                                <TextField
                                    fullWidth
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={!!error && error.includes("Password") && !error.includes("match")}
                                    InputProps={{
                                        startAdornment: <Lock sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                {/* Password Requirements */}
                                {password.length > 0 && (
                                    <Box sx={{ mt: -1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(passwordStrength / 3) * 100}
                                            sx={{
                                                height: 4,
                                                borderRadius: 2,
                                                bgcolor: 'rgba(255,255,255,0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: passwordStrength === 3 ? '#4ade80' : passwordStrength === 2 ? '#facc15' : '#ef4444'
                                                }
                                            }}
                                        />
                                        <Stack direction="row" spacing={2} sx={{ mt: 1 }} flexWrap="wrap">
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                {hasMinLength ? <CheckCircle sx={{ fontSize: 14, color: '#4ade80' }} /> : <Cancel sx={{ fontSize: 14, color: '#ef4444' }} />}
                                                <Typography variant="caption" sx={{ color: hasMinLength ? '#4ade80' : 'text.secondary' }}>5+ chars</Typography>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                {hasUppercase ? <CheckCircle sx={{ fontSize: 14, color: '#4ade80' }} /> : <Cancel sx={{ fontSize: 14, color: '#ef4444' }} />}
                                                <Typography variant="caption" sx={{ color: hasUppercase ? '#4ade80' : 'text.secondary' }}>Uppercase</Typography>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                {hasSpecialChar ? <CheckCircle sx={{ fontSize: 14, color: '#4ade80' }} /> : <Cancel sx={{ fontSize: 14, color: '#ef4444' }} />}
                                                <Typography variant="caption" sx={{ color: hasSpecialChar ? '#4ade80' : 'text.secondary' }}>Special char</Typography>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                )}

                                <TextField
                                    fullWidth
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    error={(confirmPassword !== "" && password !== confirmPassword) || (!!error && (error.includes("Passwords") || error.includes("match")))}
                                    helperText={confirmPassword !== "" && password !== confirmPassword ? "Passwords do not match" : (error.includes("Passwords") || error.includes("match") ? error : "")}
                                    InputProps={{
                                        startAdornment: <Lock sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                <Box sx={{ p: 2, bgcolor: 'rgba(212, 175, 55, 0.05)', borderRadius: 2, display: 'flex', gap: 2 }}>
                                    <CheckCircle sx={{ color: 'primary.main', fontSize: 20 }} />
                                    <Typography variant="caption" color="text.secondary">
                                        By requesting access, you agree to our specialized care protocols. After signup, you can enable Face ID for instant logins.
                                    </Typography>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handleRegister}
                                    disabled={loading || !name || !email || !password || password !== confirmPassword || !allRequirementsMet}
                                    endIcon={<ArrowForward />}
                                >
                                    {loading ? "Processing..." : "Submit Application"}
                                </Button>
                            </Stack>

                            <Divider sx={{ opacity: 0.1 }} />

                            <Stack direction="row" justifyContent="center" spacing={1}>
                                <Typography variant="caption" color="text.secondary">Already a member?</Typography>
                                <Link href="/client/login" style={{ textDecoration: 'none' }}>
                                    <Typography variant="caption" color="primary" fontWeight="bold">Sign In</Typography>
                                </Link>
                            </Stack>

                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
