import React, { useRef, useEffect, useState } from "react";
import { Container } from "reactstrap";
import logo from "../../assets/images/logo2.png";
import { NavLink } from "react-router-dom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import "../../styles/header.css";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const Header = () => {
  const menuRef = useRef(null);
  const headerRef = useRef(null);
  const [userInfo, setUserInfo] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated]);

  const fetchUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('http://localhost:3003/api/user-info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
  };
  

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setDialogOpen(true);
    handleCloseMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('isAuthenticated');
    setUserInfo(null);
    handleCloseMenu();
    navigate('/login');
  };

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="nav__wrapper d-flex align-items-center justify-content-between">
          <div className="logo">
            <img src={logo} alt="logo" />
            <h5>QuickServe</h5>
          </div>
          <div className="navigation" ref={menuRef}>
            <div className="menu d-flex align-items-center gap-5">
              <NavLink to="/home" className="active__menu">Home</NavLink>
              <NavLink to="/foods">Foods</NavLink>
              <NavLink to="/cart">Cart</NavLink>
              <NavLink to="/quickchat">QuickChat</NavLink>
              <NavLink to="/contact">Contact</NavLink>
              {userInfo && userInfo.persona === "Customer" && (
                <NavLink to="/MyOrders">My Orders</NavLink>
              )}
            </div>
          </div>
          <div className="nav__right d-flex align-items-center gap-4">
            <span className="cart__icon">
              <ShoppingCartIcon />
              <span className="cart__badge">{useSelector(state => state.cart.totalQuantity)}</span>
            </span>
            {!isAuthenticated ? (
              <Button onClick={() => navigate('/login')} variant="contained" color="primary" style={{ marginLeft: '10px', color:'white', backgroundColor:'red'}}>
                Login
              </Button>
            ) : (
              <div className="user">
                <AccountCircleIcon onClick={handleMenu} style={{ cursor: 'pointer' }} />
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                >
                  <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                  {userInfo && userInfo.persona === "System Administrator" && (
                    <MenuItem onClick={() => navigate('/ManageUsers')}>Manage Users</MenuItem>
                  )}
                   {userInfo && userInfo.persona === "Customer" && (
                    <MenuItem onClick={() => navigate('/Notifications')}>Notifications</MenuItem>
                  )}
                  {userInfo && userInfo.persona === "Customer Support" && (
                    <MenuItem onClick={() => navigate('/CustomerQueries')}>Customer Queries</MenuItem>
                  )}
                  {userInfo && userInfo.persona === "Restaurant" && (
                    <MenuItem onClick={() => navigate('/orders')}>Orders</MenuItem>
                  )}
                  {userInfo && userInfo.persona === "Delivery Personnel" && (
                    <MenuItem onClick={() => navigate('/ReceivedOrders')}>Received Orders</MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
            <span className="mobile__menu">
              <MenuIcon />
            </span>
          </div>
        </div>
      </Container>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>User Profile</DialogTitle>
<DialogContent>
  {userInfo ? (
    <>
      <DialogContentText>Username: {userInfo.username || localStorage.getItem('username')}</DialogContentText>
      <DialogContentText>Email: {userInfo.email}</DialogContentText>
      <DialogContentText>Persona: {userInfo.persona}</DialogContentText>
    </>
  ) : (
    <DialogContentText>No user information available.</DialogContentText>
  )}
</DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </header>
  );
};

export default Header;
