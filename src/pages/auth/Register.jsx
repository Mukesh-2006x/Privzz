import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Box, TextField, Button, Paper, Typography, Stack } from '@mui/material';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  const imgbbApiKey = '5fc195f21d5022cfbb516a9ea9a8fb89';

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('image', profilePic);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.data.url;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password || !profilePic) {
      alert('Please fill all fields and select a profile image');
      return;
    }
    try {
      const resUsers = await fetch('https://retoolapi.dev/SMN1I1/login');
      const users = await resUsers.json();
      const userExists = users.some(u => u.Username.toLowerCase() === username.toLowerCase());
      if (userExists) {
        alert('Username already taken. Please choose a different username.');
        return;
      }
      const imageUrl = await uploadImage();
      const userData = {
        Username: username,
        Password: password,
        Status: false,
        Profile_pic: imageUrl
      };
      const res = await fetch('https://retoolapi.dev/SMN1I1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        alert('Registered Successfully!');
        navigate('/login');
      } else {
        alert('Failed to register.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      setProfilePic(acceptedFiles[0]);
    },
  });

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
          REGISTER
        </Typography>
        <form onSubmit={handleRegister}>
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
            <Box {...getRootProps()} sx={{
              p: 2,
              border: '2px dashed #555',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: 2,
              bgcolor: isDragActive ? '#3C3B4A' : '#2C2B3A'
            }}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <Typography>Drop the image here...</Typography>
              ) : (
                <Typography>{profilePic ? profilePic.name : 'Drag & drop profile picture here, or click to select'}</Typography>
              )}
            </Box>
            <Button variant="contained" color="primary" type="submit" size="large">
              Register
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
