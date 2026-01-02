import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Stack,
    Paper,
    Avatar,
    Box,
    Chip,
    Button,
    Alert
} from "@mui/material";
import { EnrichedBooking } from "@/types";

interface CheckInModalProps {
    open: boolean;
    onClose: () => void;
    todaysArrivals: EnrichedBooking[];
    isOwner: boolean;
    onMarkPaid: (booking: EnrichedBooking) => void;
    onCheckIn: (booking: EnrichedBooking) => void;
}

export default function CheckInModal({
    open,
    onClose,
    todaysArrivals,
    isOwner,
    onMarkPaid,
    onCheckIn
}: CheckInModalProps) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Arrivals Terminal: {new Date().toLocaleDateString()}</DialogTitle>
            <DialogContent>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Listing confirmed bookings for today only.
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    {todaysArrivals.length === 0 ? (
                        <Alert severity="info" sx={{ borderRadius: 2 }}>No arrivals scheduled for today.</Alert>
                    ) : todaysArrivals.map((arrival, i) => (
                        <Paper key={i} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37' }}>{arrival.dog_name?.[0]?.toUpperCase() || 'D'}</Avatar>
                                <Box>
                                    <Typography variant="body2" fontWeight="bold" color="white">{arrival.dog_name || 'VIP'}</Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">{arrival.service_type}</Typography>
                                    {arrival.is_paid ? (
                                        <Chip label="Paid" size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', fontWeight: 'bold' }} />
                                    ) : (
                                        <Chip label="Awaiting Payment" size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontWeight: 'bold' }} />
                                    )}
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                {isOwner && !arrival.is_paid && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="warning"
                                        onClick={() => onMarkPaid(arrival)}
                                        sx={{ fontSize: '0.65rem', borderRadius: 1.5 }}
                                    >
                                        Force Paid
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    size="small"
                                    disabled={!arrival.is_paid}
                                    onClick={() => onCheckIn(arrival)}
                                    sx={{
                                        bgcolor: '#22c55e',
                                        '&:hover': { bgcolor: '#16a34a' },
                                        borderRadius: 1.5,
                                        fontWeight: 'bold',
                                        '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' }
                                    }}
                                >
                                    Check In
                                </Button>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
