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
import Settings from './pages/Settings'
import GroupDetail from './pages/GroupDetail'

function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isCreatePollModalOpen, setIsCreatePollModalOpen] = useState(false);
  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar
        onCreatePost={() => setIsCreateModalOpen(true)}
        onCreateGroup={() => setIsCreateGroupModalOpen(true)}
        onCreatePoll={() => setIsCreatePollModalOpen(true)}
        onCreateCampaign={() => setIsCreateCampaignModalOpen(true)}
        onCreateAd={() => setIsCreateAdModalOpen(true)}
      />
      <main className="mx-auto px-0 md:px-4 py-3">
        <Routes>
          <Route path="/" element={<Home onCreatePostClick={() => setIsCreateModalOpen(true)} isCreateModalOpen={isCreateModalOpen} setCreateModalOpen={setIsCreateModalOpen} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/groups" element={<Groups isCreateModalOpen={isCreateGroupModalOpen} setCreateModalOpen={setIsCreateGroupModalOpen} />} />
          <Route path="/polls" element={<Polls isCreateModalOpen={isCreatePollModalOpen} setCreateModalOpen={setIsCreatePollModalOpen} />} />
          <Route path="/campaigns" element={<Campaigns isCreateModalOpen={isCreateCampaignModalOpen} setCreateModalOpen={setIsCreateCampaignModalOpen} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin/ads" element={<AdminAds />} />
          <Route path="/ads/manager" element={<AdsManager isCreateModalOpen={isCreateAdModalOpen} setCreateModalOpen={setIsCreateAdModalOpen} />} />
          <Route path="/ads/create" element={<AdsManager isCreateModalOpen={isCreateAdModalOpen} setCreateModalOpen={setIsCreateAdModalOpen} />} />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/groups/:id" element={<GroupDetail isCreateModalOpen={isCreateModalOpen} setCreateModalOpen={setIsCreateModalOpen} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
