import {
    Dialog,
    DialogTitle,
    DialogContent,
    Stack,
    TextField,
    MenuItem,
    Box,
    Button,
    CircularProgress
} from "@mui/material";
import {
    Assignment as AssignmentIcon,
    AddAPhoto
} from "@mui/icons-material";
import { Pet, GuestPet } from "@/types";

interface DailyReportModalProps {
    open: boolean;
    onClose: () => void;
    selectedPet: Pet | GuestPet | null;
    reportData: {
        mood: string;
        activity: string;
        ate_breakfast: string;
        ate_dinner: string;
        notes: string;
        image_url: string;
    };
    onReportDataChange: (data: any) => void;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    uploading: boolean;
    onSubmitReport: () => void;
    submittingReport: boolean;
}

export default function DailyReportModal({
    open,
    onClose,
    selectedPet,
    reportData,
    onReportDataChange,
    onFileUpload,
    uploading,
    onSubmitReport,
    submittingReport
}: DailyReportModalProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { bgcolor: '#1e293b', backgroundImage: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, minWidth: 400 } }}
        >
            <DialogTitle sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon sx={{ color: '#D4AF37' }} /> Daily VIP Update: {selectedPet?.name}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={2}>
                        <TextField
                            select
                            label="Mood"
                            fullWidth
                            variant="filled"
                            value={reportData.mood}
                            onChange={e => onReportDataChange({ ...reportData, mood: e.target.value })}
                        >
                            <MenuItem value="Happy">Happy 😊</MenuItem>
                            <MenuItem value="Energetic">Energetic ⚡</MenuItem>
                            <MenuItem value="Relaxed">Relaxed 😴</MenuItem>
                            <MenuItem value="Shy">Shy 🥺</MenuItem>
                        </TextField>
                        <TextField
                            select
                            label="Activity"
                            fullWidth
                            variant="filled"
                            value={reportData.activity}
                            onChange={e => onReportDataChange({ ...reportData, activity: e.target.value })}
                        >
                            <MenuItem value="Playing">Playing</MenuItem>
                            <MenuItem value="Walking">Walking</MenuItem>
                            <MenuItem value="Swimming">Swimming</MenuItem>
                            <MenuItem value="Resting">Resting</MenuItem>
                        </TextField>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        <TextField
                            select
                            label="Breakfast"
                            fullWidth
                            variant="filled"
                            value={reportData.ate_breakfast}
                            onChange={e => onReportDataChange({ ...reportData, ate_breakfast: e.target.value })}
                        >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="Partial">Partial</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                        </TextField>
                        <TextField
                            select
                            label="Dinner"
                            fullWidth
                            variant="filled"
                            value={reportData.ate_dinner}
                            onChange={e => onReportDataChange({ ...reportData, ate_dinner: e.target.value })}
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="Partial">Partial</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                        </TextField>
                    </Stack>

                    <Box sx={{
                        border: '2px dashed rgba(212, 175, 55, 0.3)',
                        borderRadius: 4,
                        p: 3,
                        textAlign: 'center',
                        bgcolor: 'rgba(212, 175, 55, 0.05)',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: '#D4AF37', bgcolor: 'rgba(212, 175, 55, 0.1)' }
                    }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="raised-button-file-report"
                            type="file"
                            onChange={onFileUpload}
                        />
                        <label htmlFor="raised-button-file-report">
                            <Button
                                component="span"
                                variant="contained"
                                startIcon={uploading ? <CircularProgress size={20} /> : <AddAPhoto />}
                                disabled={uploading}
                                sx={{
                                    bgcolor: '#D4AF37',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    borderRadius: 2,
                                    '&:hover': { bgcolor: '#b5932b' }
                                }}
                            >
                                {reportData.image_url ? "Change Photo" : "Upload VIP Photo"}
                            </Button>
                        </label>
                        {reportData.image_url && (
                            <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden', height: 120 }}>
                                <img src={reportData.image_url} alt="VIP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </Box>
                        )}
                    </Box>

                    <TextField
                        label="Special Notes"
                        multiline
                        rows={3}
                        fullWidth
                        variant="filled"
                        value={reportData.notes}
                        onChange={e => onReportDataChange({ ...reportData, notes: e.target.value })}
                        placeholder="Any special moments or observations for the owner..."
                    />

                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        onClick={onSubmitReport}
                        disabled={submittingReport || uploading}
                        sx={{
                            mt: 2,
                            py: 1.5,
                            borderRadius: 3,
                            bgcolor: '#3b82f6',
                            fontWeight: 'bold',
                            '&:hover': { bgcolor: '#2563eb' }
                        }}
                    >
                        {submittingReport ? <CircularProgress size={24} color="inherit" /> : "Send Digital Report Card"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
