import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import Navbar from './components/Navbar';
import LoginUser from './components/login/LoginUser'
import SignupDormer from './components/signup/SignupDormer';
import SignupDormManager from './components/signup/SignupManager';
import DormManager from './components/dashboards/DormManager';
import Dormers from './components/dashboards/Dormers';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainSignup from './components/signup/MainSignup';
import BalayCawayan from './components/privateDormInfo/BalayCawayan';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login/dormer" element={<LoginUser />} />
            <Route path="/login/manager" element={<LoginUser />} />
            <Route path="/signup" element={<MainSignup />} />
            <Route path="/signup/dormer" element={<SignupDormer />} />
            <Route path="/signup/manager" element={<SignupDormManager />} />

            {/*PRIVATE DORMS */}
            <Route path="/private/balaycawayan" element={<BalayCawayan />} />
           
           {/*PROTECTED ROUTES */}
            <Route
              path="/dorm-manager"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <DormManager />
                </ProtectedRoute>
              }
            />
        
            <Route
              path="/dormers"
              element={
                <ProtectedRoute allowedRoles={['dormer']}>
                  <Dormers />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
