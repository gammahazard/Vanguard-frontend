"use client";

import { useState } from "react";
import {
    Box, Typography, Container, Stack, Paper, Chip,
    BottomNavigation, BottomNavigationAction, ThemeProvider, CssBaseline, Fab, Divider, Button
} from "@mui/material";
import { Home, Pets, CalendarMonth, Person, Add, LocationOn, AccessTime } from "@mui/icons-material";
import { theme } from "@/lib/theme";
import { useRouter } from "next/navigation";

export default function BookingsView() {
    const router = useRouter();
    const [navValue, setNavValue] = useState(2); // Index 2 is Bookings

    const handleNavChange = (newValue: number) => {
        setNavValue(newValue);
        if (newValue === 0) router.push('/client/dashboard');
        if (newValue === 1) router.push('/client/pets');
        if (newValue === 3) router.push('/client/profile');
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>

                {/* Header */}
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(5, 6, 8, 0.9)', position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">Reservations</Typography>
                    <Chip label="2 Active" size="small" color="primary" sx={{ fontWeight: 'bold', borderRadius: 1 }} />
                </Paper>

                <Container maxWidth="sm" sx={{ pt: 2 }}>
                    <Stack spacing={3}>

                        {/* Section: UPCOMING */}
                        <Box>
                            <Typography variant="overline" color="text.secondary" fontWeight="bold" letterSpacing={2}>Upcoming</Typography>
                            <Paper sx={{ mt: 1, p: 4, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                <CalendarMonth sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">No Active Reservations</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Ready to plan your pup's next vacation?
                                </Typography>
                                <Button variant="outlined" startIcon={<Add />} color="primary">
                                    New Booking
                                </Button>
                            </Paper>
                        </Box>

                        {/* Section: PAST */}
                        <Box>
                            <Typography variant="overline" color="text.secondary" fontWeight="bold" letterSpacing={2}>Past Activity</Typography>
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                <PastBookingCard title="Grooming - Full Service" date="Nov 15, 2024" pet="Pet 1" />
                                <PastBookingCard title="Daycare - Full Day" date="Nov 10, 2024" pet="Pet 2" />
                            </Stack>
                        </Box>

                    </Stack>
                </Container>

                {/* FAB */}
                <Fab color="primary" sx={{ position: 'fixed', bottom: 90, right: 20, boxShadow: '0 0 20px rgba(212,175,55,0.4)' }}>
                    <Add />
                </Fab>

                {/* Bottom Nav */}
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }} elevation={3}>
                    <BottomNavigation
                        showLabels
                        value={navValue}
                        onChange={(event, newValue) => handleNavChange(newValue)}
                        sx={{ bgcolor: '#0B0C10', height: 70, '& .Mui-selected': { color: '#D4AF37 !important' } }}
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

function PastBookingCard({ title, date, pet }: any) {
    return (
        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="body1" fontWeight="500">{title}</Typography>
                    <Typography variant="caption" color="text.secondary">{pet} • {date}</Typography>
                </Box>
                <Chip label="COMPLETED" size="small" variant="outlined" sx={{ color: 'text.secondary', borderColor: 'rgba(255,255,255,0.1)', fontSize: '0.6rem' }} />
            </Stack>
        </Paper>
    );
}
