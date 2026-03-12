import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="logo">
          <h2>Task Manager</h2>
        </div>
        <ul className="nav-menu">
          <li className={location.pathname === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard">📊 Рабочий стол</Link>
          </li>
          <li className={location.pathname === '/active-sprint' ? 'active' : ''}>
            <Link to="/active-sprint">🚀 Активный спринт</Link>
          </li>
          <li className={location.pathname === '/admin' ? 'active' : ''}>
            <Link to="/admin">⚙️ Админ панель</Link>
          </li>
        </ul>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;