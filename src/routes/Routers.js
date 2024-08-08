import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import AllFoods from "../pages/AllFoods";
import FoodDetails from "../pages/FoodDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ManageUsers from "../pages/ManageUsers";
import CustomerQueries from "../pages/CustomerQueries";
import Orders from "../pages/Orders";
import QuickChat from "../pages/QuickChat";
import OrderRouteMap from '../pages/OrderRouteMap';
import ReceivedOrders from '../pages/ReceivedOrders';
import MyOrders from '../pages/MyOrders';
import Notifications from '../pages/Notifications';



const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/foods" element={<AllFoods />} />
      <Route path="/foods/:id" element={<FoodDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/ManageUsers" element={<ManageUsers />} />
      <Route path="/CustomerQueries" element={<CustomerQueries />} />
      <Route path="/Orders" element={<Orders />} />
      <Route path="/QuickChat" element={<QuickChat />} />
      <Route path="/ReceivedOrders" element={<ReceivedOrders />} />
      <Route path="/OrderRouteMap" element={<OrderRouteMap />} />
      <Route path="/MyOrders" element={<MyOrders />} />
      <Route path="/Notifications" element={<Notifications />} />




    </Routes>
  );
};

export default Routers;
