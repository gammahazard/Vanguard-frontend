import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from "@mui/material";
import { GuestPet, Pet } from "@/types";

interface IncidentModalProps {
    open: boolean;
    onClose: () => void;
    selectedPet: Pet | GuestPet | null;
    incidentTargetId: string;
    onTargetIdChange: (id: string) => void;
    guests: GuestPet[];
    incidentSeverity: string;
    onSeverityChange: (severity: string) => void;
    incidentText: string;
    onTextChange: (text: string) => void;
    onLogIncident: () => void;
}

export default function IncidentModal({
    open,
    onClose,
    selectedPet,
    incidentTargetId,
    onTargetIdChange,
    guests,
    incidentSeverity,
    onSeverityChange,
    incidentText,
    onTextChange,
    onLogIncident
}: IncidentModalProps) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ bgcolor: '#ef4444', color: 'white' }}>Log Care Alert: {selectedPet?.name || 'General Operation'}</DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        This will add a persistent alert to this VIP&apos;s operational card until resolved.
                    </Typography>

                    {!selectedPet && (
                        <FormControl fullWidth>
                            <InputLabel>Target VIP</InputLabel>
                            <Select
                                value={incidentTargetId}
                                onChange={(e) => onTargetIdChange(e.target.value as string)}
                                label="Target VIP"
                            >
                                <MenuItem value="general">General Operation (No Specific VIP)</MenuItem>
                                {guests.map(g => (
                                    <MenuItem key={g.id} value={g.id}>{g.name} ({g.breed})</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    <FormControl fullWidth>
                        <InputLabel>Severity</InputLabel>
                        <Select
                            value={incidentSeverity}
                            onChange={(e) => onSeverityChange(e.target.value as string)}
                            label="Severity"
                        >
                            <MenuItem value="Warning">Yellow Alert (Observation)</MenuItem>
                            <MenuItem value="Critical">Red Alert (Emergency/Strict)</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Details"
                        multiline
                        rows={3}
                        fullWidth
                        value={incidentText}
                        onChange={(e) => onTextChange(e.target.value)}
                        placeholder="e.g. Buddy showed minor limping on front left paw..."
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="error" onClick={onLogIncident} disabled={!incidentText.trim()}>Log Alert</Button>
            </DialogActions>
        </Dialog>
    );
}
