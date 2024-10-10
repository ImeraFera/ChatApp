import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserData } from '../redux/slices/userSlice';
import { auth } from '../configs/firebaseConfig';
import { Box, CircularProgress } from '@mui/material';

const PrivateRoute = ({ element }) => {


    const currentUser = useSelector((state) => state.user.currentUser);

    return currentUser ? element : <Navigate to="/starting" />;
};

export default PrivateRoute;
