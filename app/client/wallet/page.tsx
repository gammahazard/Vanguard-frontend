"use client";

import { useState, useEffect } from "react";
import {
    Box, Typography, Container, Stack, Paper, IconButton,
    Button, Chip, BottomNavigation, BottomNavigationAction,
    ThemeProvider, CssBaseline, Divider, CircularProgress, Avatar
} from "@mui/material";
import {
    Home, Pets, CalendarMonth, Person, ArrowBack,
    Wallet, CreditCard, Apple, CurrencyBitcoin, Info
} from "@mui/icons-material";
import { theme } from "@/lib/theme";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

export default function WalletView() {
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [confirmedBookings, setConfirmedBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [navValue, setNavValue] = useState(0); // For consistency, though this is a detail page

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        const email = localStorage.getItem('vanguard_email');
        if (!email) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/user/bookings?email=${encodeURIComponent(email)}`);
            if (res.ok) {
                const bookings = await res.json();
                const confirmed = bookings.filter((b: any) => b.status === "Confirmed");
                const total = confirmed.reduce((sum: number, b: any) => sum + b.total_price, 0);

                setConfirmedBookings(confirmed);
                setBalance(total);
            }
        } catch (err) {
            console.error("Wallet fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleNavChange = (v: number) => {
        if (v === 0) router.push('/client/dashboard');
        if (v === 1) router.push('/client/pets');
        if (v === 2) router.push('/client/bookings');
        if (v === 3) router.push('/client/profile');
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>

                {/* --- HEADER --- */}
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(5, 6, 8, 0.9)', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(10px)' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton onClick={() => router.back()} sx={{ color: 'white' }}>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h6" fontWeight="bold">Wallet & Billing</Typography>
                    </Stack>
                </Paper>

                <Container maxWidth="sm" sx={{ pt: 4 }}>
                    <Stack spacing={4}>

                        {/* --- TOTAL BALANCE --- */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2, fontWeight: 'bold' }}>Current Balance Due</Typography>
                            <Typography variant="h2" sx={{ fontWeight: 800, color: balance > 0 ? '#fff' : '#4ade80', mt: 1 }}>
                                ${balance.toFixed(2)}
                            </Typography>
                            {balance === 0 && (
                                <Chip label="Account in good standing" color="success" sx={{ mt: 2, fontWeight: 'bold' }} />
                            )}
                        </Box>

                        {/* --- PAYMENT METHODS --- */}
                        <Box>
                            <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'block', pl: 1 }}>Select Payment Method</Typography>
                            <Stack spacing={1.5}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<CreditCard />}
                                    sx={{ py: 1.8, bgcolor: '#635BFF', borderRadius: 3, fontWeight: 'bold' }}
                                >
                                    Pay with Card (Stripe)
                                </Button>
                                <Stack direction="row" spacing={1.5}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{ py: 1.5, borderRadius: 3, color: '#0070BA', borderColor: '#0070BA', fontWeight: 'bold' }}
                                    >
                                        PayPal
                                    </Button>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<Apple />}
                                        sx={{ py: 1.5, borderRadius: 3, bgcolor: 'black', color: 'white', fontWeight: 'bold' }}
                                    >
                                        Apple Pay
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* --- CRYPTO OPTION --- */}
                        <Paper sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(247, 147, 26, 0.05)', border: '1px solid rgba(247, 147, 26, 0.2)' }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1, bgcolor: '#F7931A', borderRadius: 2, display: 'flex' }}>
                                    <CurrencyBitcoin sx={{ color: 'black' }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" color="#F7931A">Cryptocurrency</Typography>
                                    <Typography variant="caption" color="text.secondary">We accept USDC, USDT, BTC, and ETH</Typography>
                                </Box>
                                <Button size="small" variant="text" sx={{ color: '#F7931A', fontWeight: 'bold' }}>Pay Now</Button>
                            </Stack>
                        </Paper>

                        {/* --- INVOICE BREAKDOWN --- */}
                        <Box>
                            <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'block', pl: 1 }}>Active Charges</Typography>
                            {loading ? (
                                <CircularProgress size={20} />
                            ) : confirmedBookings.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>No outstanding invoices found.</Typography>
                            ) : (
                                <Stack spacing={1.5}>
                                    {confirmedBookings.map((b: any) => (
                                        <Paper key={b.id} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography variant="body1" fontWeight="bold">{b.service_type}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{b.start_date} - {b.end_date}</Typography>
                                                </Box>
                                                <Typography variant="body1" fontWeight="bold" color="primary">${b.total_price.toFixed(2)}</Typography>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                            )}
                        </Box>

                        <Stack direction="row" spacing={1} sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 1.5, borderRadius: 2 }}>
                            <Info fontSize="small" color="disabled" />
                            <Typography variant="caption" color="text.secondary">
                                Prices are inclusive of all luxury amenities and 24/7 care. Terms of service apply.
                            </Typography>
                        </Stack>

                    </Stack>
                </Container>

                {/* --- BOTTOM NAVIGATION --- */}
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, borderTop: '1px solid rgba(255,255,255,0.05)' }} elevation={3} >
                    <BottomNavigation
                        showLabels
                        value={-1} // None selected on detail page
                        onChange={(e, v) => handleNavChange(v)}
                        sx={{ bgcolor: '#0B0C10', height: 70, '& .MuiBottomNavigationAction-label': { fontSize: '0.7rem', mt: 0.5 } }}
                    >
                        <BottomNavigationAction label="Home" icon={<Home />} />
                        <BottomNavigationAction label="Pets" icon={<Pets />} />
                        <BottomNavigationAction label="Bookings" icon={<CalendarMonth />} />
                        <BottomNavigationAction label="Profile" icon={<Person />} />
                    </BottomNavigation>
                </Paper>
            </Box>
        </ThemeProvider>
    );
}
