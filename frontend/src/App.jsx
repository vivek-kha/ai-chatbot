import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SupportPage from './pages/SupportPage';
import './App.css';

import AdminLayout from './admin/components/AdminLayout';
import FaqList from './admin/pages/FaqList';
import FaqEditor from './admin/pages/FaqEditor';
import AdminSessions from './admin/pages/AdminSessions';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public user chat */}
        <Route
          path="/"
          element={
            <div className="App">
              <SupportPage />
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="faqs" element={<FaqList />} />
          <Route path="faqs/new" element={<FaqEditor />} />
          <Route path="faqs/:id/edit" element={<FaqEditor />} />
          <Route path="sessions" element={<AdminSessions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
