import React, { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, TextField, DialogTitle, Switch, Paper, IconButton, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3003/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      const updatedUser = {...user, isActive: !user.isActive};
      await axios.patch(`http://localhost:3003/api/users/${user._id}`, updatedUser);
      fetchUsers();
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  const handleEditUser = async () => {
    try {
      await axios.patch(`http://localhost:3003/api/users/${currentUser._id}`, currentUser);
      setEditDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:3003/api/users/${currentUser._id}`);
      setDeleteConfirmOpen(false);
      fetchUsers();
      setSnackbarOpen(true); // Show success message
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user: " + error.message);
    }
  };

  const handleOpenEditDialog = (user) => {
    setCurrentUser(user);
    setEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (user) => {
    setCurrentUser(user);
    setDeleteConfirmOpen(true);
  };

  const handleChange = (e) => {
    setCurrentUser({...currentUser, [e.target.name]: e.target.value});
  };

  return (
    <Helmet title="Manage Users">
                <CommonSection title="Manage Users" />

    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Persona</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name || "No Name Provided"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.persona}</TableCell>
                <TableCell>
                  <Switch checked={user.isActive || false} onChange={() => handleToggleActive(user)} />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEditDialog(user)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(user)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField label="Name" name="name" value={currentUser?.name || ''} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Email" name="email" value={currentUser?.email || ''} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Persona" name="persona" value={currentUser?.persona || ''} onChange={handleChange} fullWidth margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditUser} color="primary">Save</Button>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContent>Are you sure you want to delete this user?</DialogContent>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteUser} color="primary">Yes</Button>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="secondary">No</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="User deleted successfully"
      />
    </Container>
    </Helmet>
  );
};

export default ManageUsers;
