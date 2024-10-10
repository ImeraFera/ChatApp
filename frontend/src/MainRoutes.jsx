import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Starting from './pages/Starting';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';

function MainRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Starting />} />
            <Route path="/starting" element={<Starting />} />
            <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        </Routes>
    );
}

export default MainRoutes;
