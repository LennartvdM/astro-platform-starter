// src/App.jsx — SPA with Home and Blog routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Blog from './pages/Blog';
import Toolbox from './pages/Toolbox';
import SidebarScrollSpyDemo from './components/Sidebar';
import Home from './pages/Home';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/neoflix" element={<SidebarScrollSpyDemo />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/toolbox" element={<Toolbox />} />
        </Routes>
      </div>
    </Router>
  );
}
