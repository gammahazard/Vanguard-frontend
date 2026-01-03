import { Avatar, Badge as MuiBadge, Box, Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Chat as ChatIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { UserWithPets } from "@/types";
import { useMemo } from "react";

interface ClientDirectoryProps {
    clients: UserWithPets[]; // All clients
    onViewPets: (client: UserWithPets) => void;
    onChat: (client: UserWithPets) => void;
}

export default function ClientDirectory({ clients, onViewPets, onChat }: ClientDirectoryProps) {

    // Optimized sorting: Unread messages first, then pet owners, then alphabetical
    const sortedDirectoryClients = useMemo(() => {
        return [...clients].sort((a, b) => {
            // 1. Unread messages first
            const unreadA = a.unread_messages_count || 0;
            const unreadB = b.unread_messages_count || 0;
            if (unreadB !== unreadA) return unreadB - unreadA;

            // 2. Pet owners first
            const petsA = a.pets?.length || 0;
            const petsB = b.pets?.length || 0;
            if (petsA > 0 && petsB === 0) return -1;
            if (petsA === 0 && petsB > 0) return 1;

            // 3. Alphabetical
            const nameA = a.name || a.email || "";
            const nameB = b.name || b.email || "";
            return nameA.localeCompare(nameB);
        });
    }, [clients]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Stack spacing={2}>
                {sortedDirectoryClients.map((client) => (
                    <Paper key={client.id} sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: (client.unread_messages_count > 0) ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255,255,255,0.01)',
                        border: (client.unread_messages_count > 0) ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
                    }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                                <MuiBadge
                                    badgeContent={client.pets?.length || 0}
                                    color="error"
                                    overlap="circular"
                                    invisible={!(client.pets?.length)}
                                >
                                    <Avatar
                                        src={client.pets?.[0]?.image_url} /* Note: Ensure Pet type has image_url or photo_url mapped correctly. API returns photo_url usually. Interface says image_url. */
                                        sx={{
                                            bgcolor: (client.unread_messages_count > 0) ? '#D4AF37' : 'rgba(212, 175, 55, 0.1)',
                                            color: (client.unread_messages_count > 0) ? 'black' : '#D4AF37',
                                            width: 48,
                                            height: 48
                                        }}
                                    >
                                        {client.email[0].toUpperCase()}
                                    </Avatar>
                                </MuiBadge>

                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography
                                        fontWeight="bold"
                                        color="white"
                                        noWrap
                                        sx={{
                                            fontSize: '1rem',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {client.name || client.email}
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8" noWrap sx={{ display: 'block' }}>
                                        Pets: {client.pets?.length > 0 ? client.pets.map((p) => p.name).join(', ') : 'No pets registered'}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => onViewPets(client)}
                                    sx={{ borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: 2 }}
                                >
                                    View Pets
                                </Button>

                                <IconButton
                                    size="small"
                                    onClick={() => onChat(client)}
                                    sx={{
                                        bgcolor: (client.unread_messages_count > 0) ? '#D4AF37' : 'rgba(255,255,255,0.05)',
                                        color: (client.unread_messages_count > 0) ? 'black' : '#D4AF37',
                                        '&:hover': { bgcolor: '#F5D061' }
                                    }}
                                >
                                    <ChatIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Paper>
                ))}
            </Stack>
        </motion.div>
    );
}

