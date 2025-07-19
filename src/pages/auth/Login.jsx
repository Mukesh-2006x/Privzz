import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Paper, Typography, Stack } from '@mui/material';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Enter username and password');
      return;
    }

    const res = await fetch('https://retoolapi.dev/SMN1I1/login');
    const users = await res.json();
    const user = users.find(u => u.Username === username && u.Password === password);

    if (user) {
      await fetch(`https://retoolapi.dev/SMN1I1/login/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Status: true })
      });
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedInUser', user.Username);
      alert('Login successful');
      navigate('/home');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      bgcolor: '#1D1C2B',
      color: '#fff'
    }}>
      <Paper sx={{
        p: 5,
        bgcolor: '#2C2B3A',
        borderRadius: 4,
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
      }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3} color='white'>
          LOGIN
        </Typography>
        <form onSubmit={handleLogin}>
          <Stack spacing={3}>
            <TextField
              variant="filled"
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{ style: { backgroundColor: '#3C3B4A', color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc' } }}
            />
            <TextField
              variant="filled"
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{ style: { backgroundColor: '#3C3B4A', color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc' } }}
            />
            <Button variant="contained" color="primary" type="submit" size="large">
              Login
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/register')}>
              Go to Register
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
