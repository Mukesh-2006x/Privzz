import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Button,
  Paper,
  Stack,
  Divider,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';

export default function About() {
  const [user, setUser] = useState(null);
  const [editUsername, setEditUsername] = useState(false);
  const [editProfilePic, setEditProfilePic] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const imgbbApiKey = '5fc195f21d5022cfbb516a9ea9a8fb89';

  useEffect(() => {
    const username = localStorage.getItem('loggedInUser');
    if (!username) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      const res = await fetch('https://retoolapi.dev/SMN1I1/login');
      const data = await res.json();
      const currentUser = data.find(u => u.Username === username);
      setLoading(false);
      if (currentUser) setUser(currentUser);
      else {
        localStorage.clear();
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const uploadImageToImgbb = async () => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.data.url;
  };

  const updateField = async (field, value) => {
    setLoading(true);
    const res = await fetch(`https://retoolapi.dev/SMN1I1/login/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    setLoading(false);
    if (res.ok) {
      if (field === 'Username') localStorage.setItem('loggedInUser', value);
      alert('Updated Successfully');
      window.location.reload();
    } else {
      alert('Update failed');
    }
  };

  const handleImageUpdate = async () => {
    if (!imageFile) return alert('Choose an image file');
    try {
      setLoading(true);
      const url = await uploadImageToImgbb();
      await updateField('Profile_pic', url);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert('Image upload failed');
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword.trim()) {
      alert('Please enter a valid password.');
      return;
    }
    setLoading(true);
    const res = await fetch(`https://retoolapi.dev/SMN1I1/login/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Password: newPassword }),
    });
    setLoading(false);
    if (res.ok) {
      alert('Password updated successfully.');
      setEditPassword(false);
      setNewPassword('');
    } else {
      alert('Password update failed.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (confirmDelete) {
      setLoading(true);
      const res = await fetch(`https://retoolapi.dev/SMN1I1/login/${user.id}`, {
        method: 'DELETE',
      });
      setLoading(false);
      if (res.ok) {
        alert('Account deleted.');
        localStorage.clear();
        navigate('/login');
      } else {
        alert('Failed to delete account.');
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      setImageFile(acceptedFiles[0]);
    },
  });

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      height: '100vh',
      bgcolor: '#1D1C2B',
      color: '#fff'
    }}>
      {loading && (
        <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {/* Sidebar */}
      <Box sx={{
        flex: '0 0 300px',
        bgcolor: '#2C2B3A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 5,
        gap: 2,
        borderRight: '1px solid #3C3B4A'
      }}>
        {user && (
          <>
            <Avatar src={user.Profile_pic} sx={{ width: 120, height: 120 }} />
            <Typography variant="h5" fontWeight="bold">{user.Username}</Typography>
            <Typography variant="body2" color="gray">Status: {user.Status ? '✅ Active' : '❌ Inactive'}</Typography>
          </>
        )}
      </Box>

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4,
      }}>
        {user && (
          <Paper sx={{
            width: '100%',
            maxWidth: 600,
            p: 4,
            bgcolor: '#2C2B3A',
            color: '#fff',
            borderRadius: 4,
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          }}>
            <Stack spacing={3}>

              {/* Username Edit */}
              <Box>
                <Typography variant="subtitle1">Username</Typography>
                {!editUsername ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="h6" flex={1}>{user.Username}</Typography>
                    <IconButton color="primary" onClick={() => setEditUsername(true)}><EditIcon /></IconButton>
                  </Box>
                ) : (
                  <Stack spacing={1}>
                    <TextField
                      variant="filled"
                      fullWidth
                      label="New Username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" color="success" onClick={() => updateField('Username', newUsername)}>Save</Button>
                      <Button variant="outlined" color="error" onClick={() => setEditUsername(false)}>Cancel</Button>
                    </Stack>
                  </Stack>
                )}
              </Box>

              <Divider sx={{ bgcolor: '#3C3B4A' }} />

              {/* Profile Pic */}
              <Box>
                <Typography variant="subtitle1">Profile Picture</Typography>
                {!editProfilePic ? (
                  <Button variant="outlined" color="primary" startIcon={<EditIcon />} sx={{ mt: 1 }} onClick={() => setEditProfilePic(true)}>
                    Update Picture
                  </Button>
                ) : (
                  <Stack spacing={1} mt={1}>
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
                        <Typography>{imageFile ? imageFile.name : 'Drag and drop image here, or click to select'}</Typography>
                      )}
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" color="success" onClick={handleImageUpdate}>Save</Button>
                      <Button variant="outlined" color="error" onClick={() => setEditProfilePic(false)}>Cancel</Button>
                    </Stack>
                  </Stack>
                )}
              </Box>

              <Divider sx={{ bgcolor: '#3C3B4A' }} />

              {/* Password */}
              <Box>
                <Typography variant="subtitle1">Password</Typography>
                {!editPassword ? (
                  <Button variant="outlined" color="warning" sx={{ mt: 1 }} onClick={() => setEditPassword(true)}>
                    Change Password
                  </Button>
                ) : (
                  <Stack spacing={1} mt={1}>
                    <TextField
                      variant="filled"
                      fullWidth
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" color="success" onClick={handlePasswordUpdate}>Update</Button>
                      <Button variant="outlined" color="error" onClick={() => setEditPassword(false)}>Cancel</Button>
                    </Stack>
                  </Stack>
                )}
              </Box>

              <Divider sx={{ bgcolor: '#3C3B4A' }} />

              {/* Delete */}
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </Stack>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
