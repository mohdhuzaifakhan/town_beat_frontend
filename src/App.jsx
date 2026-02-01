import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Groups from './pages/Groups'
import Polls from './pages/Polls'
import Campaigns from './pages/Campaigns'
import Profile from './pages/Profile'
import VerifyEmail from './pages/VerifyEmail'
import AdminAds from './pages/AdminAds'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AdsManager from './pages/AdsManager'
import SinglePost from './pages/SinglePost'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <main className="mx-auto px-4 py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/ads" element={<AdminAds />} />
          <Route path="/ads/manager" element={<AdsManager />} />
          <Route path="/ads/manager" element={<AdsManager />} />
          <Route path="/ads/create" element={<AdsManager />} />
          <Route path="/post/:id" element={<SinglePost />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
