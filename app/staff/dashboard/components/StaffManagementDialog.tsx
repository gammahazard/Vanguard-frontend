import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Alert,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    InputAdornment,
    CircularProgress,
    Button
} from "@mui/material";
import {
    Visibility,
    VisibilityOff
} from "@mui/icons-material";

interface StaffManagementDialogProps {
    open: boolean;
    onClose: () => void;
    formError: string;
    formSuccess: string;
    newStaff: any;
    onNewStaffChange: (data: any) => void;
    showPassword: boolean;
    onShowPasswordToggle: () => void;
    onAddStaff: (e: React.FormEvent) => void;
    loadingStaff: boolean;
}

export default function StaffManagementDialog({
    open,
    onClose,
    formError,
    formSuccess,
    newStaff,
    onNewStaffChange,
    showPassword,
    onShowPasswordToggle,
    onAddStaff,
    loadingStaff
}: StaffManagementDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { bgcolor: '#1e293b', backgroundImage: 'none', border: '1px solid rgba(255,255,255,0.1)' } }}>
            <DialogTitle sx={{ color: 'white' }}>Add New Team Member</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1, minWidth: 300 }}>
                    {formError && <Alert severity="error">{formError}</Alert>}
                    {formSuccess && <Alert severity="success">{formSuccess}</Alert>}

                    <TextField
                        label="Full Name"
                        fullWidth
                        value={newStaff.name}
                        onChange={(e) => onNewStaffChange({ ...newStaff, name: e.target.value })}
                    />
                    <TextField
                        label="Email Address"
                        fullWidth
                        value={newStaff.email}
                        onChange={(e) => onNewStaffChange({ ...newStaff, email: e.target.value })}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={newStaff.role}
                            label="Role"
                            onChange={(e) => onNewStaffChange({ ...newStaff, role: e.target.value })}
                        >
                            <MenuItem value="staff">Staff (Operational)</MenuItem>
                            <MenuItem value="owner">Owner (Admin Access)</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        value={newStaff.password}
                        onChange={(e) => onNewStaffChange({ ...newStaff, password: e.target.value })}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={onShowPasswordToggle} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={onAddStaff}
                    disabled={loadingStaff}
                    sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                >
                    {loadingStaff ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
