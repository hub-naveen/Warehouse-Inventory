import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Forecast from './pages/Forecast';
import Optimization from './pages/Optimization';
import Analytics from './pages/Analytics';
import Regional from './pages/Regional';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-primary/30">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/overview" element={<Layout><Home /></Layout>} />
        <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
        <Route path="/forecast" element={<Layout><Forecast /></Layout>} />
        <Route path="/optimization" element={<Layout><Optimization /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/regional" element={<Layout><Regional /></Layout>} />
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
