import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Login from './components/routes/Login'
import Signup from './components/routes/Signup'
import ProtectedRoute from './components/routes/ProtectedRoute'
import { Toaster } from 'sonner'
import React, { Suspense } from 'react'
import Spinner from './components/Spinner'

const Home = React.lazy(() => import('./components/routes/Home'));
const Teach = React.lazy(() => import('./components/routes/Teach'));
const Learn = React.lazy(() => import('./components/routes/Learn'));
const Explore = React.lazy(() => import('./components/routes/Explore'));
const Matchmaking = React.lazy(() => import('./components/routes/Matchmaking'));
const Profile = React.lazy(() => import('./components/routes/Profile'));
const Peer = React.lazy(() => import('./components/routes/Peer'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Suspense fallback={<Spinner />}>
              <Home />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/teach" element={
          <ProtectedRoute>
            <Suspense fallback={<Spinner />}>
              <Teach />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/learn" element={
          <ProtectedRoute>
            <Suspense fallback={<Spinner />}>
              <Learn />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/explore" element={
          <ProtectedRoute>
            <Suspense fallback={<Spinner />}>
              <Explore />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/matchmaking" element={
          <ProtectedRoute>
            <Suspense fallback={<Spinner />}>
              <Matchmaking />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Suspense fallback={<Spinner />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/peer" element={
          <ProtectedRoute>
            <Suspense fallback={<Spinner />}>
              <Peer />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
