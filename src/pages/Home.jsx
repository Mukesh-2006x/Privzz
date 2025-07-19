import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();

  const chatApi = 'https://retoolapi.dev/dbVB4L/chat';

  useEffect(() => {
    const username = localStorage.getItem('loggedInUser');
    if (!username) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      const res = await fetch('https://retoolapi.dev/SMN1I1/login');
      const data = await res.json();

      const currentUser = data.find(u => u.Username === username);
      const active = data.filter(u => u.Status === true);

      if (currentUser) setUser(currentUser);
      else {
        localStorage.clear();
        navigate('/login');
      }

      setActiveUsers(active);
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(chatApi);
      const data = await res.json();
      setMessages(data);
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await fetch(chatApi, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        SenderUsername: user.Username,
        Message: newMessage,
        Timestamp: new Date().toISOString()
      })
    });
    setNewMessage('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexGrow: 1, height: 'calc(100vh - 64px)', bgcolor: '#1A1D21', overflow: 'hidden' }}>
      <Box sx={{ width: { xs: '100%', md: '300px' }, height: { xs: '200px', md: '100%' }, bgcolor: '#2C2F33', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #3A3D42' }}>
          <Typography variant="h6" fontWeight="bold">Active Users</Typography>
        </Box>
        <List sx={{ flex: 1, overflow: 'auto' }}>
          {activeUsers.length > 0 ? activeUsers.map((u) => (
            <ListItem key={u.id} sx={{ py: 1, px: 2 }}>
              <ListItemAvatar>
                <Avatar src={u.Profile_pic} />
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="body2">{u.Username}</Typography>} />
            </ListItem>
          )) : (
            <Typography textAlign="center" color="#aaa" sx={{ mt: 2 }}>No active users</Typography>
          )}
        </List>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#36393F', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #3A3D42', color: '#fff', flexShrink: 0 }}>
          <Typography variant="h6" fontWeight="bold">Chat Forum</Typography>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          {messages.length > 0 ? messages.map((msg) => (
            <Box key={msg.id} sx={{ mb: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" color="#ddd" fontWeight="bold">{msg.SenderUsername}</Typography>
              <Typography variant="body2" color="#ccc">{msg.Message}</Typography>
            </Box>
          )) : (
            <Typography color="#aaa" textAlign="center">No messages yet.</Typography>
          )}
        </Box>

        <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 2, borderTop: '1px solid #3A3D42', bgcolor: '#40444B', gap: 1, flexShrink: 0 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{ bgcolor: '#fff', borderRadius: 1 }}
          />
          <IconButton type="submit" sx={{ bgcolor: '#7289DA', '&:hover': { bgcolor: '#5b6eae' }, color: '#fff' }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
