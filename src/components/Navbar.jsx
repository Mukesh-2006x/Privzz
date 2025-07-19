// components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const username = localStorage.getItem('loggedInUser');
    if (!username) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('https://retoolapi.dev/SMN1I1/login');
      const data = await res.json();
      const user = data.find(u => u.Username === username);

      if (user) {
        await fetch(`https://retoolapi.dev/SMN1I1/login/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Status: false })
        });
      }

      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loggedInUser');
      navigate('/login');
      alert('Logged out successfully!');
    } catch (err) {
      alert('Logout failed!');
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#2C2F33' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/home">Home</Button>
          <Button color="inherit" component={Link} to="/about">About</Button>
          <Button color="inherit" component={Link} to="/video">Video</Button>
        </Box>
        <Button color="error" variant="contained" onClick={handleLogout} sx={{ ml: 2 }}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}
