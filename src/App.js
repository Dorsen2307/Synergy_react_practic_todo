import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { SprintProvider } from './context/SprintContext';
import { UserProvider } from './context/UserContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ActiveSprint from './pages/ActiveSprint';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  return (
    <UserProvider>
      <TaskProvider>
        <SprintProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/active-sprint" element={<ActiveSprint />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </Layout>
          </Router>
        </SprintProvider>
      </TaskProvider>
    </UserProvider>
  );
}

export default App;