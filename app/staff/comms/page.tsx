"use client";

import { Box, Typography, Paper, Stack, Container, TextField, InputAdornment, Chip, Avatar, Tooltip, IconButton, Divider, CircularProgress, Button, Snackbar, useTheme, useMediaQuery } from "@mui/material";
import {
    Search,
    FilterList,
    Person,
    AccessTime,
    ArrowForward,
    MarkChatRead,
    AdminPanelSettings,
    Refresh,
    Message as MessageIcon,
    Send,
    AttachFile,
    MoreVert,
    ArrowBack
} from "@mui/icons-material";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: number;
    sender_email: string;
    receiver_email: string;
    content: string;
    timestamp: string;
    sender_name?: string;
}

interface Conversation {
    clientEmail: string;
    clientName: string;
    messages: Message[];
    lastMessage: Message;
    unreadCount: number;
}

const staffEmails = ['jack@vanguard.com', 'staff@vanguard.com', 'admin@vanguard.com', 'trainer@vanguard.com'];

export default function StaffCommsLog() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Data State
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // UI State
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string }>({ open: false, message: "" });

    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Fetch
    useEffect(() => {
        fetchMessages();
        const interval = setInterval(() => fetchMessages(true), 15000); // 15s poll
        return () => clearInterval(interval);
    }, []);

    // Scroll to bottom when conversation changes or new message sent
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedEmail, messages]);

    const fetchMessages = async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);

        try {
            const token = localStorage.getItem("vanguard_token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.pokeframe.me'}/api/admin/messages`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleSendMessage = async () => {
        if (!replyText.trim() || !selectedEmail) return;
        setSending(true);

        try {
            const token = localStorage.getItem("vanguard_token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.pokeframe.me'}/api/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiver: selectedEmail,
                    content: replyText
                })
            });

            if (res.ok) {
                setReplyText("");
                fetchMessages(true); // Immediate refresh
                setSnackbar({ open: true, message: "Message sent securedly." });
            } else {
                const errorText = await res.text();
                console.error("Staff Send Failed:", res.status, errorText);
                throw new Error("Failed to send");
            }
        } catch (error) {
            console.error("Staff Send Error:", error);
            setSnackbar({ open: true, message: "Transmission failed." });
        } finally {
            setSending(false);
        }
    };

    const conversations: Conversation[] = useMemo(() => {
        const convoMap = new Map<string, Message[]>();

        messages.forEach(msg => {
            // Determine who the "Client" is in this interaction
            // Staff are always @vanguard.com
            const isSenderStaff = msg.sender_email.toLowerCase().endsWith("@vanguard.com");
            const clientSide = isSenderStaff ? msg.receiver_email : msg.sender_email;

            // Skip internal staff-to-staff chatter if any (optional, keeping it cleaner for now)
            // if (isSenderStaff && staffEmails.some(s => msg.receiver_email.toLowerCase().includes(s.split('@')[0]))) return;

            if (!convoMap.has(clientSide)) {
                convoMap.set(clientSide, []);
            }
            convoMap.get(clientSide)!.push(msg);
        });

        const list = Array.from(convoMap.entries()).map(([email, msgs]) => {
            const sorted = msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            return {
                clientEmail: email,
                clientName: sorted.find(m => m.sender_email === email)?.sender_name || email.split('@')[0],
                messages: sorted,
                lastMessage: sorted[sorted.length - 1],
                unreadCount: 0 // Logic for real unread count could go here if backend supported it
            };
        });

        // Sort by most recent message
        return list.sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
    }, [messages]);

    const filteredConversations = conversations.filter(c =>
        c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.messages.some(m => m.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const activeConversation = conversations.find(c => c.clientEmail === selectedEmail);

    // --- Render Helpers ---

    const getRoleParams = (email: string) => {
        const lower = email.toLowerCase();
        if (lower.includes('owner')) return { label: 'OWNER', color: '#D4AF37', bg: 'rgba(212, 175, 55, 0.1)', align: 'right' };
        if (lower.includes('staff') || lower.includes('vanguard')) return { label: 'STAFF', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)', align: 'right' };
        return { label: 'CLIENT', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', align: 'left' };
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', bgcolor: '#0B0C10', overflow: 'hidden' }}>

            {/* LEFT PANEL: Conversation List */}
            <Box sx={{
                width: { xs: '100%', md: 350, lg: 400 },
                borderRight: '1px solid rgba(255,255,255,0.1)',
                display: { xs: selectedEmail ? 'none' : 'flex', md: 'flex' },
                flexDirection: 'column',
                bgcolor: '#0f1014'
            }}>
                {/* Header */}
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <AdminPanelSettings sx={{ color: '#D4AF37' }} />
                        <Typography variant="h6" fontWeight="bold" color="white" sx={{ letterSpacing: 1 }}>BLACK BOX</Typography>
                        {refreshing && <CircularProgress size={16} sx={{ color: '#64748b', ml: 'auto' }} />}
                    </Stack>
                    <TextField
                        fullWidth
                        placeholder="Search intercepts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search sx={{ color: '#64748b' }} /></InputAdornment>,
                            sx: { bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, color: 'white', '& fieldset': { border: 'none' } }
                        }}
                    />
                </Box>

                {/* List */}
                <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
                    {loading && conversations.length === 0 ? (
                        <Stack alignItems="center" sx={{ pt: 4, opacity: 0.5 }}>
                            <CircularProgress size={24} sx={{ color: '#D4AF37' }} />
                        </Stack>
                    ) : (
                        <Stack spacing={0.5}>
                            {filteredConversations.map(convo => (
                                <Box
                                    key={convo.clientEmail}
                                    onClick={() => setSelectedEmail(convo.clientEmail)}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        bgcolor: selectedEmail === convo.clientEmail ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                                        border: selectedEmail === convo.clientEmail ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid transparent',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
                                    }}
                                >
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: selectedEmail === convo.clientEmail ? '#D4AF37' : 'white' }}>
                                            {convo.clientName}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
                                            {new Date(convo.lastMessage.timestamp).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" sx={{
                                        color: '#94a3b8',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        opacity: 0.7,
                                        fontSize: '0.8rem'
                                    }}>
                                        {convo.lastMessage.content}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </Box>
            </Box>

            {/* RIGHT PANEL: Chat View */}
            <Box sx={{
                flex: 1,
                display: { xs: selectedEmail ? 'flex' : 'none', md: 'flex' },
                flexDirection: 'column',
                bgcolor: '#0B0C10',
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.02) 0%, transparent 50%)'
            }}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(0,0,0,0.2)' }}>
                            {isMobile && (
                                <IconButton onClick={() => setSelectedEmail(null)} sx={{ color: '#94a3b8' }}>
                                    <ArrowBack />
                                </IconButton>
                            )}
                            <Avatar sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', fontWeight: 'bold' }}>
                                {activeConversation.clientName.substring(0, 2).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" color="white">
                                    {activeConversation.clientName}
                                </Typography>
                                <Typography variant="caption" color="#64748b">
                                    {activeConversation.clientEmail}
                                </Typography>
                            </Box>
                            <Box sx={{ ml: 'auto' }}>
                                <Tooltip title="Client Profile">
                                    <IconButton sx={{ color: '#64748b' }}><Person /></IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        {/* Messages Area */}
                        <Box
                            ref={scrollRef}
                            sx={{
                                flex: 1,
                                overflowY: 'auto',
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}
                        >
                            {activeConversation.messages.map((msg, i) => {
                                const role = getRoleParams(msg.sender_email);
                                const isSelf = role.align === 'right';

                                // Check if next message is from same sender (for grouping)
                                const isNextSame = activeConversation.messages[i + 1]?.sender_email === msg.sender_email;

                                return (
                                    <Box
                                        key={msg.id}
                                        sx={{
                                            alignSelf: isSelf ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: isSelf ? 'flex-end' : 'flex-start'
                                        }}
                                    >
                                        {!isNextSame && (
                                            <Typography variant="caption" sx={{ color: role.color, mb: 0.5, fontSize: '0.7rem', fontWeight: 'bold', ml: 1, mr: 1 }}>
                                                {msg.sender_name || msg.sender_email.split('@')[0]}
                                            </Typography>
                                        )}
                                        <Paper sx={{
                                            p: 2,
                                            bgcolor: isSelf ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.05)',
                                            color: isSelf ? '#D4AF37' : '#e2e8f0',
                                            borderRadius: 3,
                                            borderTopRightRadius: isSelf ? 4 : 24,
                                            borderTopLeftRadius: isSelf ? 24 : 4,
                                            border: `1px solid ${isSelf ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                                            position: 'relative'
                                        }}>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{msg.content}</Typography>
                                        </Paper>
                                        <Typography variant="caption" sx={{
                                            color: '#64748b',
                                            mt: 0.5,
                                            fontSize: '0.65rem',
                                            opacity: 0.7,
                                            px: 1
                                        }}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Input Area */}
                        <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: '2px 4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    borderRadius: 3,
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    '&:focus-within': { borderColor: '#D4AF37' }
                                }}
                            >
                                <TextField
                                    fullWidth
                                    placeholder="Type a secure message..."
                                    variant="standard"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    // Submit on Enter
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    InputProps={{ disableUnderline: true, sx: { color: 'white', px: 2, py: 1 } }}
                                />
                                <IconButton
                                    color="primary"
                                    onClick={handleSendMessage}
                                    disabled={sending || !replyText.trim()}
                                    sx={{
                                        color: sending ? '#64748b' : '#D4AF37',
                                        p: 1.5,
                                        mr: 0.5,
                                        transition: 'all 0.2s',
                                        transform: sending ? 'scale(0.9)' : 'scale(1)'
                                    }}
                                >
                                    {sending ? <CircularProgress size={20} color="inherit" /> : <Send />}
                                </IconButton>
                            </Paper>
                        </Box>

                    </>
                ) : (
                    <Stack flex={1} alignItems="center" justifyContent="center" spacing={2} sx={{ opacity: 0.3 }}>
                        <AdminPanelSettings sx={{ fontSize: 64, color: '#D4AF37' }} />
                        <Typography variant="h6" color="#94a3b8">Select a stream to intercept</Typography>
                    </Stack>
                )}
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
            />
        </Box>
    );
}
