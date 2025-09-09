import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Explore from './components/routes/Explore'
import Login from './components/routes/Login'
import Signup from './components/routes/Signup'
import Profile from './components/routes/Profile'
import ProtectedRoute from './components/routes/ProtectedRoute'
import { Toaster } from 'sonner'
import Teach from './components/routes/Teach'
import Learn from './components/routes/Learn'
import Info from './components/routes/Info'
import Matchmaking from './components/routes/Matchmaking'
import Peer from './components/routes/Peer'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Info /></ProtectedRoute>} />
        <Route path="/teach" element={<ProtectedRoute><Teach /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/matchmaking" element={<ProtectedRoute><Matchmaking /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/peer" element={<ProtectedRoute><Peer /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
