import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Challenges from './pages/Challenges';
import CreateChallenge from './pages/CreateChallenge';
import SolveChallenge from './pages/SolveChallenge';
import PageNotFound from './pages/PageNotFound';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import './App.css';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
      <div className="min-h-screen w-full bg-white dark:bg-neutral-800">
        <Router>
        <Navigation />
          <Routes>
            <Route path="/" element={
              <PublicRoute>
                <Login />
              </PublicRoute>} />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>} />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>} />
            <Route path="/logout" element={
              <PrivateRoute>
                <Logout />
              </PrivateRoute>
              } />
            <Route path="/profile/:username" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>} />"
            <Route path="/home" element={
              <PrivateRoute>
                <Challenges />
              </PrivateRoute>} />
            <Route path="/challenges" element={
              <PrivateRoute>
                <Challenges />
              </PrivateRoute>} />
            <Route path="/createChallenge" element={
              <PrivateRoute>
                <CreateChallenge />
              </PrivateRoute>} />
            <Route path="/challenges/:id" element={
              <PrivateRoute>
                <SolveChallenge />
              </PrivateRoute>} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </div>
  );
}
export default App;
